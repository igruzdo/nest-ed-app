import { Body, ClassSerializerInterceptor, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('.signup')
  public createUser(@Body() body: CreateUserDto): void {
    this.usersService.create(body.email, body.password);
  }

  @UseInterceptors(ClassSerializerInterceptor)
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
