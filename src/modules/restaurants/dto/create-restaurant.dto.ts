import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRestaurantDto {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    address: string; 
    
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty({ required: true })
    @IsNumber()
    @IsNotEmpty()
    rating: number;
}
