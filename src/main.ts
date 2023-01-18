import * as core from '@actions/core';
import {wait} from './wait';

// eslint-disable-next-line no-shadow
enum BRANCH_REF {
  DEV = 'refs/heads/lighter-build-image',
  STAGE = 'refs/heads/stg',
  PROD = 'refs/heads/stg'
}

const APP_ENV: Record<BRANCH_REF, string> = {
  [BRANCH_REF.DEV]: 'dev',
  [BRANCH_REF.STAGE]: 'stage',
  [BRANCH_REF.PROD]: 'prod'
};

async function run(): Promise<void> {
  try {
    const branch: BRANCH_REF = core.getInput('branch') as BRANCH_REF;

    if (!APP_ENV[branch]) {
      throw Error(`Wrong branch ${branch}`);
    }

    const ms = 2000;
    core.debug(`Waiting ${ms} milliseconds ...`);

    core.debug(new Date().toTimeString());
    await wait(ms);
    core.debug(new Date().toTimeString());

    core.setOutput('app_env', APP_ENV[branch]);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
