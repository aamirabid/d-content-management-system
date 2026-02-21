import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('permissions')
@ApiBearerAuth()
@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PermissionsController {
  constructor(private svc: PermissionsService) {}

  @Post()
  @Permissions('user.manage')
  @ApiResponse({ status: 201, description: 'Permission created' })
  async create(@Body() body: CreatePermissionDto) {
    return this.svc.create(body);
  }

  @Get()
  @Permissions('user.manage')
  @ApiResponse({ status: 200, description: 'Permissions retrieved' })
  async list(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = '',
  ) {
    return this.svc.list(Number(page), Number(limit), search);
  }

  @Patch(':id')
  @Permissions('user.manage')
  @ApiResponse({ status: 200, description: 'Permission updated' })
  async update(@Param('id') id: string, @Body() body: CreatePermissionDto) {
    return this.svc.update(id, body as any);
  }

  @Delete(':id')
  @Permissions('user.manage')
  @ApiResponse({ status: 200, description: 'Permission deleted' })
  async remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
