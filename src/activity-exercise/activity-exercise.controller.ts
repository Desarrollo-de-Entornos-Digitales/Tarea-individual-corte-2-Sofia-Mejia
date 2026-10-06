import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PositiveIntPipe } from '../common/pipes/positive-int-pipe';
import { PermissionsGuard } from '../auth/guards/permissions/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

import { ActivityExerciseService } from './activity-exercise.service';
import { CreateActivityExerciseDto } from './dto/create-activity-exercise.dto';
import { UpdateActivityExerciseDto } from './dto/update-activity-exercise.dto';

@Controller('activity-exercises')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class ActivityExerciseController {
    constructor(private readonly activityExerciseService: ActivityExerciseService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('create_activity')
    create(@Body() dto: CreateActivityExerciseDto) {
        return this.activityExerciseService.create(dto);
    }

    @Get()
    @Permissions('read_activity')
    findAll() {
        return this.activityExerciseService.findAll();
    }

    @Get(':id')
    @Permissions('read_activity')
    findOne(@Param('id', PositiveIntPipe) id: number) {
        return this.activityExerciseService.findOne(id);
    }

    @Patch(':id')
    @Permissions('update_activity')
    update(@Param('id', PositiveIntPipe) id: number, @Body() dto: UpdateActivityExerciseDto) {
        return this.activityExerciseService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('delete_activity')
    async remove(@Param('id', PositiveIntPipe) id: number) {
        await this.activityExerciseService.remove(id);
    }
}
