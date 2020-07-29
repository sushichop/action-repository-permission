import core from '@actions/core';
import { context } from '@actions/github';
import nock from 'nock';
import { reaction } from '../src/reaction';

jest.mock('@actions/core', () => {
  return {
    getInput: jest.fn(),
  };
});

describe('reaction test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    nock.cleanAll();
    nock.disableNetConnect();

    process.env['GITHUB_REPOSITORY'] = 'testowner/testrepo';
  });

  it('`reaction-permitted` should be added', async () => {
    // reaction-permitted, reaction-not-permitted
    core.getInput = jest.fn().mockReturnValueOnce('rocket').mockReturnValueOnce('');
    context.payload = {
      comment: {
        id: 1,
      },
    };
    // https://docs.github.com/en/rest/reference/reactions#create-reaction-for-an-issue-comment
    const reactionPermittedScope = nock('https://api.github.com')
      .post('/repos/testowner/testrepo/issues/comments/1/reactions', { content: 'rocket' })
      .reply(201);

    await reaction('testtoken', true);
    expect(reactionPermittedScope.isDone()).toBe(true);
  });

  it('`reaction-not-permitted` should be added', async () => {
    // reaction-permitted, reaction-not-permitted
    core.getInput = jest.fn().mockReturnValueOnce('').mockReturnValueOnce('eyes');
    context.payload = {
      comment: {
        id: 1,
      },
    };
    // https://docs.github.com/en/rest/reference/reactions#create-reaction-for-an-issue-comment
    const reactionNotPermittedScope = nock('https://api.github.com')
      .post('/repos/testowner/testrepo/issues/comments/1/reactions', { content: 'eyes' })
      .reply(201);

    await reaction('testtoken', false);
    expect(reactionNotPermittedScope.isDone()).toBe(true);
  });

  it('`reaction` should not be added', async () => {
    // reaction-permitted, reaction-not-permitted
    core.getInput = jest.fn().mockReturnValueOnce('rocket').mockReturnValueOnce('eyes');
    context.payload = {
      comment: undefined,
    };
    // https://docs.github.com/en/rest/reference/reactions#create-reaction-for-an-issue-comment
    const reactionPermittedScope = nock('https://api.github.com')
      .post('/repos/testowner/testrepo/issues/comments/1/reactions', { content: 'rocket' })
      .reply(201);

    await reaction('testtoken', true);
    expect(reactionPermittedScope.isDone()).toBe(false);
  });
});
