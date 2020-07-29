import * as core from '@actions/core';
import { comment } from './comment';
import { checkPermission } from './permission';
import { reaction } from './reaction';
import { relaxPermission } from './relax';

export const run = async (): Promise<void> => {
  try {
    const token = core.getInput('token') || (process.env['GITHUB_TOKEN'] as string);
    const permitted = await checkPermission(token);
    await reaction(token, permitted);
    await comment(token, permitted);
    relaxPermission(permitted);
  } catch (error) {
    core.setFailed(error.message);
  }
};

(async () => {
  await run();
})();
