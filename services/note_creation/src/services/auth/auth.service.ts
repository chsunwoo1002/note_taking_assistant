import { ServiceResponse } from "@/common/models/serviceResponse";
import type {
  IAuthRepository,
  IAuthService,
  IUserInfoAuth0,
} from "@/common/types/interfaces/auth.interface";
import { DEPENDENCY_IDENTIFIERS } from "@/common/utils/constants";
import { env } from "@/common/utils/env.config";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(DEPENDENCY_IDENTIFIERS.UserRepository)
    private readonly userRepository: IAuthRepository,
  ) {}

  async getJwtToken(
    accessToken: string,
  ): Promise<ServiceResponse<string | null>> {
    try {
      const userInfo = await fetch(`${env.AUTH0_DOMAIN}/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!userInfo.ok) {
        return ServiceResponse.failure(
          "Failed to fetch user info",
          null,
          StatusCodes.BAD_REQUEST,
        );
      }
      const userJson = (await userInfo.json()) as IUserInfoAuth0;
      const user = await this.userRepository.createUser(userJson);

      const jwtToken = jwt.sign({ userId: user.userId }, env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "1h",
      });

      return ServiceResponse.success("GeneratedJWT token", jwtToken);
    } catch (error) {
      return ServiceResponse.failure(
        "Failed to generate JWT token",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
