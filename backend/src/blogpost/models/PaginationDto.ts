// src/blog/dtos/pagination.dto.ts
import { IsNumber, IsOptional } from 'class-validator';


export class PaginationDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  pageSize?: number;
}
