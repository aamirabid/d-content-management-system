import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsIn,
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

  @ApiProperty({ example: 'News content...', description: 'Post content' })
  @IsString()
  content: string;
}

export class CreateNewsDto {
  @ApiProperty({ example: 'breaking-news', description: 'URL slug' })
  @IsString()
  slug: string;

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

  @ApiProperty({ type: 'array', items: { type: 'object' } })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NewsTranslationDto)
  translations: NewsTranslationDto[];
}
