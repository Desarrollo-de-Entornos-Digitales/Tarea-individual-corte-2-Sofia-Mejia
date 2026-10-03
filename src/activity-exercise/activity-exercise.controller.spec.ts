import { Test, TestingModule } from '@nestjs/testing';
import { ActivityExerciseController } from './activity-exercise.controller';
import { ActivityExerciseService } from './activity-exercise.service';

describe('ActivityExerciseController', () => {
  let controller: ActivityExerciseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityExerciseController],
      providers: [ActivityExerciseService],
    }).compile();

    controller = module.get<ActivityExerciseController>(ActivityExerciseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
