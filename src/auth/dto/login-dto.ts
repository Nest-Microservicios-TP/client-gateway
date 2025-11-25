import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {

  @ApiProperty({
    example: 'superadmin@example.com',
    description: 'Email of the user',
  })
  @IsEmail()
  email: string;


  @ApiProperty({
    example: 'supersecurepassword',
    description: 'Password of the user',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  @Transform(({ value }) => value.trim())
  password: string;
}
