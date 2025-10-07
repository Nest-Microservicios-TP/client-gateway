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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) { }


  @ApiOperation({
    summary: 'Register a new user',
    description: 'Allows the superadmin create users',
  })
  @ApiBearerAuth()
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User created',
  })
  @ApiResponse({
    status: 403,
    description: 'Not allowed',
  })
  @UseGuards(AuthGuard, AuthRolGuard)
  @Roles('superadmin')
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await firstValueFrom(
      this.authClient.send({ cmd: 'registerUser' }, registerDto).pipe(
        catchError(err => { throw new RpcException(err) })
      ),
    );
  }


  @ApiOperation({
    summary: 'Login',
    description: 'Log in and get your JWT token',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Logged in',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid Login',
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await firstValueFrom(
      this.authClient.send({ cmd: 'loginUser' }, loginDto).pipe(
        catchError(err => { throw new RpcException(err) })
      ),
    );
  }

}
