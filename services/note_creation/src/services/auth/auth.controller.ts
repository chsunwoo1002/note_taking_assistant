import type { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpPost, type interfaces } from "inversify-express-utils";

import type { IAuthService } from "@/common/types/interfaces/auth.interface";
import { DEPENDENCY_IDENTIFIERS } from "@/common/utils/constants";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

@controller("/auth")
export class AuthController implements interfaces.Controller {
  constructor(
    @inject(DEPENDENCY_IDENTIFIERS.AuthService)
    private readonly authService: IAuthService,
  ) {}

  @httpPost("/jwt-token")
  async getJwtToken(req: Request, res: Response) {
    const accessToken: string = req.body.accessToken;
    const serviceResponse = await this.authService.getJwtToken(accessToken);
    return handleServiceResponse(serviceResponse, res);
  }
}
