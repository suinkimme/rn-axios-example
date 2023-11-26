import { Platform } from 'react-native';

// 스토리지 키값
export const TOKEN_KEY = 'token';
export const USER_DATA_KEY = 'userData';

// baseURL
export const BASE_URL = Platform.select({
  ios: 'http://localhost:8080',
  android: 'http://10.0.2.2:8080',
});
// 서버 타임아웃 시간 (이 시간 넘어가면 네트워크 에러 발생)
export const TIMEOUT = 3000;
// 통신 기본 타입
export const CONTENT_TYPE = 'application/json';

// HTTP 에러
export const HTTP_ERROR = {
  gatewayTimeout: {
    status: 504,
    code: 'gateway_timeout',
    message: '서버와의 통신이 시간 초과되었습니다. 나중에 다시 시도하세요.',
  },
  serviceUnavailable: {
    status: 503,
    code: 'service_unavailable',
    message: '서버 또는 리소스에 접근할 수 없습니다. 나중에 다시 시도하세요.',
  },
};

// 통신 엔드포인트
export const ENDPOINT = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  test: {
    post: '/test/post',
    get: '/test/get',
    put: '/test/put',
    delete: '/test/delete',
  },
};
