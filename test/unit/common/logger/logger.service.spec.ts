import { LoggerService } from '../../../../src/common/logger/logger.service';

describe('LoggerService', () => {
  let service: LoggerService;
  let stdoutSpy: jest.SpyInstance;
  let stderrSpy: jest.SpyInstance;

  beforeEach(() => {
    service = new LoggerService();
    stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
  });

  it('ควรเขียน log ไปที่ stdout', () => {
    service.log('test message', 'TestContext');

    expect(stdoutSpy).toHaveBeenCalled();
    const output = stdoutSpy.mock.calls[0][0];
    const parsed = JSON.parse(output);
    expect(parsed.level).toBe('log');
    expect(parsed.message).toBe('test message');
    expect(parsed.context).toBe('TestContext');
  });

  it('ควรเขียน error ไปที่ stderr', () => {
    service.error('error message', 'stack trace', 'TestContext');

    expect(stderrSpy).toHaveBeenCalled();
    const output = stderrSpy.mock.calls[0][0];
    const parsed = JSON.parse(output);
    expect(parsed.level).toBe('error');
    expect(parsed.message).toBe('error message');
    expect(parsed.stack).toBe('stack trace');
  });

  it('ควรเขียน warn ไปที่ stdout', () => {
    service.warn('warning message');

    expect(stdoutSpy).toHaveBeenCalled();
    const output = stdoutSpy.mock.calls[0][0];
    const parsed = JSON.parse(output);
    expect(parsed.level).toBe('warn');
  });

  it('ควรเขียน debug ไปที่ stdout', () => {
    service.debug('debug message', 'DebugCtx');

    expect(stdoutSpy).toHaveBeenCalled();
    const output = stdoutSpy.mock.calls[0][0];
    const parsed = JSON.parse(output);
    expect(parsed.level).toBe('debug');
    expect(parsed.context).toBe('DebugCtx');
  });

  it('ควรเขียน verbose ไปที่ stdout', () => {
    service.verbose('verbose message');

    expect(stdoutSpy).toHaveBeenCalled();
    const output = stdoutSpy.mock.calls[0][0];
    const parsed = JSON.parse(output);
    expect(parsed.level).toBe('verbose');
  });

  it('ควรใช้ default context เมื่อไม่ระบุ', () => {
    service.log('test');

    const output = stdoutSpy.mock.calls[0][0];
    const parsed = JSON.parse(output);
    expect(parsed.context).toBe('Application');
  });

  it('ควรมี timestamp ใน log output', () => {
    service.log('test');

    const output = stdoutSpy.mock.calls[0][0];
    const parsed = JSON.parse(output);
    expect(parsed.timestamp).toBeDefined();
    expect(new Date(parsed.timestamp).getTime()).not.toBeNaN();
  });

  it('ควรรวม meta data ใน log', () => {
    service.log('test', 'Ctx', { correlationId: 'abc-123', method: 'GET' });

    const output = stdoutSpy.mock.calls[0][0];
    const parsed = JSON.parse(output);
    expect(parsed.correlationId).toBe('abc-123');
    expect(parsed.method).toBe('GET');
  });
});
