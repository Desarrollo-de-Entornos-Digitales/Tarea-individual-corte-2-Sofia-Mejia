import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

import { ActivityLog } from './activity-log.entity';
import { RoutineExercise } from './routine-exercise.entity';

@Entity('activity-exercises')
export class ActivityExercise {
    @PrimaryColumn()
    id!: number;

    @Column()
    actualSets!: number;

    @Column()
    actualReps!: number;

    @Column()
    actualWeightKg!: number;

    @Column()
    actualDurationMin!: number;

    @Column()
    caloriesBurned!: number;

    @Column()
    distanceCoveredKm!: number;

    @Column({ name: 'started_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Automatically set the creation date of the user record to the current timestamp
    startedAt!: Date;

    @Column({ name: 'completed_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Automatically set the creation date of the user record to the current timestamp
    completedAt!: Date;

    @ManyToOne(() => ActivityLog, (activityLog) => activityLog.activityExercise)
    @JoinColumn({ name: 'activityLog_id' })
    activityLog!: ActivityLog[];

    @ManyToOne(() => RoutineExercise, (routineExercise) => routineExercise.activityExercise)
    @JoinColumn({ name: 'routineExercise_id' })
    routineExercise!: RoutineExercise[];
}
