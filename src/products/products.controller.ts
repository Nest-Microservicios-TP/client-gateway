import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly ProductClient: ClientProxy
  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.ProductClient.send({cmd: 'create_product'}, createProductDto).pipe(
      catchError(err => {throw new RpcException(err)})
    )
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.ProductClient.send({cmd: 'find_all_products'}, paginationDto).pipe(
      catchError(err => {throw new RpcException(err)})
    )
  }

  @Get(':id')
  async findOneProduct(@Param('id') id: string) {
    return this.ProductClient.send({cmd: 'find_one_product'}, {id})
      .pipe(
        catchError(err => {throw new RpcException(err)})
      )
  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateProductDto: UpdateProductDto) {
    return this.ProductClient.send({cmd: 'update_product'}, {id, ...updateProductDto})
      .pipe(
        catchError(err => {throw new RpcException(err)})
      )
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.ProductClient.send({cmd: 'delete_product'}, {id})
      .pipe(
        catchError(err => {throw new RpcException(err)})
      )
  }


}
