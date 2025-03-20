import { Test, TestingModule } from '@nestjs/testing';
import { BioTimeMachineService } from './bio-time-machine.service';

describe('BioTimeMachineService', () => {
  let service: BioTimeMachineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BioTimeMachineService],
    }).compile();

    service = module.get<BioTimeMachineService>(BioTimeMachineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
