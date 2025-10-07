import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsPositive } from "class-validator";

export class CreateOrderDto {


  @ApiProperty({
    example: '32',
    description: 'ID of the user',
    type: 'number'
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  public userId: number;


  @ApiProperty({
    example: '32',
    description: 'ID of the product',
    type: 'number'
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  public productId: number;


  @ApiProperty({
    example: '32',
    description: 'quantity of the product',
    type: 'number'
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  public quantity: number;


  @ApiProperty({
    example: '123.12',
    description: 'total price of the order',
    type: 'number',

  })
  @IsNumber({
    maxDecimalPlaces: 4,
  })
  @IsPositive()
  @Type(() => Number)
  public totalPrice: number;
}
