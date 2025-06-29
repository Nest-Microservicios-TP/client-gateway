import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {envs, PRODUCT_SERVICE } from 'src/config';

@Module({
  controllers: [CartController],
  providers: [],
  imports: [
     ClientsModule.register([
     
           { 
             name: PRODUCT_SERVICE, 
             transport: Transport.TCP,
             options: {
               host: envs.products_ms_host,
               port: envs.products_ms_port
             }
           },
           
         
         ]),
  ]
})
export class CartModule {}
