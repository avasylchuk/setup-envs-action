import * as core from '@actions/core';

type APP_ENV = 'dev' | 'stg' | 'cmn' | 'tst' | 'dem' | 'prd';

// eslint-disable-next-line no-shadow
enum BRANCH_REF {
  DEV = 'refs/heads/lighter-build-image',
  STAGE = 'refs/heads/stg',
  PROD = 'refs/heads/stg'
}

const APP_CONFIG: Record<
  BRANCH_REF,
  {
    awsRegion: string;
    appEnv: APP_ENV;
  }
> = {
  [BRANCH_REF.DEV]: {
    awsRegion: 'eu-central-1',
    appEnv: 'dev'
  },
  [BRANCH_REF.STAGE]: {
    awsRegion: 'eu-central-1',
    appEnv: 'stg'
  },
  [BRANCH_REF.PROD]: {
    awsRegion: 'eu-central-1',
    appEnv: 'prd'
  }
};

async function run(): Promise<void> {
  try {
    const branch: BRANCH_REF = core.getInput('branch') as BRANCH_REF;

    if (!APP_CONFIG[branch]) {
      throw Error(`Wrong branch ${branch}`);
    }

    const {awsRegion, appEnv} = APP_CONFIG[branch];

    core.exportVariable('AWS_REGION', awsRegion);
    core.exportVariable('KEEP_APP_ENV', appEnv);
    core.exportVariable('KEEP_S3_BUCKET_ID', getFrontendS3BucketId(appEnv));
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();

const PROJECT_PREFIX = 'keep-5';

function getFrontendS3BucketId(env: APP_ENV): string {
  return `${env}-${PROJECT_PREFIX}-react-frontend`;
}
