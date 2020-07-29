import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { permissionLevel } from './permissionLevel';

const checkPermission = async (token: string): Promise<boolean> => {
  const requiredPermission = core.getInput('required-permission');

  const octokit = getOctokit(token);
  const { owner, repo } = context.repo;
  const username = context.actor;

  const response = await octokit.repos.getCollaboratorPermissionLevel({ owner, repo, username });
  const actualPermission = response.data.permission;
  core.debug(`actual-permission: ${actualPermission}`);
  core.setOutput('actual-permission', actualPermission);

  const permitted = permissionLevel(actualPermission) >= permissionLevel(requiredPermission);
  core.debug(`permitted: ${permitted}`);
  core.setOutput('permitted', permitted);
  return permitted;
};

export { checkPermission };
