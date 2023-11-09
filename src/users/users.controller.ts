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
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurentUser } from './decorators/current-user.decorator';


@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoami')
  @UseGuards(AuthService)
  public whoAmI(@CurentUser() user: User) {
    return user;
  }

  @Post('/signout')
  public signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get('/colors')
  public getColor(@Session() session: any) {
    return session.color;
  }


  @Post('/signup')
  public async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signUp(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  public async signIn(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;
    return user;
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
