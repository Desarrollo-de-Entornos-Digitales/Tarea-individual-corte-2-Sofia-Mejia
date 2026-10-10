import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ActivityLog } from './activity-log.entity';
import { RoutineExercise } from './routine-exercise.entity';

@Entity('activity_exercises') // Lo que el usuario realmente hizo en cada ejercicio de una sesión
export class ActivityExercise {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'actual_sets', type: 'int', default: 0 })
    actualSets!: number;

    @Column({ name: 'actual_reps', type: 'int', default: 0 })
    actualReps!: number;

    @Column({ name: 'actual_weight_kg', type: 'float', default: 0 })
    actualWeightKg!: number;

    @Column({ name: 'actual_duration_min', type: 'int', default: 0 })
    actualDurationMin!: number;

    @Column({ name: 'calories_burned', type: 'float', default: 0 })
    caloriesBurned!: number;

    @Column({ name: 'distance_covered_km', type: 'float', default: 0 })
    distanceCoveredKm!: number;

    @Column({ name: 'started_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    startedAt!: Date;

    @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
    completedAt!: Date | null;

    @ManyToOne(() => ActivityLog, (activityLog) => activityLog.activityExercise, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'activity_log_id' })
    activityLog!: ActivityLog;

    @ManyToOne(() => RoutineExercise, (routineExercise) => routineExercise.activityExercise, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'routine_exercise_id' })
    routineExercise!: RoutineExercise;
}
