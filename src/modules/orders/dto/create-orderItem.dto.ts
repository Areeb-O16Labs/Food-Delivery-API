import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsInt, IsNumber, Min } from "class-validator";

export class CreateOrderItemDto {
  @ApiProperty()
  @IsUUID()
  menuId: string;

  @ApiProperty()
  // @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;
}
