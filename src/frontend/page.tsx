import { h } from 'preact';

type PageProps = {
    path?: string;
}

export const WebPage = (props: PageProps) => 
<html>
    <head>
        <title>Serverless Ninja</title>
    </head>
    <body>
        <h1>Hello Serverless Ninja</h1>
        <h3>You are on {props.path}</h3>
        <img src="/static/NinjaInfra.png" />
        <h5><a href="go/some/where">Go somewhere</a></h5>   
    </body>
</html>
