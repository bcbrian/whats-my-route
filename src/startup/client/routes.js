import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

import App from '../../../src/ui/layouts/layout.js';
import Home from '../../../src/ui/pages/home/home.js';
import Search from '../../../src/ui/pages/stake-search/stake-search.js';
import Stake from '../../../src/ui/pages/stake/stake.js';

// const networkInterface = createNetworkInterface('https://whats-my-route-bcbrian.c9users.io');
// const client = new ApolloClient(networkInterface);
const client = new ApolloClient();

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Home}/>
    <Route path="/search/:searchString" component={Search}/>
    <Route path="/stake/:stakeName" component={Stake}/>
  </Route>
);

if(typeof document !== "undefined"){
  render((
    <ApolloProvider client={client}>
      <Router routes={routes} history={browserHistory}>
        
      </Router>
    </ApolloProvider>
  ), document.getElementById('app'));
}

export { routes };