import {
  IsOptional,
  IsString,
  IsIn,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class NewsTranslationDto {
  @ApiProperty({ example: 'en', description: 'Language code' })
  @IsString()
  languageCode: string;

  @ApiProperty({ example: 'News Title', description: 'Post title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Updated content...', description: 'Post content' })
  @IsString()
  content: string;
}

export class UpdateNewsDto {
  @ApiProperty({
    example: 'updated-news-slug',
    description: 'URL slug',
    required: false,
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({
    example: 'published',
    enum: ['draft', 'published'],
    required: false,
  })
  @IsOptional()
  @IsIn(['draft', 'published'])
  status?: string;

  @ApiProperty({
    example: 'user-id',
    description: 'Author user ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  authorId?: string;

  @ApiProperty({ type: 'array', items: { type: 'object' }, required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NewsTranslationDto)
  translations?: NewsTranslationDto[];

  @ApiProperty({
    example: '2026-02-20T10:00:00Z',
    description: 'Publication date',
    required: false,
  })
  @IsOptional()
  publishedAt?: Date;

  @ApiProperty({
    example: '2026-03-20T10:00:00Z',
    description: 'Expiration date',
    required: false,
  })
  @IsOptional()
  expiresAt?: Date;
}
