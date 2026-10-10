import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Exercises } from './exercises.entity';
import { Routine } from './routine.entity';
import { ActivityExercise } from './activity-exercise.entity';

@Entity('routine_exercises') // Ejercicios planeados dentro de una rutina
export class RoutineExercise {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'order_index', type: 'int' })
    orderIndex!: number;

    @Column({ name: 'target_sets', type: 'int', default: 0 })
    targetSets!: number;

    @Column({ name: 'target_reps', type: 'int', default: 0 })
    targetReps!: number;

    @Column({ name: 'target_weight_kg', type: 'float', default: 0 })
    targetWeightKg!: number;

    @Column({ name: 'target_duration_min', type: 'int', default: 0 })
    targetDurationMin!: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @ManyToOne(() => Routine, (routine) => routine.routineExercises, {
        eager: false,
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'routine_id' })
    routine!: Routine;

    @ManyToOne(() => Exercises, (exercise) => exercise.routineExercises, {
        eager: false,
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'exercise_id' })
    exercise!: Exercises;

    @OneToMany(() => ActivityExercise, (activityExercise) => activityExercise.routineExercise)
    activityExercise!: ActivityExercise[];
}
