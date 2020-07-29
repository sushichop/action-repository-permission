import * as core from '@actions/core';

const relaxPermission = (permitted: boolean): void => {
  const relax = core.getInput('relax').toLocaleLowerCase() === 'true';
  if (permitted || relax) {
    process.exitCode = 0;
  } else {
    core.setFailed(`Not permitted. permitted: ${permitted}`);
  }
};

export { relaxPermission };
