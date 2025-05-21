import { Type } from "class-transformer"
import { IsNumber, IsPositive } from "class-validator"



export class CreateCartDto {

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    idUser: number


    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    idProduct: number


    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    quantity: number
}