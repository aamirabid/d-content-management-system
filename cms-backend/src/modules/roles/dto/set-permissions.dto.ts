import { IsArray, ArrayNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetPermissionsDto {
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'uuid' },
    description: 'Permission IDs',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  permissionIds: string[];
}
