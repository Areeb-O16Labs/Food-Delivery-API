import { ApiProperty } from "@nestjs/swagger"
import { ArrayMinSize, IsArray, IsUUID, ValidateNested } from "class-validator";
import { CreateOrderItemDto } from "./create-orderItem.dto";
import { Type } from "class-transformer";

export class CreateOrderDto {
    @ApiProperty()    
    @IsUUID()
    restaurant_id: string;

    @ApiProperty({ type: [CreateOrderItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    @ArrayMinSize(1)
    menus: CreateOrderItemDto[];
}
