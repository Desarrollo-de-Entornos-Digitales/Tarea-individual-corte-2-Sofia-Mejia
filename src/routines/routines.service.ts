import { Injectable } from '@nestjs/common';

import { ResourceNotFoundException, UserNotFoundException } from 'src/common/exceptions';
import { Routine } from 'src/auth/entities/routine.entity';

import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';

@Injectable()
export class RoutinesService {
    userRepository: any;
    routineRepository: any;

    private async ensureUserExists(userId: number): Promise<void> {
        if (!(await this.userRepository.existsBy({ id: userId }))) {
            throw new UserNotFoundException(userId);
        }
    }

    async create(createRoutineDto: CreateRoutineDto): Promise<Routine> {
        await this.ensureUserExists(createRoutineDto.userId);
        const routine = this.routineRepository.create(createRoutineDto);
        return await this.routineRepository.save(routine);
    }

    async findAll(): Promise<Routine[]> {
        return await this.routineRepository.find({ order: { id: 'ASC' } });
    }

    async findOne(id: number): Promise<Routine> {
        const routine = await this.routineRepository.findOne({
            where: { id },
            relations: { routineExercises: { exercise: true } },
            order: { routineExercises: { orderIndex: 'ASC' } },
        });
        if (!routine) {
            throw new ResourceNotFoundException('Rutina', id);
        }
        return routine;
    }

    async update(id: number, updateRoutineDto: UpdateRoutineDto): Promise<Routine> {
        await this.findOne(id);
        if (updateRoutineDto.userId) {
            await this.ensureUserExists(updateRoutineDto.userId);
        }
        await this.routineRepository.update(id, updateRoutineDto);
        return await this.findOne(id);
    }

    async remove(id: number): Promise<{ id: number }> {
        await this.findOne(id);
        await this.routineRepository.delete(id);
        return { id };
    }
}
