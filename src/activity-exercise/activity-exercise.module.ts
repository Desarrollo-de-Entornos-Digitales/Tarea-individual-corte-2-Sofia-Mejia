import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivityLog } from '../auth/entities/activity-log.entity';
import { RoutineExercise } from '../auth/entities/routine-exercise.entity';
import { ActivityExercise } from '../auth/entities/activity-exercise.entity';

import { ActivityExerciseService } from './activity-exercise.service';
import { ActivityExerciseController } from './activity-exercise.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ActivityExercise, ActivityLog, RoutineExercise])],
    controllers: [ActivityExerciseController],
    providers: [ActivityExerciseService],
    exports: [ActivityExerciseService],
})
export class ActivityExerciseModule {}
