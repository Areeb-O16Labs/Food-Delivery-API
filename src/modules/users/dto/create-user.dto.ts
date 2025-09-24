import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    password: string;
}
