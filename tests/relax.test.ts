import * as core from '@actions/core';
import { relaxPermission } from '../src/relax';

describe('rex test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn());
  });

  it('`setFailed` should not be called when `permitted` is the true', () => {
    jest.spyOn(core, 'getInput').mockImplementation((name: string): string => {
      if (name === 'relax') {
        return 'false';
      }
      return '';
    });
    relaxPermission(true);
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  it('`setFailed` should not be called when `relax` is the string true', () => {
    jest.spyOn(core, 'getInput').mockImplementation((name: string): string => {
      if (name === 'relax') {
        return 'true';
      }
      return '';
    });
    relaxPermission(false);
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  it('`setFailed` should be called when `permitted` is false and `relax` is the string false', () => {
    jest.spyOn(core, 'getInput').mockImplementation((name: string): string => {
      if (name === 'relax') {
        return 'false';
      }
      return '';
    });
    relaxPermission(false);
    expect(core.setFailed).toHaveBeenCalled();
  });

  it('`setFailed` should not be called when `permitted` is true and `relax` is an empty string', () => {
    jest.spyOn(core, 'getInput').mockImplementation((): string => {
      return '';
    });
    relaxPermission(true);
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  it('`setFailed` should be called when `permitted` is false and `relax` is empty string', () => {
    jest.spyOn(core, 'getInput').mockImplementation((): string => {
      return '';
    });
    relaxPermission(false);
    expect(core.setFailed).toHaveBeenCalled();
  });
});
