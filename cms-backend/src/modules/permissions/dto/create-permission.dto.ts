import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({ example: 'blog.create', description: 'Permission key' })
  @IsString()
  key: string;

  @ApiProperty({
    example: 'Allows creating blog posts',
    description: 'Permission description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
