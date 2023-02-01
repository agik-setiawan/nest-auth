import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwt } from 'config/jwt';
import { omit } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private db: PrismaService) {}

  /**
   * Register User
   */
  async register(register: RegisterDto | any) {
    try {
      if (await this.db.user.findFirst({ where: { email: register.email } })) {
        return {
          statusCode: 400,
          message: 'Register success',
        };
      }
      const createUser = await this.db.user.create({ data: { ...register } });
      if (createUser) {
        return {
          data: null,
          message: 'Register user success',
        };
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async login(login: LoginDto) {
    const user = await this.db.user.findFirst({ where: { email: login.email } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    let checkPassword = await bcrypt.compare(login.password, user.password);
    if (!checkPassword) {
      throw new HttpException('Credential Incorrect', HttpStatus.UNAUTHORIZED);
    }
    const accessToken = await this.generateJwt(user.id, user.email, user.name);
    return {
      accessToken: accessToken,
      user: omit(user, ['password']),
    };
  }

  async generateJwt(
    userId: any,
    email: any,
    name: any,
    secret: any = jwt.secret,
    expired = jwt.exp,
  ) {
    let accessToken = await this.jwtService.sign(
      {
        sub: userId,
        user_id: userId,
        email,
        name,
      },
      {
        expiresIn: expired,
        secret,
      },
    );
    return accessToken;
  }
}