import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { SetPermissionsDto } from './dto/set-permissions.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('roles')
@ApiBearerAuth()
@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post()
  @Permissions('user.manage')
  @ApiResponse({ status: 201, description: 'Role created' })
  async create(@Body() body: CreateRoleDto) {
    return this.rolesService.create(body);
  }

  @Get()
  @Permissions('user.manage')
  @ApiResponse({ status: 200, description: 'Roles retrieved' })
  async list(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = '',
  ) {
    return this.rolesService.list(Number(page), Number(limit), search);
  }

  @Get(':id')
  @Permissions('user.manage')
  @ApiResponse({ status: 200, description: 'Role retrieved' })
  async get(@Param('id') id: string) {
    return this.rolesService.findById(id);
  }

  @Patch(':id')
  @Permissions('user.manage')
  @ApiResponse({ status: 200, description: 'Role updated' })
  async update(@Param('id') id: string, @Body() body: any) {
    return this.rolesService.update(id, body);
  }

  @Patch(':id/permissions')
  @Permissions('user.manage')
  async setPermissions(
    @Param('id') id: string,
    @Body() body: SetPermissionsDto,
  ) {
    return this.rolesService.setPermissions(id, body.permissionIds);
  }

  @Delete(':id')
  @Permissions('user.manage')
  async remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
