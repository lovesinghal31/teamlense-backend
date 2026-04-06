export interface IUser {
  id: string;
  name: string;
  email: string;
  skills: string;
}

export interface IAccessTokenPayload {
  id: string;
  name: string;
  email: string;
}

export interface IRefreshTokenPayload {
  id: string;
}

export interface ILoginResponse {
  id: string;
  accessToken: string;
}
