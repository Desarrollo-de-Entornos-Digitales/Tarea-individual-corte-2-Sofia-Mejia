import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PositiveIntPipe } from '../../common/pipes/positive-int-pipe';
import { PermissionsGuard } from '../guards/permissions/permissions.guard';
import { Permissions } from '../decorators/permissions.decorator';

import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('permissions')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('manage_roles')
    create(@Body() createPermissionDto: CreatePermissionDto) {
        return this.permissionService.create(createPermissionDto);
    }

    @Get()
    @Permissions('manage_roles')
    findAll() {
        return this.permissionService.findAll();
    }

    @Get(':id')
    @Permissions('manage_roles')
    findOne(@Param('id', PositiveIntPipe) id: number) {
        return this.permissionService.findOne(id);
    }

    @Patch(':id')
    @Permissions('manage_roles')
    update(@Param('id', PositiveIntPipe) id: number, @Body() updatePermissionDto: UpdatePermissionDto) {
        return this.permissionService.update(id, updatePermissionDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('manage_roles')
    async remove(@Param('id', PositiveIntPipe) id: number) {
        await this.permissionService.remove(id);
    }
}
