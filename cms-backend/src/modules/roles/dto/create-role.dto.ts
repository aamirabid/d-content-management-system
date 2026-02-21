import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin', description: 'Role name' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Administrator role',
    description: 'Role description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
