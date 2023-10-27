import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('.signup')
  public createUser(@Body() body: CreateUserDto): void {
    this.usersService.create(body.email, body.password);
  }

  @Get('/:id')
  public findUser(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get()
  public findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  public deleteUser(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
