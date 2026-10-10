import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PositiveIntPipe } from '../../common/pipes/positive-int-pipe';
import { PermissionsGuard } from '../guards/permissions/permissions.guard';
import { Permissions } from '../decorators/permissions.decorator';

import { RolePermissionService } from './role-permission.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';

@Controller('role-permissions')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class RolePermissionController {
    constructor(private readonly rolePermissionService: RolePermissionService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('manage_roles')
    create(@Body() createRolePermissionDto: CreateRolePermissionDto) {
        return this.rolePermissionService.create(createRolePermissionDto);
    }

    @Get()
    @Permissions('manage_roles')
    findAll() {
        return this.rolePermissionService.findAll();
    }

    @Get(':id')
    @Permissions('manage_roles')
    findOne(@Param('id', PositiveIntPipe) id: number) {
        return this.rolePermissionService.findOne(id);
    }

    @Patch(':id')
    @Permissions('manage_roles')
    update(@Param('id', PositiveIntPipe) id: number, @Body() updateRolePermissionDto: UpdateRolePermissionDto) {
        return this.rolePermissionService.update(id, updateRolePermissionDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('manage_roles')
    async remove(@Param('id', PositiveIntPipe) id: number) {
        await this.rolePermissionService.remove(id);
    }
}
