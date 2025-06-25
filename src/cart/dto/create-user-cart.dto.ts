import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsPositive } from "class-validator"

export class CreateUserCartDto {
    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    idUser?: number


    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    idProduct: number


    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    quantity: number
}
