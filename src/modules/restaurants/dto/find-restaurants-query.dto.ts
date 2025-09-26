import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindRestaurantsQueryDto {
  @ApiPropertyOptional({ description: 'Page number for pagination', example: '1' })
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ description: 'Search keyword (e.g. name or address)', example: '' })
  @IsOptional()
  @IsString()
  search?: string;
}