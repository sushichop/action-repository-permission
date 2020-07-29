import * as core from '@actions/core';
import { context } from '@actions/github';
import nock from 'nock';
import { checkPermission } from '../src/permission';

jest.mock('@actions/core', () => {
  return {
    getInput: jest.fn(),
    setOutput: jest.fn(),
    debug: jest.fn(),
  };
});

describe('permission test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    nock.cleanAll();
    nock.disableNetConnect();

    process.env['GITHUB_REPOSITORY'] = 'testowner/testrepo';
    context.actor = 'testuser';
  });

  it('`permitted` should be true', async () => {
    jest.spyOn(core, 'getInput').mockImplementation((name: string): string => {
      if (name === 'required-permission') {
        return 'write';
      }
      return '';
    });
    // https://docs.github.com/en/rest/reference/repos#get-repository-permissions-for-a-user
    const permittedScope = nock('https://api.github.com')
      .get('/repos/testowner/testrepo/collaborators/testuser/permission')
      .reply(200, { permission: 'write' });

    await checkPermission('testtoken');
    expect(permittedScope.isDone()).toBe(true);
    expect(core.setOutput).toHaveBeenNthCalledWith(1, 'actual-permission', 'write');
    expect(core.setOutput).toHaveBeenNthCalledWith(2, 'permitted', true);
  });

  it('`permitted` should be false', async () => {
    jest.spyOn(core, 'getInput').mockImplementation((name: string): string => {
      if (name === 'required-permission') {
        return 'admin';
      }
      return '';
    });
    // https://docs.github.com/en/rest/reference/repos#get-repository-permissions-for-a-user
    const permittedScope = nock('https://api.github.com')
      .get('/repos/testowner/testrepo/collaborators/testuser/permission')
      .reply(200, { permission: 'write' });

    await checkPermission('testtoken');
    expect(permittedScope.isDone()).toBe(true);
    expect(core.setOutput).toHaveBeenNthCalledWith(1, 'actual-permission', 'write');
    expect(core.setOutput).toHaveBeenNthCalledWith(2, 'permitted', false);
  });
});
