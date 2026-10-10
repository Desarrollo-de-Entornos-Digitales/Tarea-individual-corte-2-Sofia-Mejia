import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Routine } from '../auth/entities/routine.entity';
import { ActivityLog } from '../auth/entities/activity-log.entity';
import { ResourceNotFoundException, UserNotFoundException } from '../common/exceptions';
import { User } from '../auth/entities/user.entity';

import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { UpdateActivityLogDto } from './dto/update-activity-log.dto';

@Injectable()
export class ActivityLogService {
    constructor(
        @InjectRepository(ActivityLog)
        private readonly activityLogRepository: Repository<ActivityLog>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Routine)
        private readonly routineRepository: Repository<Routine>,
    ) {}

    private async validateReferences(userId?: number, routineId?: number): Promise<void> {
        if (userId && !(await this.userRepository.existsBy({ id: userId }))) {
            throw new UserNotFoundException(userId);
        }

        if (routineId && !(await this.routineRepository.existsBy({ id: routineId }))) {
            throw new ResourceNotFoundException('Rutina', routineId);
        }
    }

    async create(dto: CreateActivityLogDto): Promise<ActivityLog> {
        await this.validateReferences(dto.userId, dto.routineId);

        const { userId, routineId, ...data } = dto;
        const activityLog = this.activityLogRepository.create({
            ...data,
            user: { id: userId },
            routine: { id: routineId },
        });
        const saved = await this.activityLogRepository.save(activityLog);

        return await this.findOne(saved.id);
    }

    async findAll(): Promise<ActivityLog[]> {
        return await this.activityLogRepository.find({
            relations: {
                activityExercise: true,
                user: true,
                routine: true,
            },
            order: {
                startedAt: 'DESC',
            },
        });
    }

    async findOne(id: number): Promise<ActivityLog> {
        const activityLog = await this.activityLogRepository.findOne({
            where: {
                id,
            },
            relations: {
                activityExercise: true,
                user: true,
                routine: true,
            },
        });

        if (!activityLog) {
            throw new ResourceNotFoundException('Sesión de actividad', id);
        }

        return activityLog;
    }

    async update(id: number, dto: UpdateActivityLogDto): Promise<ActivityLog> {
        await this.findOne(id);

        await this.validateReferences(dto.userId, dto.routineId);

        const { userId, routineId, ...data } = dto;
        await this.activityLogRepository.update(id, {
            ...data,
            ...(userId ? { user: { id: userId } } : {}),
            ...(routineId ? { routine: { id: routineId } } : {}),
        });

        return await this.findOne(id);
    }

    async remove(id: number): Promise<{ id: number }> {
        await this.findOne(id);

        await this.activityLogRepository.delete(id);

        return { id };
    }
}
