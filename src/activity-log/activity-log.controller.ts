import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PositiveIntPipe } from '../common/pipes/positive-int-pipe';
import { PermissionsGuard } from '../auth/guards/permissions/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

import { ActivityLogService } from './activity-log.service';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { UpdateActivityLogDto } from './dto/update-activity-log.dto';

@Controller('activity-logs')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class ActivityLogController {
    constructor(private readonly activityLogService: ActivityLogService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('create_activity')
    create(@Body() dto: CreateActivityLogDto) {
        return this.activityLogService.create(dto);
    }

    @Get()
    @Permissions('read_activity')
    findAll() {
        return this.activityLogService.findAll();
    }

    @Get(':id')
    @Permissions('read_activity')
    findOne(@Param('id', PositiveIntPipe) id: number) {
        return this.activityLogService.findOne(id);
    }

    @Patch(':id')
    @Permissions('update_activity')
    update(@Param('id', PositiveIntPipe) id: number, @Body() dto: UpdateActivityLogDto) {
        return this.activityLogService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('delete_activity')
    async remove(@Param('id', PositiveIntPipe) id: number) {
        await this.activityLogService.remove(id);
    }
}
