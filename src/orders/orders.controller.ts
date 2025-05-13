import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(ORDER_SERVICE) private readonly OrderClient: ClientProxy) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.OrderClient.send({cmd: 'createOrder'}, {}).pipe(
      catchError(err => { throw new RpcException(err) })
    );
  }

  @Get()
  findAll() {
    return this.OrderClient.send({cmd: 'findAllOrders'}, {}).pipe(
      catchError(err => { throw new RpcException(err) })
    );
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.OrderClient.send({cmd: 'findOneOrder'}, { id }).pipe(
      catchError(err => { throw new RpcException(err) })
    );
  }

  @Patch(':id')
  changeOrderStatus(@Param('id') id: number) {
    return this.OrderClient.send({cmd: 'changeOrderStatus'}, { id }).pipe(
      catchError(err => { throw new RpcException(err) })
    );
  }


}
