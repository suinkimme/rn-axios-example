// constants
import { TOKEN_KEY, ENDPOINT } from './Constants';

// functions
import { post } from './AxiosRequest';
import { storeData } from './AsyncStorage';

/** 액세스 토큰 재발급 받는 함수 */
export const refreshAccessToken = async () => {
  // 재발급 에러 핸들링 해야함
  try {
    const response = await post(ENDPOINT.auth.refresh);
    await storeData(TOKEN_KEY, response.data);
  } catch (err) {
    console.warn(err);
  }
};
