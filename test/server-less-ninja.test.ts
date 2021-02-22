import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as ServerLessNinja from '../lib/server-less-ninja-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new ServerLessNinja.ServerLessNinjaStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
