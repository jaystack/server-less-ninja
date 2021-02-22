#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ServerLessNinjaStack } from '../lib/server-less-ninja-stack';

const app = new cdk.App();
new ServerLessNinjaStack(app, 'ServerLessNinjaStack');
