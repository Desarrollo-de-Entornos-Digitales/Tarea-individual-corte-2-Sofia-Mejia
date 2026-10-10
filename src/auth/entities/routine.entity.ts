import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';
import { RoutineExercise } from './routine-exercise.entity';
import { ActivityLog } from './activity-log.entity';

@Entity('routines')
export class Routine {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description!: string | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;

    // Cada rutina pertenece a un usuario (creador)
    @ManyToOne(() => User, (user) => user.routines, { eager: false, nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    // Una rutina contiene muchos ejercicios (tabla intermedia routine_exercises)
    @OneToMany(() => RoutineExercise, (routineExercise) => routineExercise.routine)
    routineExercises!: RoutineExercise[];

    // Una rutina puede ejecutarse en muchas sesiones (activity_logs)
    @OneToMany(() => ActivityLog, (activityLog) => activityLog.routine)
    activities!: ActivityLog[];
}
