import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class addToCartDto {
  @ApiProperty({ example: 'name' })
  @IsString()
  readonly username: string;

  @ApiProperty({ example: 'cmizx1v870000ykv4emwf7csx' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ example: 'cmizx1v870000ykv4emwf7csx' })
  @IsNotEmpty()
  @IsString()
  readonly partId: string;
}
