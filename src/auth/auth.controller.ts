import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register-dto';
import { LoginDto } from './dto/login-dto';
import { AuthGuard } from './guards/auth.guard';
import { AuthRolGuard } from './guards/auth_rol.guard';
import { Roles } from './decorators/roles.decorator';
import { CreateCartDto } from 'src/products/dto/create-cart.dto';
import { UpdateCartDto } from 'src/products/dto/update-user-cart.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}


  @UseGuards(AuthGuard, AuthRolGuard)
  @Roles('superadmin')
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
