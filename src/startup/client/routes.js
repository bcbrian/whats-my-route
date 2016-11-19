import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import ReactGA from 'react-ga';

import App from '../../../src/ui/layouts/layout.js';
import Home from '../../../src/ui/pages/home/home.js';
import Search from '../../../src/ui/pages/stake-search/stake-search.js';
import Stake from '../../../src/ui/pages/stake/stake.js';
import Ward from '../../../src/ui/pages/ward/ward.js';
import NewRoute from '../../../src/ui/pages/new-route/new-route.js';
import ViewRoute from '../../../src/ui/pages/route/route.js';

// const networkInterface = createNetworkInterface('//whats-my-route-bcbrian.c9users.io');
// const client = new ApolloClient(networkInterface);
const client = new ApolloClient();

ReactGA.initialize('UA-87715799-1');
function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Home}/>
    <Route path="/search/:searchString" component={Search}/>
    <Route path="/stake/:stakeId" component={Stake}/>
    <Route path="/stake/:stakeId/ward/:wardId" component={Ward}/>
    <Route path="/stake/:stakeId/ward/:wardId/new-route" component={NewRoute}/>
    <Route path="/stake/:stakeId/ward/:wardId/route/:routeId" component={ViewRoute}/>
  </Route>
);

if(typeof document !== "undefined" && typeof client !== "undefined" ){
  render((
    <ApolloProvider client={client}>
      <Router routes={routes} history={browserHistory} onUpdate={logPageView} />
    </ApolloProvider>
  ), document.getElementById('app'));
}

export { routes };
