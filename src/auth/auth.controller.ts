import {
  Body,
  Controller,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register-dto';
import { LoginDto } from './dto/login-dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await firstValueFrom(
      this.authClient.send({ cmd: 'registerUser' }, registerDto).pipe(
            catchError(err => {throw new RpcException(err)})
          ),
    );
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await firstValueFrom(
      this.authClient.send({ cmd: 'loginUser' }, loginDto).pipe(
      catchError(err => {throw new RpcException(err)})
    ),
    );
  }
}
