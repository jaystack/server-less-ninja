import { Bucket } from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';

export interface ContentUploaderStackProps extends cdk.StackProps {
    bucket: Bucket,
}

export class ContentUploaderStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: ContentUploaderStackProps) {
        super(scope, id, props);

        new s3deploy.BucketDeployment(this, 'Content Deployment', {
            sources: [s3deploy.Source.asset('./static')],
            destinationBucket: props.bucket,
        });
    }
}