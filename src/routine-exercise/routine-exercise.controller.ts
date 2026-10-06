import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PositiveIntPipe } from '../common/pipes/positive-int-pipe';
import { PermissionsGuard } from '../auth/guards/permissions/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

import { RoutineExerciseService } from './routine-exercise.service';
import { CreateRoutineExerciseDto } from './dto/create-routine-exercise.dto';
import { UpdateRoutineExerciseDto } from './dto/update-routine-exercise.dto';

@Controller('routine-exercises')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class RoutineExerciseController {
    constructor(private readonly routineExerciseService: RoutineExerciseService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('update_routine') // Agregar un ejercicio a una rutina equivale a modificar la rutina
    create(@Body() dto: CreateRoutineExerciseDto) {
        return this.routineExerciseService.create(dto);
    }

    @Get()
    @Permissions('read_routine')
    findAll() {
        return this.routineExerciseService.findAll();
    }

    @Get(':id')
    @Permissions('read_routine')
    findOne(@Param('id', PositiveIntPipe) id: number) {
        return this.routineExerciseService.findOne(id);
    }

    @Patch(':id')
    @Permissions('update_routine')
    update(@Param('id', PositiveIntPipe) id: number, @Body() dto: UpdateRoutineExerciseDto) {
        return this.routineExerciseService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('update_routine')
    async remove(@Param('id', PositiveIntPipe) id: number) {
        await this.routineExerciseService.remove(id);
    }
}
