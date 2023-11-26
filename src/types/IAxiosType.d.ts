declare namespace IAxiosType {
  interface Response {
    status: number;
    code: string;
    message: string;
    data?: any;
  }
}
