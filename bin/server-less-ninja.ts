#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ServerLessNinjaStack } from '../lib/ServerlessNinjaStack';
import { ContentUploaderStack } from '../lib/ContentUploaderStack';
import { config } from 'dotenv';
config();

const app = new cdk.App();
const ninjaInfra = new ServerLessNinjaStack(app, 'ServerLessNinjaStack');
const contentUploaderInfra = new ContentUploaderStack(app, 'ContentUpdateStack', {
    bucket: ninjaInfra.staticAssetsBucket
})
