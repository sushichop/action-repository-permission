import * as core from '@actions/core';
import { comment } from '../src/comment';
import { run } from '../src/main';
import { checkPermission } from '../src/permission';
import { reaction } from '../src/reaction';
import { relaxPermission } from '../src/relax';

jest.mock('../src/permission');
const mockCheckPermission = checkPermission as jest.Mocked<typeof checkPermission>;
jest.mock('../src/reaction');
const mockReaction = reaction as jest.Mocked<typeof reaction>;
jest.mock('../src/comment');
const mockComment = comment as jest.Mocked<typeof comment>;
jest.mock('../src/relax');
const mockRelaxPermission = relaxPermission as jest.Mocked<typeof relaxPermission>;

describe('run test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn());
  });

  it('`token` should be set manually', async () => {
    // token
    jest.spyOn(core, 'getInput').mockImplementation((): string => {
      return 'testtoken';
    });
    await run();
    expect(mockCheckPermission).toHaveBeenCalledTimes(1);
    expect(mockReaction).toHaveBeenCalledTimes(1);
    expect(mockComment).toHaveBeenCalledTimes(1);
    expect(mockRelaxPermission).toHaveBeenCalledTimes(1);
  });

  it('`token` should be set automatically', async () => {
    // token
    process.env['GITHUB_TOKEN'] = 'testtoken';
    await run();
    expect(mockCheckPermission).toHaveBeenCalledTimes(1);
    expect(mockReaction).toHaveBeenCalledTimes(1);
    expect(mockComment).toHaveBeenCalledTimes(1);
    expect(mockRelaxPermission).toHaveBeenCalledTimes(1);
  });

  it('unknown exception should be caught', async () => {
    // inputs
    const error = new Error('Unknown exception');
    jest.spyOn(core, 'getInput').mockImplementation((): never => {
      throw error;
    });
    await run();
    expect(core.setFailed).toHaveBeenCalledWith(`${error}`);
  });
});
