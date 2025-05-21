import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateCartDto } from 'src/products/dto/create-cart.dto';
import { UpdateCartDto } from 'src/products/dto/update-user-cart.dto';

@Controller('cart')
export class CartController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy
  ) { }

  //Logica de carrito desde el auth-ms
  @Post()
  @Roles('superadmin')
  createCart(@Body() createCartDto: CreateCartDto) {
    return this.authClient.send({ cmd: 'createUserCart' }, createCartDto).pipe(
      catchError(err => { throw new RpcException(err) })
    )
  }

  @Get()
  @Roles('superadmin', 'client')
  findAllCarts() {
    return this.authClient.send({ cmd: 'findAllUserCart' }, {}).pipe(
      catchError(err => { throw new RpcException(err) })
    )
  }

  @Get(':id')
  @Roles('superadmin', 'client')
  findOneCart(@Param('id', ParseIntPipe) id: number) {
    return this.authClient.send({ cmd: 'findOneUserCart' }, { id })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
  }

  @Patch(':id')
  @Roles('superadmin')
  updateCart(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartDto: UpdateCartDto) {
    return this.authClient.send({ cmd: 'updateUserCart' }, { id, ...updateCartDto })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
  }

  @Delete(':id')
  @Roles('superadmin')
  deleteCart(@Param('id') id: string) {
    return this.authClient.send({ cmd: 'removeUserCart' }, { id })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
  }
}
