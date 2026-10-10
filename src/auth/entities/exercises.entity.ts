import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RoutineExercise } from './routine-exercise.entity';

@Entity('exercises') // Catálogo de ejercicios
export class Exercises {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description!: string | null;

    @Column({ length: 50 })
    type!: string;

    @Column({ name: 'estimated_calories', type: 'float', default: 0 })
    estimatedCalories!: number;

    @Column({ name: 'estimated_distance_km', type: 'float', default: 0 })
    estimatedDistanceKm!: number;

    @Column({ name: 'estimated_duration_min', type: 'int', default: 0 })
    estimatedDurationMin!: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    icon!: string | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @OneToMany(() => RoutineExercise, (routineExercise) => routineExercise.exercise)
    routineExercises!: RoutineExercise[];
}
