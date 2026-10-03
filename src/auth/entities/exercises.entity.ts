import {Column, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import {RoutineExercise} from './routine-exercise.entity';

export class Exercise {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column()
    type!: string;

    @Column()
    estimatedCalories!: number;

    @Column()
    estimatedDistanceKm!: number;

    @Column()
    estimatedDurationMin!: number;

    @Column()
    icon!: string;

    @Column({name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt!: Date;

    @OneToMany(() => RoutineExercise, (routineExercise) => routineExercise.exercise)
    routineExercises!: []
}