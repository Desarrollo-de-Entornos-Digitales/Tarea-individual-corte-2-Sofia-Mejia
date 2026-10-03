import { Module } from '@nestjs/common';
import { ActivityExerciseService } from './activity-exercise.service';
import { ActivityExerciseController } from './activity-exercise.controller';

@Module({
  controllers: [ActivityExerciseController],
  providers: [ActivityExerciseService],
})
export class ActivityExerciseModule {}
