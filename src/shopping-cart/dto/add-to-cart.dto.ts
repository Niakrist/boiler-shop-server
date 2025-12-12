import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class addToCartDto {
  @ApiProperty({ example: 'cmizx1v870000ykv4emwf7csx' })
  @IsString()
  partId: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number = 1;
}
