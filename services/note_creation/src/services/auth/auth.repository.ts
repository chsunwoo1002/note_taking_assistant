import type { ILogger, ILoggerFactory } from "@/common/logger";
import type {
  IAuthRepository,
  IUser,
  IUserInfoAuth0,
} from "@/common/types/interfaces/auth.interface";
import type { DatabaseConnection } from "@/common/types/types/db.types";
import { DEPENDENCY_IDENTIFIERS } from "@/common/utils/constants";
import { inject, injectable } from "inversify";

@injectable()
export class AuthRepository implements IAuthRepository {
  private readonly logger: ILogger;
  constructor(
    @inject(DEPENDENCY_IDENTIFIERS.Kysely)
    private readonly dbService: DatabaseConnection,
    @inject(DEPENDENCY_IDENTIFIERS.LoggerFactory)
    private readonly loggerFactory: ILoggerFactory,
  ) {
    this.logger = this.loggerFactory.createLogger("DB");
  }

  async createUser(user: IUserInfoAuth0): Promise<IUser> {
    try {
      const query = await this.dbService
        .insertInto("users")
        .values({
          userId: user.sub,
          givenName: user.given_name,
          familyName: user.family_name,
          nickname: user.nickname,
          name: user.name,
          picture: user.picture,
          updatedAt: user.updated_at,
          email: user.email,
          emailVerified: user.email_verified,
        })
        .returningAll()
        .executeTakeFirstOrThrow();
      return query;
    } catch (error) {
      this.logger.error(error, "Error creating user");
      throw error;
    }
  }
}
