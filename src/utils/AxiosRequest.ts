import { AxiosError } from 'axios';
import instance from './AxiosInstance';

/** POST(url, data) */
export const post = async (
  url: string,
  data?: any,
): Promise<IAxiosType.Response> => {
  try {
    const response = await instance.post(url, data);
    return response.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      return err.response?.data;
    }

    throw err;
  }
};

/** GET(url, data) */
export const get = async (
  url: string,
  data?: any,
): Promise<IAxiosType.Response> => {
  try {
    const response = await instance.get(url, {
      params: {
        ...data,
      },
    });
    return response.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      return err.response?.data;
    }

    throw err;
  }
};

/** PUT(url, data) */
export const put = async (
  url: string,
  data?: any,
): Promise<IAxiosType.Response> => {
  try {
    const response = await instance.put(url, data);
    return response.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      return err.response?.data;
    }

    throw err;
  }
};

/** DELETE(url, data) */
export const del = async (
  url: string,
  data?: any,
): Promise<IAxiosType.Response> => {
  try {
    const response = await instance.delete(url, {
      data,
    });
    return response.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      return err.response?.data;
    }

    throw err;
  }
};
