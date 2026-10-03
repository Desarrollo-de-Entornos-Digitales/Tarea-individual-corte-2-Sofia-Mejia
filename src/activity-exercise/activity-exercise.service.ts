import { Injectable } from '@nestjs/common';
import { CreateActivityExerciseDto } from './dto/create-activity-exercise.dto';
import { UpdateActivityExerciseDto } from './dto/update-activity-exercise.dto';

@Injectable()
export class ActivityExerciseService {
  create(createActivityExerciseDto: CreateActivityExerciseDto) {
    return 'This action adds a new activityExercise';
  }

  findAll() {
    return `This action returns all activityExercise`;
  }

  findOne(id: number) {
    return `This action returns a #${id} activityExercise`;
  }

  update(id: number, updateActivityExerciseDto: UpdateActivityExerciseDto) {
    return `This action updates a #${id} activityExercise`;
  }

  remove(id: number) {
    return `This action removes a #${id} activityExercise`;
  }
}
