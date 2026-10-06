import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ActivityLog } from 'src/auth/entities/activity-log.entity';
import { RoutineExercise } from 'src/auth/entities/routine-exercise.entity';
import { ActivityExercise } from 'src/auth/entities/activity-exercise.entity';

import { ResourceNotFoundException } from '../common/exceptions';

import { CreateActivityExerciseDto } from './dto/create-activity-exercise.dto';
import { UpdateActivityExerciseDto } from './dto/update-activity-exercise.dto';

@Injectable()
export class ActivityExerciseService {
    constructor(
        @InjectRepository(ActivityExercise)
        private readonly activityExerciseRepository: Repository<ActivityExercise>,

        @InjectRepository(ActivityLog)
        private readonly activityLogRepository: Repository<ActivityLog>,

        @InjectRepository(RoutineExercise)
        private readonly routineExerciseRepository: Repository<RoutineExercise>,
    ) {}

    private async validateReferences(activityLogId?: number, routineExerciseId?: number): Promise<void> {
        if (
            activityLogId &&
            !(await this.activityLogRepository.existsBy({
                id: activityLogId,
            }))
        ) {
            throw new ResourceNotFoundException('Sesión de actividad', activityLogId);
        }

        if (
            routineExerciseId &&
            !(await this.routineExerciseRepository.existsBy({
                id: routineExerciseId,
            }))
        ) {
            throw new ResourceNotFoundException('Ejercicio de rutina', routineExerciseId);
        }
    }

    async create(dto: CreateActivityExerciseDto): Promise<ActivityExercise> {
        await this.validateReferences(dto.activityLogId, dto.routineExerciseId);

        const activityExercise = this.activityExerciseRepository.create(dto);

        return await this.activityExerciseRepository.save(activityExercise);
    }

    async findAll(): Promise<ActivityExercise[]> {
        return await this.activityExerciseRepository.find({
            relations: {
                activityLog: true,
                routineExercise: true,
            },
            order: {
                id: 'ASC',
            },
        });
    }

    async findOne(id: number): Promise<ActivityExercise> {
        const activityExercise = await this.activityExerciseRepository.findOne({
            where: {
                id,
            },
            relations: {
                activityLog: true,
                routineExercise: true,
            },
        });

        if (!activityExercise) {
            throw new ResourceNotFoundException('Ejercicio realizado', id);
        }

        return activityExercise;
    }

    async update(id: number, dto: UpdateActivityExerciseDto): Promise<ActivityExercise> {
        await this.findOne(id);

        await this.validateReferences(dto.activityLogId, dto.routineExerciseId);

        await this.activityExerciseRepository.update(id, dto);

        return await this.findOne(id);
    }

    async remove(id: number): Promise<{ id: number }> {
        await this.findOne(id);

        await this.activityExerciseRepository.delete(id);

        return { id };
    }
}
