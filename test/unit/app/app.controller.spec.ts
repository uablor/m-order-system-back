import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../../src/app.controller';
import { AppService } from '../../../src/app.service';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  it('ควรสร้าง controller ได้', () => {
    expect(controller).toBeDefined();
  });

  describe('getHello', () => {
    it('ควร return "Hello World!"', () => {
      expect(controller.getHello()).toBe('Hello World!');
    });

    it('ควรเรียก appService.getHello', () => {
      const spy = jest.spyOn(service, 'getHello');
      controller.getHello();
      expect(spy).toHaveBeenCalled();
    });
  });
});
