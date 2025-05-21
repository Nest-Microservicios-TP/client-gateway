import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, AUTH_SERVICE } from 'src/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [],
  imports: [JwtModule.register({
    global: true,
    secret: envs.token || 'secreto',
    signOptions: { expiresIn: "1d" },
  }),
    ClientsModule.register([

      { 
        name: AUTH_SERVICE, 
        transport: Transport.TCP,
        options: {
          host: envs.auth_ms_host,
          port: envs.auth_ms_port
        }
      },
      
    
    ]),
  ],
})
export class AuthModule {}
