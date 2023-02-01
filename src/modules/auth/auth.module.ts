import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwt } from 'config/jwt';

const jwtM = [
  PassportModule.register({
    defaultStrategy: 'jwt',
    property: 'user',
    session: false,
  }),
  JwtModule.register({
    secret: jwt.secret,
    signOptions: {
      expiresIn: jwt.exp,
    },
  }),
]

@Module({
  imports:[...jwtM],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
