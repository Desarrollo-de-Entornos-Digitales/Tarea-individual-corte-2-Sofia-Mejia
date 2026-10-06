import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Routine } from 'src/auth/entities/routine.entity';

import { User } from '../auth/entities/user.entity';

import { RoutinesService } from './routines.service';
import { RoutineController } from './routines.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Routine, User])],
    controllers: [RoutineController],
    providers: [RoutinesService],
    exports: [RoutinesService],
})
export class RoutinesModule {}
