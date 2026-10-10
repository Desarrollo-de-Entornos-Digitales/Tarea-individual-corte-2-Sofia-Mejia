import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Routine } from '../auth/entities/routine.entity';
import { ActivityLog } from '../auth/entities/activity-log.entity';
import { User } from '../auth/entities/user.entity';

import { ActivityLogService } from './activity-log.service';
import { ActivityLogController } from './activity-log.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ActivityLog, User, Routine])],
    controllers: [ActivityLogController],
    providers: [ActivityLogService],
    exports: [ActivityLogService],
})
export class ActivityLogModule {}
