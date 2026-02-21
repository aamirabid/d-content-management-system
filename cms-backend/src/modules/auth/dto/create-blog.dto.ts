import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BlogTranslationDto {
  @ApiProperty({ example: 'en' })
  @IsString()
  languageCode: string;

  @ApiProperty({ example: 'Blog Title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Blog content here...' })
  @IsString()
  content: string;
}

export class CreateBlogDto {
  @ApiProperty({ example: 'my-first-blog' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'published', enum: ['draft', 'published'] })
  @IsOptional()
  @IsIn(['draft', 'published'])
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  authorId?: string;

  @ApiProperty({ type: 'array', items: { type: 'object' } })
  @ApiProperty({ type: 'array', items: { type: 'object' } })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlogTranslationDto)
  translations: BlogTranslationDto[];
}
