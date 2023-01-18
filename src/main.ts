import * as core from '@actions/core';
import {wait} from './wait';

// eslint-disable-next-line no-shadow
enum BRANCH_REF {
  DEV = 'refs/heads/lighter-build-image',
  STAGE = 'refs/heads/stg',
  PROD = 'refs/heads/stg'
}

const APP_CONFIG: Record<
  BRANCH_REF,
  {
    aws_region: string;
    app_env: string;
  }
> = {
  [BRANCH_REF.DEV]: {
    aws_region: 'eu-central-1',
    app_env: 'dev'
  },
  [BRANCH_REF.STAGE]: {
    aws_region: 'eu-central-1',
    app_env: 'dev'
  },
  [BRANCH_REF.PROD]: {
    aws_region: 'eu-central-1',
    app_env: 'prd'
  }
};

async function run(): Promise<void> {
  try {
    const branch: BRANCH_REF = core.getInput('branch') as BRANCH_REF;

    if (!APP_CONFIG[branch]) {
      throw Error(`Wrong branch ${branch}`);
    }

    const {aws_region, app_env} = APP_CONFIG[branch];

    core.exportVariable('MY_AWS_REGION', aws_region);
    core.exportVariable('MY_APP_ENV', app_env);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
