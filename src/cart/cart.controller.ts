import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateUserCartDto } from './dto/create-user-cart.dto';
import { PRODUCT_SERVICE } from 'src/config';
import { UpdateUserCartDto } from './dto/update-user-cart.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AuthRolGuard } from 'src/auth/guards/auth_rol.guard';
import { RequestWithUser } from 'src/common';

@Controller('carts')
@UseGuards(AuthGuard, AuthRolGuard)
export class CartController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly ProductClient: ClientProxy
  ) { }

  @Post()
  @Roles('superadmin', 'client')
  createCart(@Body() createUserCartDto: CreateUserCartDto, @Req() req: RequestWithUser) {
    createUserCartDto.idUser = req.user.id;
    return this.ProductClient.send({cmd: 'createUserCart'}, createUserCartDto).pipe(
      catchError(err => { throw new RpcException(err) })
    )
  }

  @Get()
  @Roles('superadmin', 'client')
  findAllCarts() {
    return this.ProductClient.send({ cmd: 'findAllUserCart' }, {}).pipe(
      catchError(err => { throw new RpcException(err) })
    )
  }

  @Get('userCarts/:id')
  @Roles('superadmin', 'client')
  findAllCartsByUser(@Param('id', ParseIntPipe) id: number) {
    return this.ProductClient.send({ cmd: 'findAllUserCartByUser' }, { id })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
  }

  @Get(':id')
  @Roles('superadmin', 'client')
  findOneCart(@Param('id', ParseIntPipe) id: number) {
    return this.ProductClient.send({ cmd: 'findOneUserCart' }, { id })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
  }

  @Patch(':id')
  @Roles('superadmin')
  updateCart(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserCartDto: UpdateUserCartDto) {
    return this.ProductClient.send({ cmd: 'updateUserCart' }, { id, ...updateUserCartDto })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
  }

  @Delete(':id')
  @Roles('superadmin')
  deleteCart( @Param('id', ParseIntPipe) id: number) {
    return this.ProductClient.send({ cmd: 'removeUserCart' }, { id })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
  }

  @Post('buyCart/:id')
  @Roles('superadmin', 'client')
  buyCart( @Param('id', ParseIntPipe) id: number) {
    return this.ProductClient.send({ cmd: 'buyUserCart' }, { id })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
  }
}


