import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResourceNotFoundException } from '../common/exceptions';
import { Exercises } from '../auth/entities/exercises.entity';

import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
    constructor(
        @InjectRepository(Exercises)
        private readonly exerciseRepository: Repository<Exercises>,
    ) {}

    async create(createExerciseDto: CreateExerciseDto): Promise<Exercises> {
        const exercise = this.exerciseRepository.create(createExerciseDto);

        return await this.exerciseRepository.save(exercise);
    }

    async findAll(): Promise<Exercises[]> {
        return await this.exerciseRepository.find({
            relations: {
                routineExercises: true,
            },
            order: {
                id: 'ASC',
            },
        });
    }

    async findOne(id: number): Promise<Exercises> {
        const exercise = await this.exerciseRepository.findOne({
            where: {
                id,
            },
            relations: {
                routineExercises: true,
            },
        });

        if (!exercise) {
            throw new ResourceNotFoundException('Ejercicio', id);
        }

        return exercise;
    }

    async update(id: number, updateExerciseDto: UpdateExerciseDto): Promise<Exercises> {
        await this.findOne(id);

        await this.exerciseRepository.update(id, updateExerciseDto);

        return await this.findOne(id);
    }

    async remove(id: number): Promise<{ id: number }> {
        await this.findOne(id);

        await this.exerciseRepository.delete(id);

        return { id };
    }
}
