import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindUsersQueryDto {
  @ApiPropertyOptional({ description: 'Page number for pagination', example: '1' })
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ description: 'Search keyword (e.g. name or email)', example: 'john' })
  @IsOptional()
  @IsString()
  search?: string;
}