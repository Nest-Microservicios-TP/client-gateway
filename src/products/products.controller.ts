import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AuthRolGuard } from 'src/auth/guards/auth_rol.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('products')
@UseGuards(AuthGuard, AuthRolGuard)
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly ProductClient: ClientProxy
  ) { }

  @Post()
  @Roles('superadmin')
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.ProductClient.send({ cmd: 'create_product' }, createProductDto).pipe(
      catchError(err => { throw new RpcException(err) })
    )
  }

  @Get()
  @Roles('superadmin', 'client')
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.ProductClient.send({ cmd: 'find_all_products' }, paginationDto).pipe(
      catchError(err => { throw new RpcException(err) })
    )
  }

  @Get(':id')
  @Roles('superadmin', 'client')
  async findOneProduct(@Param('id') id: string) {
    return this.ProductClient.send({ cmd: 'find_one_product' }, { id })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
  }

  @Patch(':id')
  @Roles('superadmin')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto) {
    return this.ProductClient.send({ cmd: 'update_product' }, { id, ...updateProductDto })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
  }

  @Delete(':id')
  @Roles('superadmin')
  deleteProduct(@Param('id') id: string) {
    return this.ProductClient.send({ cmd: 'delete_product' }, { id })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
  }

  
}
