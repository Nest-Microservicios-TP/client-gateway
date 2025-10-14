import { Controller, Get, Post, Body, Param, Inject } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Orders') 
@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly orderClient: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new order',
    description: 'Creates a new order with the provided data.',
  })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data provided in the request body.',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized access.',
  })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderClient.send({ cmd: 'createOrder' }, createOrderDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all orders',
    description: 'Returns a list of all registered orders.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all orders returned successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized access.',
  })
  findAll() {
    return this.orderClient.send({ cmd: 'findAllOrders' }, {}).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get one order by ID',
    description: 'Fetches the details of a specific order using its ID.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The unique identifier of the order',
  })
  @ApiResponse({
    status: 200,
    description: 'Order found and returned successfully.',
  })
  @ApiResponse({
      status: 403,
      description: 'Unauthorized access.',
    })
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
  })
  findOne(@Param('id') id: string) {
    return this.orderClient.send({ cmd: 'findOneOrder' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

   @Get('user/:id')
  @ApiOperation({
    summary: 'Get one order by ID',
    description: 'Fetches the details of a specific order using its ID.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The unique identifier of the order',
  })
  @ApiResponse({
    status: 200,
    description: 'Order found and returned successfully.',
  })
  @ApiResponse({
      status: 403,
      description: 'Unauthorized access.',
    })
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
  })
  findOneByUser(@Param('userId') userId: number) {
    return this.orderClient.send({ cmd: 'findOneOrderByUser' }, { userId }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

 
  
}
