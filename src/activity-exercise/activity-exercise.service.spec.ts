import { Test, TestingModule } from '@nestjs/testing';
import { ActivityExerciseService } from './activity-exercise.service';

describe('ActivityExerciseService', () => {
  let service: ActivityExerciseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivityExerciseService],
    }).compile();

    service = module.get<ActivityExerciseService>(ActivityExerciseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
