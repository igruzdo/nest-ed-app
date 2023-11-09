import { ExecutionContext, createParamDecorator } from "@nestjs/common";


export const CurentUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  }
)