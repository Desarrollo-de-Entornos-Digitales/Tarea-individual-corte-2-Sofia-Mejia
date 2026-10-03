import { Test, TestingModule } from '@nestjs/testing';
import { RoutineExerciseService } from './routine-exercise.service';

describe('RoutineExerciseService', () => {
  let service: RoutineExerciseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoutineExerciseService],
    }).compile();

    service = module.get<RoutineExerciseService>(RoutineExerciseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
