import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Routine } from './routine.entity';
import { ActivityExercise } from './activity-exercise.entity';
import { User } from './user.entity';

@Entity('activity_logs') // Historial de sesiones de entrenamiento
export class ActivityLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'started_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    startedAt!: Date;

    // Es nulo mientras la sesión sigue en curso
    @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
    completedAt!: Date | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @OneToMany(() => ActivityExercise, (activityExercise) => activityExercise.activityLog)
    activityExercise!: ActivityExercise[];

    @ManyToOne(() => Routine, (routine) => routine.activities, { eager: false, nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'routine_id' })
    routine!: Routine;

    @ManyToOne(() => User, (user) => user.activityLog, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'user_id' })
    user!: User;
}
