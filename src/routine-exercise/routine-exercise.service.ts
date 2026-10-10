import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Routine } from '../auth/entities/routine.entity';
import { Exercises } from '../auth/entities/exercises.entity';
import { RoutineExercise } from '../auth/entities/routine-exercise.entity';
import { ResourceNotFoundException } from '../common/exceptions';

import { CreateRoutineExerciseDto } from './dto/create-routine-exercise.dto';
import { UpdateRoutineExerciseDto } from './dto/update-routine-exercise.dto';

@Injectable()
export class RoutineExerciseService {
    constructor(
        @InjectRepository(RoutineExercise)
        private readonly routineExerciseRepository: Repository<RoutineExercise>,

        @InjectRepository(Routine)
        private readonly routineRepository: Repository<Routine>,

        @InjectRepository(Exercises)
        private readonly exerciseRepository: Repository<Exercises>,
    ) {}

    private async validateReferences(routineId?: number, exerciseId?: number): Promise<void> {
        if (routineId && !(await this.routineRepository.existsBy({ id: routineId }))) {
            throw new ResourceNotFoundException('Rutina', routineId);
        }

        if (exerciseId && !(await this.exerciseRepository.existsBy({ id: exerciseId }))) {
            throw new ResourceNotFoundException('Ejercicio', exerciseId);
        }
    }

    async create(dto: CreateRoutineExerciseDto): Promise<RoutineExercise> {
        await this.validateReferences(dto.routineId, dto.exerciseId);

        const { routineId, exerciseId, ...data } = dto;
        const routineExercise = this.routineExerciseRepository.create({
            ...data,
            routine: { id: routineId },
            exercise: { id: exerciseId },
        });
        const saved = await this.routineExerciseRepository.save(routineExercise);

        return await this.findOne(saved.id);
    }

    async findAll(): Promise<RoutineExercise[]> {
        return await this.routineExerciseRepository.find({
            relations: {
                routine: true,
                exercise: true,
            },
            order: {
                routine: {
                    id: 'ASC',
                },
                orderIndex: 'ASC',
            },
        });
    }

    async findOne(id: number): Promise<RoutineExercise> {
        const routineExercise = await this.routineExerciseRepository.findOne({
            where: { id },
            relations: {
                routine: true,
                exercise: true,
            },
        });

        if (!routineExercise) {
            throw new ResourceNotFoundException('Ejercicio de rutina', id);
        }

        return routineExercise;
    }

    async update(id: number, dto: UpdateRoutineExerciseDto): Promise<RoutineExercise> {
        await this.findOne(id);

        await this.validateReferences(dto.routineId, dto.exerciseId);

        const { routineId, exerciseId, ...data } = dto;
        await this.routineExerciseRepository.update(id, {
            ...data,
            ...(routineId ? { routine: { id: routineId } } : {}),
            ...(exerciseId ? { exercise: { id: exerciseId } } : {}),
        });

        return await this.findOne(id);
    }

    async remove(id: number): Promise<{ id: number }> {
        await this.findOne(id);

        await this.routineExerciseRepository.delete(id);

        return { id };
    }
}
