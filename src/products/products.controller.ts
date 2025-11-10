import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AuthRolGuard } from 'src/auth/guards/auth_rol.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Products')
@UseGuards(AuthGuard, AuthRolGuard)
@Controller('Products')
@ApiBearerAuth('access-token')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly ProductClient: ClientProxy,
  ) { }

  @Post()
  @Roles('superadmin')
  @ApiOperation({
    summary: 'Create a new product',
    description: 'Creates a new product. Only accessible to superadmins.',
  })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid product data provided.',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized access.',
  })
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.ProductClient.send(
      { cmd: 'create_product' },
      createProductDto,
    ).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get()
  @Roles('superadmin', 'client')
  @ApiOperation({
    summary: 'Get all products',
    description:
      'Returns a paginated list of all available products. Accessible by superadmins and clients.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination (optional)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (optional)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of products retrieved successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized access.',
  })
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.ProductClient.send(
      { cmd: 'find_all_products' },
      paginationDto,
    ).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get(':id')
  @Roles('superadmin', 'client')
  @ApiOperation({
    summary: 'Get a product by ID',
    description:
      'Retrieves detailed information about a specific product by its ID.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The unique identifier of the product.',
  })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized access.',
  })
  findOneProduct(@Param('id') id: string) {
    return this.ProductClient.send(
      { cmd: 'find_one_product' },
      { id },
    ).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Patch(':id')
  @Roles('superadmin')
  @ApiOperation({
    summary: 'Update an existing product',
    description: 'Updates a product’s data. Only accessible to superadmins.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the product to be updated.',
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid product data provided.',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized access.',
  })
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.ProductClient.send(
      { cmd: 'update_product' },
      { id, ...updateProductDto },
    ).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Delete(':id')
  @Roles('superadmin')
  @ApiOperation({
    summary: 'Delete a product',
    description:
      'Deletes a product by its ID. Only accessible to superadmins.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The unique identifier of the product to delete.',
  })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized access.',
  })
  deleteProduct(@Param('id') id: string) {
    return this.ProductClient.send(
      { cmd: 'delete_product' },
      { id },
    ).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
