import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResourceNotFoundException, UserNotFoundException } from '../common/exceptions';
import { Routine } from '../auth/entities/routine.entity';
import { User } from '../auth/entities/user.entity';

import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';

@Injectable()
export class RoutinesService {
    constructor(
        @InjectRepository(Routine)
        private readonly routineRepository: Repository<Routine>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    private async ensureUserExists(userId: number): Promise<void> {
        if (!(await this.userRepository.existsBy({ id: userId }))) {
            throw new UserNotFoundException(userId);
        }
    }

    async create(createRoutineDto: CreateRoutineDto): Promise<Routine> {
        const { userId, ...data } = createRoutineDto;
        await this.ensureUserExists(userId);

        const routine = this.routineRepository.create({ ...data, user: { id: userId } });
        const saved = await this.routineRepository.save(routine);

        return await this.findOne(saved.id);
    }

    async findAll(): Promise<Routine[]> {
        return await this.routineRepository.find({
            relations: { user: true },
            order: { id: 'ASC' },
        });
    }

    async findOne(id: number): Promise<Routine> {
        const routine = await this.routineRepository.findOne({
            where: { id },
            relations: { user: true, routineExercises: { exercise: true } },
            order: { routineExercises: { orderIndex: 'ASC' } },
        });
        if (!routine) {
            throw new ResourceNotFoundException('Rutina', id);
        }
        return routine;
    }

    async update(id: number, updateRoutineDto: UpdateRoutineDto): Promise<Routine> {
        await this.findOne(id);

        const { userId, ...data } = updateRoutineDto;
        if (userId) {
            await this.ensureUserExists(userId);
        }

        await this.routineRepository.update(id, { ...data, ...(userId ? { user: { id: userId } } : {}) });
        return await this.findOne(id);
    }

    async remove(id: number): Promise<{ id: number }> {
        await this.findOne(id);
        await this.routineRepository.delete(id);
        return { id };
    }
}
