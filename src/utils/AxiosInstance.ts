import axios from 'axios';
import { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

// utils
import {
  BASE_URL,
  TIMEOUT,
  CONTENT_TYPE,
  HTTP_ERROR,
  USER_DATA_KEY,
  TOKEN_KEY,
} from './Constants';
import { refreshAccessToken } from './Jwt';
import { getData } from './AsyncStorage';
import { getIP } from './DeviceInfo';

/** headers에 액세스, 리프레시 토큰 삽입 */
const setCommonHeaders = async (config: InternalAxiosRequestConfig) => {
  config.headers['Content-Type'] = CONTENT_TYPE;

  // 토큰이 없으면 reject 되게끔 담지 않도록한다.
  const token = await getData(TOKEN_KEY);
  if (token !== undefined) {
    const { accessToken, refreshToken } = token;
    config.headers.authorization = `Bearer ${accessToken}`;
    config.headers.refresh = refreshToken;
  }

  // method가 get이 아닐 때 IP 포함
  if (config.method !== 'get') {
    // IP를 가져올 수 있으면
    const ip = await getIP();
    if (ip !== undefined) {
      config.data = {
        ...config.data,
        ip,
      };
    }
  }

  // 회원 정보를 기기에 저장하고 있다면 데이터에 삽입
  const userData = await getData(USER_DATA_KEY);
  if (userData !== undefined) {
    const { userIdx, userId } = userData;

    // GET일 때는 Query에 담아줘야함
    if (config.method !== 'get') {
      config.data = {
        ...config.data,
        userIdx,
        userId,
      };
    } else {
      config.params = {
        ...config.params,
        userIdx,
        userId,
      };
    }
  }

  return config;
};

/** Axios 요청 에러 핸들링 */
const handleRequestError = (err: AxiosError) => {
  return Promise.reject(err);
};

/** Axios 응답 에러 핸들링 */
const handleResponseError = async (err: AxiosError) => {
  // 네트워크 및 Axios 자체 에러 핸들링
  if (!err.response) {
    return Promise.reject(HTTP_ERROR.serviceUnavailable);
  }

  // 서버에서 전달하는 에러 핸들링
  const { status } = err.response;
  const { code } = err.response.data as IAxiosType.Response;
  switch (status) {
    case 401:
      // 여기서 재발급 프로세스 진행하면됨
      console.log('액세스 토큰이 만료되었습니다. 다시 시도해주세요.');
      if (code === 'unauthorized') {
        await refreshAccessToken();
      }
      return Promise.reject(err.response.data);
    default:
      return Promise.reject(err.response.data);
  }
};

/** Axios 응답 성공 핸들링 */
const handleResponseSuccess = (response: AxiosResponse) => {
  return response;
};

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

instance.interceptors.request.use(setCommonHeaders, handleRequestError);
instance.interceptors.response.use(handleResponseSuccess, handleResponseError);

export default instance;
