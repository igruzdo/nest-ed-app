import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';

@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/colors/:color')
  public setColor(@Param('color') color: string, @Session() session: any) {
    session.color = color;
  }

  @Get('/colors')
  public getColor(@Session() session: any) {
    return session.color;
  }


  @Post('/signup')
  public createUser(@Body() body: CreateUserDto) {
    return this.authService.signUp(body.email, body.password);
  }

  @Post('/signin')
  public signIn(@Body() body: CreateUserDto) {
    return this.authService.signIn(body.email, body.password);
  }


  @Serialize(UserDto)
  @Get('/:id')
  public findUser(@Param('id') id: string) {
    const user = this.usersService.findOne(+id);
    if(!user) {
      throw new NotFoundException('there is no user')
    }
    return user;
  }

  @Get()
  public findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  public deleteUser(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Patch('/:id')
  public updateUser(@Param() id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(+id, body)
  }
}
