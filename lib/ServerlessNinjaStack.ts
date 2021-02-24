import { HttpApi, PayloadFormatVersion } from '@aws-cdk/aws-apigatewayv2';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { Distribution } from '@aws-cdk/aws-cloudfront';
import { HttpOrigin, S3Origin } from '@aws-cdk/aws-cloudfront-origins';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { Bucket } from '@aws-cdk/aws-s3';
import * as route53targets from '@aws-cdk/aws-route53-targets';
import * as cdk from '@aws-cdk/core';
import { ARecord, HostedZone, RecordTarget } from '@aws-cdk/aws-route53';

export class ServerLessNinjaStack extends cdk.Stack {
  public readonly staticAssetsBucket: Bucket;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const websiteFunction = new NodejsFunction(this, 'Website-Function', {
      entry: './src/lambdas/website.tsx',
      handler: 'handle',
    })

    const backend = new HttpApi(this, 'Serverless-Backend', {
      defaultIntegration: new LambdaProxyIntegration({
        handler: websiteFunction,
        payloadFormatVersion: PayloadFormatVersion.VERSION_2_0,
      })
    })

    const backendDomainName = `${backend.httpApiId}.execute-api.${this.region}.amazonaws.com`;
    new cdk.CfnOutput(this, 'BackendDomain', { value: backendDomainName })


    const lambdaOrigin = new HttpOrigin(backendDomainName)

    this.staticAssetsBucket = new Bucket(this, 'Static-assets');
    const bucketOrigin = new S3Origin(this.staticAssetsBucket);

    const { CERTIFICATE_ARN, HOSTED_ZONE_ID } = process.env;

    const certificate = Certificate.fromCertificateArn(this, 'Server-Less-Ninja-Certificat', CERTIFICATE_ARN as string);
    const domainName = 'server.less.ninja';

    const cdnDistribution = new Distribution(this, 'Serverless-ninja-cdn', {
      defaultBehavior: {
        origin: lambdaOrigin,
      },
      additionalBehaviors: {
        '/static/*': {
          origin: bucketOrigin,
        }
      },
      enableLogging: true,
      certificate,
      domainNames: [domainName],
    });

    const lessNinjaZone = HostedZone.fromHostedZoneAttributes(this, 'Less-Ninja-Zone', { 
      hostedZoneId: HOSTED_ZONE_ID as string, 
      zoneName: 'less.ninja' 
    });
    
    new ARecord(this, 'Server Less Ninja Site', {
      recordName: domainName,
      comment: 'Server Less Ninja Site',
      zone: lessNinjaZone,
      target: RecordTarget.fromAlias(new route53targets.CloudFrontTarget(cdnDistribution))
    });

  }
}
