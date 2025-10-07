import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsPositive } from "class-validator"

export class CreateUserCartDto {

    @ApiProperty({
        example: '1',
        description: 'ID of the user',
         type: 'number'
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    idUser?: number


    @ApiProperty({
        example: '32',
        description: 'ID of the product',
         type: 'number'
    })
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    idProduct: number


    @ApiProperty({
        example: 'Amount of the purchased product',
        description: 'Quantity of the product',
         type: 'number'
    })
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    quantity: number
}
