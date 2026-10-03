import { Module } from '@nestjs/common';
import { RoutineExerciseService } from './routine-exercise.service';
import { RoutineExerciseController } from './routine-exercise.controller';

@Module({
  controllers: [RoutineExerciseController],
  providers: [RoutineExerciseService],
})
export class RoutineExerciseModule {}
