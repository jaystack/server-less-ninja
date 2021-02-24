import { 
    APIGatewayProxyHandlerV2
} from 'aws-lambda';

import render from 'preact-render-to-string';
import { h } from 'preact';
import { WebPage } from '../frontend/page';



export const handle: APIGatewayProxyHandlerV2 = async (event, context) => {
    const { rawPath } = event;
    return {
        statusCode: 200,
        body: render(<WebPage path={rawPath} />),
        headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'max-age=0',
        }
    }
}