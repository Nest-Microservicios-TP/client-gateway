import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateUserCartDto } from './dto/create-user-cart.dto';
import { PRODUCT_SERVICE } from 'src/config';
import { UpdateUserCartDto } from './dto/update-user-cart.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AuthRolGuard } from 'src/auth/guards/auth_rol.guard';
import { RequestWithUser } from 'src/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Carts')
@Controller('carts')
@UseGuards(AuthGuard, AuthRolGuard)
@ApiBearerAuth('access-token')
export class CartController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly ProductClient: ClientProxy
  ) { }


  @Post()
  @Roles('superadmin', 'client')
  @ApiOperation({
    summary: 'Create a new cart',
    description: 'Creates a new shopping cart for the authenticated user.',
  })
  @ApiBody({ type: CreateUserCartDto })
  @ApiResponse({
    status: 201,
    description: 'Cart created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid cart data provided.',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized access.',
  })
  createCart(
    @Body() createUserCartDto: CreateUserCartDto,
    @Req() req: RequestWithUser,
  ) {
    createUserCartDto.idUser = req.user.id;
    return this.ProductClient.send(
      { cmd: 'createUserCart' },
      createUserCartDto,
    ).pipe(catchError((err) => { throw new RpcException(err); }));
  }

  @Get()
  @Roles('superadmin', 'client')
  @ApiOperation({
    summary: 'Get all carts',
    description: 'Retrieves all existing carts in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all carts retrieved successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized access.',
  })
  findAllCarts() {
    return this.ProductClient.send({ cmd: 'findAllUserCart' }, {}).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Get('userCarts/:id')
  @Roles('superadmin', 'client')
  @ApiOperation({
    summary: 'Get all carts by user ID',
    description: 'Retrieves all carts that belong to a specific user.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Carts for the user retrieved successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found or no carts available.',
  })
  findAllCartsByUser(@Param('id', ParseIntPipe) id: number) {
   
    return this.ProductClient.send({ cmd: 'findAllUserCartByUser' }, { id }).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Get('userCartsToken')
  @Roles('superadmin', 'client')
  findAllCartsByUserToken(@Req() req: RequestWithUser,) {
    const id = req.user.id;

    console.log(req.user.id)
    return this.ProductClient.send({ cmd: 'findAllUserCartByUserToken' }, { id }).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Get(':id')
  @Roles('superadmin', 'client')
  @ApiOperation({
    summary: 'Get a single cart by ID',
    description: 'Retrieves a specific cart using its ID.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Cart ID' })
  @ApiResponse({
    status: 200,
    description: 'Cart retrieved successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart not found.',
  })
  findOneCart(@Param('id', ParseIntPipe) id: number) {
    return this.ProductClient.send({ cmd: 'findOneUserCart' }, { id }).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Patch(':id')
  @Roles('superadmin')
  @ApiOperation({
    summary: 'Update an existing cart',
    description: 'Updates the information of an existing cart by its ID.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Cart ID' })
  @ApiBody({ type: UpdateUserCartDto })
  @ApiResponse({
    status: 200,
    description: 'Cart updated successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart not found.',
  })
  updateCart(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserCartDto: UpdateUserCartDto,
  ) {
    return this.ProductClient.send(
      { cmd: 'updateUserCart' },
      { id, ...updateUserCartDto },
    ).pipe(catchError((err) => { throw new RpcException(err); }));
  }

  @Delete(':id')
  @Roles('superadmin')
  @ApiOperation({
    summary: 'Delete a cart',
    description: 'Removes a cart from the system using its ID.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Cart ID' })
  @ApiResponse({
    status: 200,
    description: 'Cart deleted successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart not found.',
  })
  deleteCart(@Param('id', ParseIntPipe) id: number) {
    return this.ProductClient.send({ cmd: 'removeUserCart' }, { id }).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Get('buyCart/:id')
  @Roles('superadmin', 'client')
  @ApiOperation({
    summary: 'Purchase a cart',
    description: 'Finalizes the purchase process for the specified cart.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Cart ID' })
  @ApiResponse({
    status: 200,
    description: 'Cart purchased successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: 400,
    description: 'Cart cannot be purchased (e.g., empty cart or invalid state).',
  })
  buyCart(@Param('id', ParseIntPipe) id: number) {
    return this.ProductClient.send({ cmd: 'buyUserCart' }, { id }).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

 
}