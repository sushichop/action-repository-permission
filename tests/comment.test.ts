import * as core from '@actions/core';
import { context } from '@actions/github';
import nock from 'nock';
import { comment } from '../src/comment';

describe('comment test', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    nock.cleanAll();
    nock.disableNetConnect();

    process.env['GITHUB_REPOSITORY'] = 'testowner/testrepo';
  });

  it('`comment-permitted` should be added', async () => {
    jest.spyOn(core, 'getInput').mockImplementation((name: string): string => {
      switch (name) {
        case 'comment-permitted':
          return 'comment permitted';
        case 'comment-not-permitted':
          return '';
        default:
          return '';
      }
    });
    context.payload.issue = {
      number: 1,
    };
    // https://docs.github.com/en/rest/reference/reactions#create-reaction-for-an-issue-comment
    const commentPermittedScope = nock('https://api.github.com')
      .post('/repos/testowner/testrepo/issues/1/comments', { body: 'comment permitted' })
      .reply(201);

    await comment('testtoken', true);
    expect(commentPermittedScope.isDone()).toBe(true);
  });

  it('`comment-not-permitted` should be added', async () => {
    jest.spyOn(core, 'getInput').mockImplementation((name: string): string => {
      switch (name) {
        case 'comment-permitted':
          return '';
        case 'comment-not-permitted':
          return 'comment not permitted';
        default:
          return '';
      }
    });
    context.payload.issue = {
      number: 1,
    };
    // https://docs.github.com/en/rest/reference/reactions#create-reaction-for-an-issue-comment
    const commentNotPermittedScope = nock('https://api.github.com')
      .post('/repos/testowner/testrepo/issues/1/comments', { body: 'comment not permitted' })
      .reply(201);

    await comment('testtoken', false);
    expect(commentNotPermittedScope.isDone()).toBe(true);
  });

  it('`comment` should be not added', async () => {
    jest.spyOn(core, 'getInput').mockImplementation((name: string): string => {
      switch (name) {
        case 'comment-permitted':
          return 'comment permitted';
        case 'comment-not-permitted':
          return 'comment not permitted';
        default:
          return '';
      }
    });
    context.payload.issue = undefined;
    // https://docs.github.com/en/rest/reference/reactions#create-reaction-for-an-issue-comment
    const commentPermittedScope = nock('https://api.github.com')
      .post('/repos/testowner/testrepo/issues/1/comments', { body: 'comment permitted' })
      .reply(201);

    await comment('testtoken', true);
    expect(commentPermittedScope.isDone()).toBe(false);
  });
});
