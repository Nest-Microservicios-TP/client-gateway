import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE, envs } from 'src/config';

@Module({
  controllers: [CartController],
  providers: [],
  imports: [
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
  ]
})
export class CartModule {}
