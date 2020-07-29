import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { Reaction, reactionType } from './reactionType';

const reaction = async (token: string, permitted: boolean): Promise<void> => {
  const reactionPermitted = reactionType(core.getInput('reaction-permitted')) as Reaction;
  const reactionNotPermitted = reactionType(core.getInput('reaction-not-permitted')) as Reaction;

  const octokit = getOctokit(token);
  const { owner, repo } = context.repo;
  const commentId = context.payload.comment?.id;

  if (permitted && reactionPermitted.length !== 0 && commentId) {
    await octokit.reactions.createForIssueComment({
      owner: owner,
      repo: repo,
      comment_id: commentId,
      content: reactionPermitted,
    });
  }
  if (!permitted && reactionNotPermitted.length !== 0 && commentId) {
    await octokit.reactions.createForIssueComment({
      owner: owner,
      repo: repo,
      comment_id: commentId,
      content: reactionNotPermitted,
    });
  }
};

export { reaction };
