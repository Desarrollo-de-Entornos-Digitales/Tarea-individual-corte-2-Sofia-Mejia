import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PositiveIntPipe } from '../common/pipes/positive-int-pipe';
import { PermissionsGuard } from '../auth/guards/permissions/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';

@Controller('routines')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class RoutineController {
    constructor(private readonly routineService: RoutinesService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('create_routine')
    create(@Body() createRoutineDto: CreateRoutineDto) {
        return this.routineService.create(createRoutineDto);
    }

    @Get()
    @Permissions('read_routine')
    findAll() {
        return this.routineService.findAll();
    }

    @Get(':id')
    @Permissions('read_routine')
    findOne(@Param('id', PositiveIntPipe) id: number) {
        return this.routineService.findOne(id);
    }

    @Patch(':id')
    @Permissions('update_routine')
    update(@Param('id', PositiveIntPipe) id: number, @Body() updateRoutineDto: UpdateRoutineDto) {
        return this.routineService.update(id, updateRoutineDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('delete_routine')
    async remove(@Param('id', PositiveIntPipe) id: number) {
        await this.routineService.remove(id);
    }
}
