import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  pageSize?: number;

  [key: string]: number | undefined | string | boolean;  
}
