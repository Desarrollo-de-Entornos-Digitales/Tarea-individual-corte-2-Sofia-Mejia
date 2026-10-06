import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Routine } from 'src/auth/entities/routine.entity';
import { Exercises } from 'src/auth/entities/exercises.entity';
import { RoutineExercise } from 'src/auth/entities/routine-exercise.entity';

import { RoutineExerciseService } from './routine-exercise.service';
import { RoutineExerciseController } from './routine-exercise.controller';

@Module({
    imports: [TypeOrmModule.forFeature([RoutineExercise, Routine, Exercises])],
    controllers: [RoutineExerciseController],
    providers: [RoutineExerciseService],
    exports: [RoutineExerciseService],
})
export class RoutineExerciseModule {}
