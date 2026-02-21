import { IsOptional, IsString, IsEmail, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'John', description: 'First name', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    example: 'newpassword123',
    description: 'New password (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    example: ['role-id-1', 'role-id-2'],
    description: 'Array of role IDs',
    required: false,
  })
  @IsOptional()
  @IsArray()
  roles?: string[];

  @ApiProperty({
    example: true,
    description: 'Active status',
    required: false,
  })
  @IsOptional()
  isActive?: boolean;
}
