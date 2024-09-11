import type { ServiceResponse } from "@/common/models/serviceResponse";

export interface IUserInfoAuth0 {
  sub: string;
  given_name: string;
  family_name: string;
  nickname: string;
  name: string;
  picture: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
}

export interface IUser {
  userId: string;
  givenName: string;
  familyName: string;
  nickname: string;
  name: string;
  picture: string;
  updatedAt: string;
  email: string;
  emailVerified: boolean;
}

export interface IAuthService {
  getJwtToken(accessToken: string): Promise<ServiceResponse<string | null>>;
}

export interface IAuthRepository {
  createUser(user: IUserInfoAuth0): Promise<IUser>;
}
