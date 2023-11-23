import { NestMiddleware } from "@nestjs/common";
import { UsersService } from "../users.service";
import { NextFunction } from "express";

export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    //@ts-ignore
    const { userId } = req.session || {};

    if(userId) {
      const user = await this.usersService.findOne(userId);
      //@ts-ignore
      req.currentUser = user;
    }

    next();
  }
}