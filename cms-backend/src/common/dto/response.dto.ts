import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto<T = any> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty()
  data: T;
}

export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'Error message' })
  message: string;

  @ApiProperty({ example: 400 })
  statusCode: number;
}

export class UserDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;
}

export class RoleDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'admin' })
  name: string;

  @ApiProperty({ example: 'Administrator role' })
  description: string;

  @ApiProperty()
  createdAt: Date;
}

export class PermissionDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'blog.create' })
  key: string;

  @ApiProperty()
  description: string;
}

export class BlogDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'my-blog-post' })
  slug: string;

  @ApiProperty({ example: 'published', enum: ['draft', 'published'] })
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class NewsDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'breaking-news' })
  slug: string;

  @ApiProperty({ example: 'published', enum: ['draft', 'published'] })
  status: string;

  @ApiProperty()
  publishedAt: Date;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  createdAt: Date;
}

export class AuthTokenDto {
  @ApiProperty({ example: 'eyJhbGc...' })
  accessToken: string;
}
