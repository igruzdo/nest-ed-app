import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let usersServiceMock: Partial<UsersService>
  let authServiceMock: Partial<AuthService>

  beforeEach(async () => {
    usersServiceMock = {
      findOne: (id) => {
        return Promise.resolve({id, email: 'asdf@asdf.com', password: 'asdfasdf'} as User)
      },
      find: (email: string) => {
        return Promise.resolve([{id: 1, email} as User])
      },
      // remove: () => {},
      // update: () => {},
    }

    authServiceMock = {
      // signIn: () => {},
      // signUp: () => {},
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock
        },
        {
          provide: AuthService,
          useValue: authServiceMock
        }
      ],

    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  
  it('findUser throws an error if user with given id is not found', async () => {
    usersServiceMock.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });
});
