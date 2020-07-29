import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';

const comment = async (token: string, permitted: boolean): Promise<void> => {
  const commentPermitted = core.getInput('comment-permitted');
  const commentNotPermitted = core.getInput('comment-not-permitted');

  const octokit = getOctokit(token);
  const { owner, repo } = context.repo;
  const issueNumber = context.payload.issue?.number;

  if (permitted && commentPermitted.length !== 0 && issueNumber) {
    await octokit.issues.createComment({
      owner: owner,
      repo: repo,
      issue_number: issueNumber,
      body: commentPermitted,
    });
  }
  if (!permitted && commentNotPermitted.length !== 0 && issueNumber) {
    await octokit.issues.createComment({
      owner: owner,
      repo: repo,
      issue_number: issueNumber,
      body: commentNotPermitted,
    });
  }
};

export { comment };
