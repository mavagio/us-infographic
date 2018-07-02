import { MillionPipe } from './million.pipe';

describe('MillionPipe', () => {
  it('create an instance', () => {
    const pipe = new MillionPipe();
    expect(pipe).toBeTruthy();
  });
});
