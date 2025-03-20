import { Test, TestingModule } from '@nestjs/testing';
import { BioTimeMachineController } from './bio-time-machine.controller';

describe('BioTimeMachineController', () => {
  let controller: BioTimeMachineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BioTimeMachineController],
    }).compile();

    controller = module.get<BioTimeMachineController>(BioTimeMachineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
