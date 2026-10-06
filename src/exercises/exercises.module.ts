import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Exercises } from '../auth/entities/exercises.entity';

import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Exercises])],
    controllers: [ExercisesController],
    providers: [ExercisesService],
    exports: [ExercisesService],
})
export class ExercisesModule {}
