import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsPositive, IsString } from "class-validator";

export class CreateProductDto {


    @ApiProperty({
        example: 'Banana',
        description: 'name of the product',
        type: 'string'
    })
    @IsString()
    public name: string

    @ApiProperty({
        example: '25.16',
        description: 'price of the product',
        type: 'number'
    })
    @IsNumber({
        maxDecimalPlaces: 4
    })
    @IsPositive()
    @Type(() => Number)
    public price: number



    @ApiProperty({
        example: '32',
        description: 'stock of the product',
        type: 'number'
    })
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    public stock: number

}
