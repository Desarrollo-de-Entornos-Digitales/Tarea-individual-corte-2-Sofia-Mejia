import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PositiveIntPipe } from '../common/pipes/positive-int-pipe';
import { PermissionsGuard } from '../auth/guards/permissions/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Controller('exercises')
@UseGuards(AuthGuard('jwt'), PermissionsGuard) // Primero autenticación, luego permisos
export class ExercisesController {
    constructor(private readonly exercisesService: ExercisesService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('manage_exercises')
    create(@Body() createExerciseDto: CreateExerciseDto) {
        return this.exercisesService.create(createExerciseDto);
    }

    @Get()
    @Permissions('read_exercise')
    findAll() {
        return this.exercisesService.findAll();
    }

    @Get(':id')
    @Permissions('read_exercise')
    findOne(@Param('id', PositiveIntPipe) id: number) {
        return this.exercisesService.findOne(id);
    }

    @Patch(':id')
    @Permissions('manage_exercises')
    update(@Param('id', PositiveIntPipe) id: number, @Body() updateExerciseDto: UpdateExerciseDto) {
        return this.exercisesService.update(id, updateExerciseDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('manage_exercises')
    async remove(@Param('id', PositiveIntPipe) id: number) {
        await this.exercisesService.remove(id);
    }
}
