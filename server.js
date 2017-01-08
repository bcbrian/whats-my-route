// server.js
var express = require('express')
var path = require('path')
var compression = require('compression')

import bodyParser from 'body-parser';
import {
  apolloExpress,
  graphiqlExpress,
} from 'apollo-server';

import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

import 'isomorphic-fetch';

import { makeExecutableSchema } from 'graphql-tools';



import typeDefs from './src/api/schema.js';
import resolvers from './src/api/resolvers.js';

import React from 'react'
// we'll use this to render our app to an html string
import { renderToString } from 'react-dom/server'
// and these to match the url to routes and then render
import { match, RouterContext } from 'react-router'
import { routes } from './src/startup/client/routes.js'

function Html({ content, state }) {
  return (
    <html>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: content }} />
        <script dangerouslySetInnerHTML={{
          __html: `window.__APOLLO_STATE__=${JSON.stringify(state)};`,
        }} />
      </body>
    </html>
  );
}

var app = express()

app.use(compression())

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// serve our static stuff like index.css
app.use(express.static(path.join(__dirname, 'public')));

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

app.use('/graphql',
  bodyParser.json(),
  function(req, res, next){
    // console.log("req.body: ", req.body);
    next();
  },
  apolloExpress({ schema })
);

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

app.get('*', (req, res) => {
  match({ routes, location: req.url }, (err, redirect, renderProps) => {
    // console.log('renderProps: ', renderProps);
    // in here we can make some decisions all at once
    if (err) {
      // there was an error somewhere during route matching
      res.status(500).send(err.message)
    } else if (redirect) {
      // we haven't talked about `onEnter` hooks on routes, but before a
      // route is entered, it can redirect. Here we handle on the server.
      res.redirect(redirect.pathname + redirect.search)
    } else if (renderProps) {
      // if we got props then we matched a route and can render

      // const appHtml = renderToString(<RouterContext {...props}/>)
      // res.send(renderPage(appHtml))

      const client = new ApolloClient({
        ssrMode: false,
      });

      const app = (
        <ApolloProvider client={client}>
          <RouterContext {...renderProps} />
        </ApolloProvider>
      );

      const appHtml = renderToString(app)
      res.send(renderPage(appHtml))
    } else {
      // no errors, no redirect, we just didn't match anything
      res.status(404).send('Not Found')
    }
  })
})

function renderPage(appHtml) {
  return `
    <!doctype html public="storage">
    <html>
    <script type="text/javascript">
    window.smartlook||(function(d) {
    var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName('head')[0];
    var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';
    c.charset='utf-8';c.src='//rec.smartlook.com/recorder.js';h.appendChild(c);
    })(document);
    smartlook('init', 'e9e09dced1b2a56db642ce3641d40ccffdc8ef88');
    </script>
    <meta charset=utf-8/>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>What's my route</title>
    <link rel=stylesheet href="/bundle.css">
    <div id="app">${appHtml}</div>
    <script src="https://cdn.rawgit.com/alertifyjs/alertify.js/v1.0.10/dist/js/alertify.js"></script>
    <script src="/bundle.js"></script>
   `
}

var PORT = process.env.PORT || 8080
app.listen(PORT, function() {
  console.log('Production Express server running at localhost:' + PORT)
})
