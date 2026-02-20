import { AppService } from '../../../src/app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService();
  });

  it('ควรสร้าง service ได้', () => {
    expect(service).toBeDefined();
  });

  describe('getHello', () => {
    it('ควร return "Hello World!"', () => {
      expect(service.getHello()).toBe('Hello World!');
    });

    it('ควร return string', () => {
      expect(typeof service.getHello()).toBe('string');
    });
  });
});
