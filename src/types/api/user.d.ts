export interface LoginParams {
  code: string;
}

export interface LoginResponse {
  token: string,
  hasMobile: boolean
}

