import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { promisify } from "util";
import { randomBytes, scrypt } from "crypto";

const sCrypt = promisify(scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  public async signUp(email: string, password: string ) {
    const users = await this.usersService.find(email);
    if(users.length) {
      throw new BadRequestException('Email in use')
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await sCrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    const user = await this.usersService.create(email, result);
    
    return user;
  }

  public async signIn(email: string, password: string ) {
    const [user] = await this.usersService.find(email);
    if(!user) {
      throw new NotFoundException('not foud user')
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await sCrypt(password, salt, 32)) as Buffer;
    if(storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }
    
    return user;
  }
}