/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {'use strict';

	var _bodyParser = __webpack_require__(1);

	var _bodyParser2 = _interopRequireDefault(_bodyParser);

	var _apolloServer = __webpack_require__(2);

	var _server = __webpack_require__(3);

	var _apolloClient = __webpack_require__(8);

	var _apolloClient2 = _interopRequireDefault(_apolloClient);

	var _reactApollo = __webpack_require__(9);

	__webpack_require__(10);

	var _graphqlTools = __webpack_require__(11);

	var _schema = __webpack_require__(12);

	var _schema2 = _interopRequireDefault(_schema);

	var _resolvers = __webpack_require__(13);

	var _resolvers2 = _interopRequireDefault(_resolvers);

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _server2 = __webpack_require__(5);

	var _reactRouter = __webpack_require__(17);

	var _routes = __webpack_require__(18);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// server.js
	var express = __webpack_require__(34);
	var path = __webpack_require__(35);
	var compression = __webpack_require__(36);
	// we'll use this to render our app to an html string

	// and these to match the url to routes and then render


	function Html(_ref) {
	  var content = _ref.content;
	  var state = _ref.state;

	  return _react2.default.createElement(
	    'html',
	    null,
	    _react2.default.createElement(
	      'body',
	      null,
	      _react2.default.createElement('div', { id: 'app', dangerouslySetInnerHTML: { __html: content } }),
	      _react2.default.createElement('script', { dangerouslySetInnerHTML: {
	          __html: 'window.__APOLLO_STATE__=' + JSON.stringify(state) + ';'
	        } })
	    )
	  );
	}

	var app = express();

	app.use(compression());

	// app.use(function(req, res, next) {
	//   res.header("Access-Control-Allow-Origin", "*");
	//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	//   next();
	// });

	// serve our static stuff like index.css
	app.use(express.static(path.join(__dirname, 'public')));

	var schema = (0, _graphqlTools.makeExecutableSchema)({
	  typeDefs: _schema2.default,
	  resolvers: _resolvers2.default
	});

	app.use('/graphql', _bodyParser2.default.json(), function (req, res, next) {
	  // console.log("req.body: ", req.body);
	  next();
	}, (0, _apolloServer.apolloExpress)({ schema: schema }));

	app.use('/graphiql', (0, _apolloServer.graphiqlExpress)({
	  endpointURL: '/graphql'
	}));

	app.get('*', function (req, res) {
	  (0, _reactRouter.match)({ routes: _routes.routes, location: req.url }, function (err, redirect, renderProps) {
	    // console.log('renderProps: ', renderProps);
	    // in here we can make some decisions all at once
	    if (err) {
	      // there was an error somewhere during route matching
	      res.status(500).send(err.message);
	    } else if (redirect) {
	      // we haven't talked about `onEnter` hooks on routes, but before a
	      // route is entered, it can redirect. Here we handle on the server.
	      res.redirect(redirect.pathname + redirect.search);
	    } else if (renderProps) {
	      // if we got props then we matched a route and can render

	      // const appHtml = renderToString(<RouterContext {...props}/>)
	      // res.send(renderPage(appHtml))

	      var client = new _apolloClient2.default({
	        ssrMode: false
	      });

	      var _app = _react2.default.createElement(
	        _reactApollo.ApolloProvider,
	        { client: client },
	        _react2.default.createElement(_reactRouter.RouterContext, renderProps)
	      );

	      var appHtml = (0, _server2.renderToString)(_app);
	      res.send(renderPage(appHtml));
	    } else {
	      // no errors, no redirect, we just didn't match anything
	      res.status(404).send('Not Found');
	    }
	  });
	});

	function renderPage(appHtml) {
	  return '\n    <!doctype html public="storage">\n    <html>\n    <meta charset=utf-8/>\n    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">\n    <meta http-equiv="x-ua-compatible" content="ie=edge">\n    <title>What\'s my route</title>\n    <link rel=stylesheet href="/bundle.css">\n    <div id="app">' + appHtml + '</div>\n    <script src="/bundle.js"></script>\n   ';
	}

	var PORT = process.env.PORT || 8080;
	app.listen(PORT, function () {
	  console.log('Production Express server running at localhost:' + PORT);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, ""))

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("apollo-server");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var react_1 = __webpack_require__(4);
	var ReactDOM = __webpack_require__(5);
	var assign = __webpack_require__(6);
	var flatten = __webpack_require__(7);
	function getPropsFromChild(child) {
	    var props = child.props, type = child.type;
	    var ownProps = assign({}, props);
	    if (type && type.defaultProps)
	        ownProps = assign({}, type.defaultProps, props);
	    return ownProps;
	}
	exports.getPropsFromChild = getPropsFromChild;
	function getChildFromComponent(component) {
	    if (component && component.render)
	        return component.render();
	    return component;
	}
	exports.getChildFromComponent = getChildFromComponent;
	var contextStore = {};
	function getQueriesFromTree(_a, fetch) {
	    var component = _a.component, _b = _a.context, context = _b === void 0 ? {} : _b, _c = _a.queries, queries = _c === void 0 ? [] : _c;
	    if (fetch === void 0) { fetch = true; }
	    contextStore = assign({}, contextStore, context);
	    if (!component)
	        return;
	    if (typeof component === 'function')
	        component = { type: component };
	    var type = component.type, props = component.props;
	    if (typeof type === 'function') {
	        var ComponentClass = type;
	        var ownProps = getPropsFromChild(component);
	        var Component_1 = new ComponentClass(ownProps, context);
	        try {
	            Component_1.props = ownProps;
	            Component_1.context = context;
	            Component_1.setState = function (newState) {
	                Component_1.state = assign({}, Component_1.state, newState);
	            };
	        }
	        catch (e) { }
	        if (Component_1.componentWillMount)
	            Component_1.componentWillMount();
	        var newContext = context;
	        if (Component_1.getChildContext)
	            newContext = assign({}, context, Component_1.getChildContext());
	        if (typeof type.fetchData === 'function' && fetch) {
	            var query = type.fetchData(ownProps, newContext);
	            if (query)
	                queries.push({ query: query, component: component });
	        }
	        getQueriesFromTree({
	            component: getChildFromComponent(Component_1),
	            context: newContext,
	            queries: queries,
	        });
	    }
	    else if (props && props.children) {
	        react_1.Children.forEach(props.children, function (child) { return getQueriesFromTree({
	            component: child,
	            context: context,
	            queries: queries,
	        }); });
	    }
	    return { queries: queries, context: contextStore };
	}
	function getDataFromTree(app, ctx, fetch) {
	    if (ctx === void 0) { ctx = {}; }
	    if (fetch === void 0) { fetch = true; }
	    contextStore = {};
	    var _a = getQueriesFromTree({ component: app, context: ctx }, fetch), context = _a.context, queries = _a.queries;
	    contextStore = {};
	    if (!queries.length)
	        return Promise.resolve(context);
	    var mappedQueries = flatten(queries).map(function (y) { return y.query.then(function (x) { return y; }); });
	    return Promise.all(mappedQueries)
	        .then(function (trees) { return Promise.all(trees.filter(function (x) { return !!x; }).map(function (x) {
	        return getDataFromTree(x.component, context, false);
	    })); })
	        .then(function () { return (context); });
	}
	exports.getDataFromTree = getDataFromTree;
	function renderToStringWithData(component) {
	    return getDataFromTree(component)
	        .then(function (_a) {
	        var client = _a.client;
	        var markup = ReactDOM.renderToString(component);
	        var apolloState = client.queryManager.getApolloState();
	        for (var queryId in apolloState.queries) {
	            var fieldsToNotShip = ['minimizedQuery', 'minimizedQueryString'];
	            for (var _i = 0, fieldsToNotShip_1 = fieldsToNotShip; _i < fieldsToNotShip_1.length; _i++) {
	                var field = fieldsToNotShip_1[_i];
	                delete apolloState.queries[queryId][field];
	            }
	        }
	        return { markup: markup, initialState: client.store.getState() };
	    });
	}
	exports.renderToStringWithData = renderToStringWithData;
	//# sourceMappingURL=server.js.map

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("react-dom/server");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("object-assign");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("lodash.flatten");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("apollo-client");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("react-apollo");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("isomorphic-fetch");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("graphql-tools");

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var schema = "\n\ntype SeatPosition {\n  bench: String\n  position: Int\n  top: Int\n  left: Int\n}\ntype DeaconRoute {\n  bench: String\n  direction: String\n  top: Int\n  left: Int\n}\n\ntype BishopPosition {\n  top: Int\n  left: Int\n}\n\ninput SeatPositionInput {\n  bench: String\n  position: Int\n  top: Int\n  left: Int\n}\ninput DeaconRouteInput {\n  bench: String\n  direction: String\n  top: Int\n  left: Int\n}\n\ninput BishopPositionInput {\n  top: Int\n  left: Int\n}\n\ntype Deacon {\n  _id: String!\n  route: Int\n  color: String\n  passToBishop: Boolean\n  seat: SeatPosition\n  route: DeaconRoute\n  bishop: BishopPosition\n}\n\ninput DeaconInput {\n  _id: String!\n  route: Int\n  color: String\n  passToBishop: Boolean\n  seat: SeatPositionInput\n  route: DeaconRouteInput\n  bishop: BishopPositionInput\n}\n\ntype Route {\n  _id: String!\n  chapel: [Int]\n  deacons: [Deacon]\n  deaconCount: Int\n}\n\ntype Ward {\n  _id: String!\n  name: String\n  routes: [Route]\n  routeCount: Int\n}\n\ntype Stake {\n  _id: String!\n  name: String\n  wards: [Ward]\n  wardCount: Int\n}\n\n\n# the schema allows the following query:\ntype Query {\n  stakes: [Stake]\n  \n  searchStakes(\n    searchString: String!\n  ): [Stake] \n  \n  getStake(\n      stakeId: String!\n  ): Stake\n  \n  getWard(\n      stakeId: String!\n      wardId: String!\n  ): Ward\n  \n  getRoute(\n      stakeId: String!\n      wardId: String!\n      routeId: String!\n  ): Route\n \n}\n\ntype Mutation {\n  submitStake(\n    stakeName: String!\n    wardName: String!\n  ): Stake\n  \n  submitWard(\n    stakeId: String!\n    wardName: String!\n  ): Stake\n  \n  submitRoute(\n    stakeId: String!\n    wardId: String!\n    chapel: [Int]\n    deacons: [DeaconInput]\n  ): Route\n}\n\n";

	exports.default = schema;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Stakes = __webpack_require__(14);

	var TIME_OUT = 500;
	var timeoutReject = function timeoutReject(reject, message) {
	  setTimeout(function () {
	    return reject('MongoDB timeout when fetching stakes (timeout is 500ms)');
	  }, TIME_OUT);
	};
	var resolveFunctions = {
	  Query: {
	    stakes: function stakes(root, args, context) {
	      return new Promise(function (resolve, reject) {
	        timeoutReject(reject, 'MongoDB timeout when fetching stakes (timeout is 500ms)');
	        _Stakes.Stakes.find().then(function (res) {
	          resolve(res || []);
	        });
	      });
	    },
	    searchStakes: function searchStakes(root, _ref, context) {
	      var searchString = _ref.searchString;

	      var searchTerms = decodeURI(searchString).split(' ');
	      var regexTerms = searchTerms.map(function (st) {
	        return new RegExp('.*' + st + '.*', 'i');
	      });
	      return new Promise(function (resolve, reject) {
	        timeoutReject(reject, 'MongoDB timeout when searching stakes (timeout is 500ms)');
	        _Stakes.Stakes.find({ name: { $all: regexTerms } }, function (err, stakes) {
	          if (err) return reject('MongoDB failed to find a match for search');
	          resolve(stakes || []);
	        });
	      });
	    },
	    getStake: function getStake(root, _ref2, context) {
	      var stakeId = _ref2.stakeId;

	      console.log('Getting the stake :', stakeId);
	      return new Promise(function (resolve, reject) {
	        timeoutReject(reject, 'MongoDB timeout when searching stakes (timeout is 500ms)');
	        _Stakes.Stakes.findOne({ _id: stakeId }, function (err, stake) {
	          if (err) return reject('MongoDB failed to find a match for search');
	          resolve(stake || {});
	        });
	      });
	    },
	    getWard: function getWard(root, _ref3, context) {
	      var stakeId = _ref3.stakeId;
	      var wardId = _ref3.wardId;

	      console.log('Getting the ward :', stakeId, wardId);
	      return new Promise(function (resolve, reject) {
	        timeoutReject(reject, 'MongoDB timeout when searching stakes (timeout is 500ms)');
	        _Stakes.Stakes.findOne({ _id: stakeId }, function (err, stake) {
	          if (err) return reject('MongoDB failed to find a match for search');
	          var ward = stake.wards.find(function (w) {
	            return w._id === wardId;
	          });
	          resolve(ward || {});
	        });
	      });
	    },
	    getRoute: function getRoute(root, _ref4, context) {
	      var stakeId = _ref4.stakeId;
	      var wardId = _ref4.wardId;
	      var routeId = _ref4.routeId;

	      console.log('Getting the route :', stakeId, wardId, routeId);
	      return new Promise(function (resolve, reject) {
	        timeoutReject(reject, 'MongoDB timeout when searching stakes (timeout is 500ms)');
	        _Stakes.Stakes.findOne({ _id: stakeId }, function (err, stake) {
	          if (err) return reject('MongoDB failed to find a match for search');
	          var ward = stake.wards.find(function (w) {
	            return w._id === wardId;
	          });
	          var route = ward.routes.find(function (r) {
	            return r._id === routeId;
	          });
	          resolve(route || {});
	        });
	      });
	    }
	  },
	  Mutation: {
	    submitStake: function submitStake(_, _ref5, context) {
	      var stakeName = _ref5.stakeName;
	      var wardName = _ref5.wardName;

	      var newStake = new _Stakes.Stakes({
	        name: stakeName,
	        wards: [{
	          name: wardName
	        }]
	      });
	      return new Promise(function (resolve, reject) {
	        timeoutReject(reject, 'MongoDB timeout when adding a stake (timeout is 500ms)');
	        newStake.save(function (err, stake) {
	          if (err) return reject('MongoDB failed to add the stake to the database');
	          resolve(stake);
	        });
	      });
	    },
	    submitWard: function submitWard(_, _ref6, context) {
	      var stakeId = _ref6.stakeId;
	      var wardName = _ref6.wardName;

	      return new Promise(function (resolve, reject) {
	        timeoutReject(reject, 'MongoDB timeout when adding a ward (timeout is 500ms)');
	        _Stakes.Stakes.findByIdAndUpdate(stakeId, { $push: { wards: { name: wardName } } }, { new: true }, function (err, stake) {
	          if (err) return reject('MongoDB failed to update the stake to the database');
	          resolve(stake);
	        });
	      });
	    },
	    submitRoute: function submitRoute(_, _ref7, context) {
	      var stakeId = _ref7.stakeId;
	      var wardId = _ref7.wardId;
	      var chapel = _ref7.chapel;
	      var deacons = _ref7.deacons;

	      return new Promise(function (resolve, reject) {
	        // timeoutReject(reject, 'MongoDB timeout when adding a ward (timeout is 500ms)');
	        var route = { chapel: chapel, deacons: deacons };
	        console.log(stakeId, wardId, route);
	        // const stake = Stakes.findOne({ _id: stakeId, 'wards._id': wardId}, (err, stake) => {
	        //   console.log(stake);
	        //   resolve(stake);
	        // });

	        _Stakes.Stakes.findOneAndUpdate({ _id: stakeId, 'wards._id': wardId }, { $push: { 'wards.$.routes': route } }, { new: true }, function (err, stake) {
	          if (err) return reject('MongoDB failed to update the stake to the database');
	          console.log(stake);
	          var ward = stake.wards.find(function (w) {
	            return w._id === wardId;
	          });
	          var route = ward.routes[ward.routes.length - 1]; // TODO: remove this and pass in an id
	          resolve(route);
	        });
	      });
	    }
	  },
	  Stake: {
	    wards: function wards(_ref8, _, context) {
	      var _wards = _ref8.wards;

	      return _wards || [];
	    },
	    wardCount: function wardCount(_ref9, _, context) {
	      var wards = _ref9.wards;

	      return wards ? wards.length : 0;
	    }
	  },
	  Ward: {
	    routes: function routes(_ref10, _, context) {
	      var _routes = _ref10.routes;

	      return _routes || [];
	    },
	    routeCount: function routeCount(_ref11, _, context) {
	      var routes = _ref11.routes;

	      return routes ? routes.length : 0;
	    }
	  },
	  Route: {
	    deacons: function deacons(_ref12, _, context) {
	      var _deacons = _ref12.deacons;

	      return _deacons || [];
	    },
	    deaconCount: function deaconCount(_ref13, _, context) {
	      var deacons = _ref13.deacons;

	      return deacons ? deacons.length : 0;
	    }
	  },
	  Deacon: {
	    route: function route(_ref14, _, context) {
	      var _route = _ref14.route;

	      return _route || {};
	    },
	    seat: function seat(_ref15, _, context) {
	      var _seat = _ref15.seat;

	      return _seat || {};
	    },
	    bishop: function bishop(_ref16, _, context) {
	      var _bishop = _ref16.bishop;

	      return _bishop || {};
	    }
	  }
	};

	exports.default = resolveFunctions;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Stakes = undefined;

	var _ref;

	var _mongoose = __webpack_require__(15);

	var _mongoose2 = _interopRequireDefault(_mongoose);

	var _shortid = __webpack_require__(16);

	var _shortid2 = _interopRequireDefault(_shortid);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var mongo = _mongoose2.default.connect('mongodb://whatsmyroute:whatsmyroute@ds059316.mlab.com:59316/whatsmyroute');

	var StakeSchema = _mongoose2.default.Schema({
	  _id: {
	    type: String,
	    'default': _shortid2.default.generate
	  },
	  name: String,
	  wards: [{
	    _id: {
	      type: String,
	      'default': _shortid2.default.generate
	    },
	    name: String,
	    routes: [{
	      _id: {
	        type: String,
	        'default': _shortid2.default.generate
	      },
	      chapel: [Number],
	      deacons: [(_ref = {
	        _id: {
	          type: String,
	          'default': _shortid2.default.generate
	        },
	        route: Number,
	        color: String,
	        passToBishop: Boolean,
	        seat: {
	          bench: String,
	          top: Number,
	          left: Number,
	          position: Number
	        }
	      }, _defineProperty(_ref, 'route', {
	        bench: String,
	        top: Number,
	        left: Number,
	        direction: String
	      }), _defineProperty(_ref, 'bishop', {
	        top: Number,
	        left: Number
	      }), _ref)]
	    }]
	  }]
	});

	var Stakes = _mongoose2.default.model('stakes', StakeSchema);

	exports.Stakes = Stakes;

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require("mongoose");

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = require("shortid");

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("react-router");

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.routes = undefined;

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(19);

	var _reactRouter = __webpack_require__(17);

	var _apolloClient = __webpack_require__(8);

	var _apolloClient2 = _interopRequireDefault(_apolloClient);

	var _reactApollo = __webpack_require__(9);

	var _layout = __webpack_require__(20);

	var _layout2 = _interopRequireDefault(_layout);

	var _home = __webpack_require__(23);

	var _home2 = _interopRequireDefault(_home);

	var _stakeSearch = __webpack_require__(24);

	var _stakeSearch2 = _interopRequireDefault(_stakeSearch);

	var _stake = __webpack_require__(28);

	var _stake2 = _interopRequireDefault(_stake);

	var _ward = __webpack_require__(30);

	var _ward2 = _interopRequireDefault(_ward);

	var _newRoute = __webpack_require__(32);

	var _newRoute2 = _interopRequireDefault(_newRoute);

	var _route = __webpack_require__(33);

	var _route2 = _interopRequireDefault(_route);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// const networkInterface = createNetworkInterface('//whats-my-route-bcbrian.c9users.io');
	// const client = new ApolloClient(networkInterface);
	var client = new _apolloClient2.default();

	var routes = _react2.default.createElement(
	  _reactRouter.Route,
	  { path: '/', component: _layout2.default },
	  _react2.default.createElement(_reactRouter.IndexRoute, { component: _home2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: '/search/:searchString', component: _stakeSearch2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: '/stake/:stakeId', component: _stake2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: '/stake/:stakeId/ward/:wardId', component: _ward2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: '/stake/:stakeId/ward/:wardId/new-route', component: _newRoute2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: '/stake/:stakeId/ward/:wardId/route/:routeId', component: _route2.default })
	);

	if (typeof document !== "undefined" && typeof client !== "undefined") {
	  (0, _reactDom.render)(_react2.default.createElement(
	    _reactApollo.ApolloProvider,
	    { client: client },
	    _react2.default.createElement(_reactRouter.Router, { routes: routes, history: _reactRouter.browserHistory })
	  ), document.getElementById('app'));
	}

	exports.routes = routes;

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = require("react-dom");

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactAddonsCssTransitionGroup = __webpack_require__(21);

	var _reactAddonsCssTransitionGroup2 = _interopRequireDefault(_reactAddonsCssTransitionGroup);

	var _reactRouter = __webpack_require__(17);

	var _reactSAlert = __webpack_require__(22);

	var _reactSAlert2 = _interopRequireDefault(_reactSAlert);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	// import '/node-modules/react-s-alert/dist/s-alert-default.css';

	var App = function (_Component) {
	  _inherits(App, _Component);

	  function App(props, context) {
	    _classCallCheck(this, App);

	    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props, context));

	    _this.signOut = _this.signOut.bind(_this);
	    return _this;
	  }

	  _createClass(App, [{
	    key: 'signOut',
	    value: function signOut(event) {
	      var _this2 = this;

	      event.preventDefault();
	      Meteor.logout(function () {
	        _this2.context.router.push('/sign-in');
	      });
	    }
	  }, {
	    key: 'renderHeader',
	    value: function renderHeader() {
	      return _react2.default.createElement(
	        'nav',
	        { className: 'navbar navbar-dark bg-wmr' },
	        _react2.default.createElement(
	          'div',
	          { className: 'nav navbar-nav' },
	          _react2.default.createElement(
	            'a',
	            { className: 'nav-item nav-link active', href: '#' },
	            _react2.default.createElement(
	              'div',
	              { className: 'nav-item tray' },
	              _react2.default.createElement(
	                'svg',
	                { width: '100%', height: '100%', viewBox: '0 0 962 684', version: '1.1', xmlns: 'http://www.w3.org/2000/svg', xmlnsXlink: 'http://www.w3.org/1999/xlink', xmlSpace: 'preserve', style: { fillRule: 'evenodd', clipRule: 'evenodd', strokeLinejoin: 'round', strokeMiterlimit: 1.41421 } },
	                _react2.default.createElement(
	                  'g',
	                  { transform: 'matrix(1,0,0,1,-613.332,-1694)' },
	                  _react2.default.createElement(
	                    'g',
	                    { id: 'handle and tray', transform: 'matrix(0.707021,0,0,1,320.567,0)' },
	                    _react2.default.createElement('path', { d: 'M1477.75,1694C1549.09,1694 1607,1751.91 1607,1823.25L1607,2081.75C1607,2153.09 1549.09,2211 1477.75,2211L729.25,2211C657.915,2211 600,2153.09 600,2081.75L600,1823.25C600,1751.91 657.914,1694 729.25,1694L1477.75,1694ZM1399.75,1784L799.25,1784C749.439,1784 699,1824.44 699,1874.25L699,2084.75C699,2134.56 749.44,2175 799.25,2175L1399.75,2175C1449.56,2175 1500,2134.56 1500,2084.75L1500,1874.25C1500,1824.44 1449.56,1784 1399.75,1784Z', style: { fill: "rgb(171, 171, 171)" } }),
	                    _react2.default.createElement(
	                      'g',
	                      { id: 'Tray' },
	                      _react2.default.createElement('path', { d: 'M758.75,2378C610.975,2378 608.814,2373.88 586,2284.03L1601.33,2282.03C1578.52,2371.88 1577.36,2378 1429.58,2378L758.75,2378Z', style: { fill: "rgb(244,244,244)" } }),
	                      _react2.default.createElement('path', { d: 'M1600.33,2286.03C1483.12,2288.03 698.228,2288.21 588,2286.03L505,2199.97C706.508,2198.82 1566.63,2200.54 1683.33,2199.97L1600.33,2286.03Z', style: { fill: "rgb(225, 225, 225)" } }),
	                      _react2.default.createElement('path', { d: 'M1683.33,2199.97L505,2199.97C458.98,2177.32 339.23,2091.55 481.75,2115L1094.08,2112L1094.08,2112L1094.17,2112L1094.25,2112L1094.25,2112L1706.58,2115C1849.1,2091.55 1729.35,2177.32 1683.33,2199.97Z', style: { fill: "rgb(204, 204 ,204)" } })
	                    )
	                  )
	                )
	              )
	            )
	          ),
	          _react2.default.createElement(
	            'a',
	            { className: 'nav-item nav-link', href: '#' },
	            'About'
	          ),
	          _react2.default.createElement(
	            'a',
	            { className: 'nav-item nav-link', href: '#' },
	            'Contact'
	          ),
	          _react2.default.createElement(
	            'a',
	            { className: 'nav-item nav-link', href: '#' },
	            'Support'
	          )
	        )
	      );
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(_reactSAlert2.default, { stack: true, timeout: 3000 }),
	        this.renderHeader(),
	        _react2.default.createElement(
	          _reactAddonsCssTransitionGroup2.default,
	          {
	            component: 'div',
	            transitionName: {
	              enter: 'animated',
	              enterActive: 'fadeInLeft',
	              leave: 'animated',
	              leaveActive: 'fadeOutRight',
	              appear: 'animated',
	              appearActive: 'fadeInLeft'
	            },
	            transitionEnterTimeout: 1000,
	            transitionLeaveTimeout: 1000
	          },
	          _react2.default.cloneElement(this.props.children, {
	            key: this.props.location.pathname
	          })
	        )
	      );
	    }
	  }]);

	  return App;
	}(_react.Component);

	exports.default = App;


	App.propTypes = {
	  // title: React.PropTypes.string.isRequired,
	  children: _react.PropTypes.object.isRequired,
	  location: _react.PropTypes.object.isRequired
	};

	App.contextTypes = {
	  router: _react2.default.PropTypes.object.isRequired
	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("react-addons-css-transition-group");

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = require("react-s-alert");

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Home = function (_Component) {
	  _inherits(Home, _Component);

	  function Home(props, context) {
	    _classCallCheck(this, Home);

	    var _this = _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).call(this, props, context));

	    _this.search = _this.search.bind(_this);
	    return _this;
	  }

	  _createClass(Home, [{
	    key: 'search',
	    value: function search(event) {
	      event.preventDefault();
	      if (this.searchString.value === '') return;
	      this.context.router.push('/search/' + this.searchString.value);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      return _react2.default.createElement(
	        'div',
	        { className: 'jumbotron jumbotron-fluid wmr-jumbotron' },
	        _react2.default.createElement(
	          'div',
	          { className: 'container' },
	          _react2.default.createElement(
	            'div',
	            { className: 'container' },
	            _react2.default.createElement(
	              'div',
	              { className: 'tray' },
	              _react2.default.createElement(
	                'svg',
	                { width: '100%', height: '100%', viewBox: '0 0 962 684', version: '1.1', xmlns: 'http://www.w3.org/2000/svg', xmlnsXlink: 'http://www.w3.org/1999/xlink', xmlSpace: 'preserve', style: { fillRule: 'evenodd', clipRule: 'evenodd', strokeLinejoin: 'round', strokeMiterlimit: 1.41421 } },
	                _react2.default.createElement(
	                  'g',
	                  { transform: 'matrix(1,0,0,1,-613.332,-1694)' },
	                  _react2.default.createElement(
	                    'g',
	                    { id: 'handle and tray', transform: 'matrix(0.707021,0,0,1,320.567,0)' },
	                    _react2.default.createElement('path', { d: 'M1477.75,1694C1549.09,1694 1607,1751.91 1607,1823.25L1607,2081.75C1607,2153.09 1549.09,2211 1477.75,2211L729.25,2211C657.915,2211 600,2153.09 600,2081.75L600,1823.25C600,1751.91 657.914,1694 729.25,1694L1477.75,1694ZM1399.75,1784L799.25,1784C749.439,1784 699,1824.44 699,1874.25L699,2084.75C699,2134.56 749.44,2175 799.25,2175L1399.75,2175C1449.56,2175 1500,2134.56 1500,2084.75L1500,1874.25C1500,1824.44 1449.56,1784 1399.75,1784Z', style: { fill: "rgb(171, 171, 171)" } }),
	                    _react2.default.createElement(
	                      'g',
	                      { id: 'Tray' },
	                      _react2.default.createElement('path', { d: 'M758.75,2378C610.975,2378 608.814,2373.88 586,2284.03L1601.33,2282.03C1578.52,2371.88 1577.36,2378 1429.58,2378L758.75,2378Z', style: { fill: "rgb(244,244,244)" } }),
	                      _react2.default.createElement('path', { d: 'M1600.33,2286.03C1483.12,2288.03 698.228,2288.21 588,2286.03L505,2199.97C706.508,2198.82 1566.63,2200.54 1683.33,2199.97L1600.33,2286.03Z', style: { fill: "rgb(225, 225, 225)" } }),
	                      _react2.default.createElement('path', { d: 'M1683.33,2199.97L505,2199.97C458.98,2177.32 339.23,2091.55 481.75,2115L1094.08,2112L1094.08,2112L1094.17,2112L1094.25,2112L1094.25,2112L1706.58,2115C1849.1,2091.55 1729.35,2177.32 1683.33,2199.97Z', style: { fill: "rgb(204, 204 ,204)" } })
	                    )
	                  )
	                )
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'input-group input-group-lg' },
	              _react2.default.createElement(
	                'h2',
	                { className: 'display-5 text-xs-center' },
	                ' What\'s My Route? '
	              ),
	              _react2.default.createElement('hr', { className: 'm-y-2' })
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'input-group input-group-lg' },
	              _react2.default.createElement('input', { ref: function ref(_ref) {
	                  _this2.searchString = _ref;
	                }, type: 'text', className: 'form-control', placeholder: 'What\'s your stake?' }),
	              _react2.default.createElement(
	                'span',
	                { className: 'input-group-btn' },
	                _react2.default.createElement(
	                  'button',
	                  { onClick: this.search, className: 'btn btn-secondary', type: 'button' },
	                  _react2.default.createElement('i', { className: 'fa fa-search', 'aria-hidden': 'true' })
	                )
	              )
	            ),
	            _react2.default.createElement(
	              'p',
	              { className: 'form-text text-muted' },
	              'First lets search for the stake you are in. If we do not have it you will get to add it.'
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return Home;
	}(_react.Component);

	exports.default = Home;


	Home.contextTypes = {
	  router: _react2.default.PropTypes.object.isRequired
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _templateObject = _taggedTemplateLiteral(['\n  query qStakes(\n    $searchString: String!,\n  ) {\n    stakes: searchStakes(\n      searchString: $searchString,\n    ) {\n      _id\n      name\n      wardCount\n    }\n  }\n'], ['\n  query qStakes(\n    $searchString: String!,\n  ) {\n    stakes: searchStakes(\n      searchString: $searchString,\n    ) {\n      _id\n      name\n      wardCount\n    }\n  }\n']);

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(17);

	var _reactApollo = __webpack_require__(9);

	var _graphqlTag = __webpack_require__(25);

	var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

	var _loader = __webpack_require__(26);

	var _loader2 = _interopRequireDefault(_loader);

	var _addStake = __webpack_require__(27);

	var _addStake2 = _interopRequireDefault(_addStake);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var StakesSearch = function (_Component) {
	  _inherits(StakesSearch, _Component);

	  function StakesSearch(props, context) {
	    _classCallCheck(this, StakesSearch);

	    return _possibleConstructorReturn(this, (StakesSearch.__proto__ || Object.getPrototypeOf(StakesSearch)).call(this, props, context));
	  }

	  _createClass(StakesSearch, [{
	    key: 'renderListOfStakes',
	    value: function renderListOfStakes() {
	      return _react2.default.createElement(
	        'ul',
	        { className: 'list-group' },
	        this.props.stakes.map(function (stake) {
	          return _react2.default.createElement(
	            'li',
	            { key: stake._id, className: 'list-group-item' },
	            _react2.default.createElement(
	              _reactRouter.Link,
	              { to: '/stake/' + stake._id },
	              _react2.default.createElement(
	                'span',
	                { className: 'tag tag-default tag-pill pull-xs-right' },
	                stake.wardCount
	              ),
	              stake.name
	            )
	          );
	        })
	      );
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return this.props.loading ? _react2.default.createElement(_loader2.default, null) : _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'div',
	          { className: 'jumbotron jumbotron-fluid wmr-jumbotron' },
	          _react2.default.createElement(
	            'div',
	            { className: 'container' },
	            this.props.stakes.length > 0 ? _react2.default.createElement(
	              'p',
	              { className: 'text-xs-center' },
	              'When searching for "',
	              this.props.searchString,
	              '" this is what we found.'
	            ) : _react2.default.createElement(
	              'p',
	              { className: 'text-xs-center' },
	              'We did not find a stake mathcing your search.',
	              _react2.default.createElement('br', null),
	              'Click here to search again or add a new stake below.'
	            )
	          )
	        ),
	        _react2.default.createElement('hr', null),
	        _react2.default.createElement(
	          'div',
	          { className: 'container list' },
	          this.props.stakes.length > 0 ? this.renderListOfStakes() : _react2.default.createElement(_addStake2.default, { searchString: this.props.searchString })
	        )
	      );
	    }
	  }]);

	  return StakesSearch;
	}(_react.Component);

	StakesSearch.propTypes = {
	  stakes: _react2.default.PropTypes.array.isRequired,
	  loading: _react.PropTypes.bool.isRequired,
	  searchString: _react2.default.PropTypes.string.isRequired,
	  refetch: _react.PropTypes.func
	};

	var qStakes = (0, _graphqlTag2.default)(_templateObject);

	var StakesSearchData = (0, _reactApollo.graphql)(qStakes, {
	  options: function options(props) {
	    return {
	      variables: {
	        searchString: props.params.searchString
	      }
	    };
	  },


	  // ownProps are the props that are passed into the `ProfileWithData`
	  // when it is used by a parent component
	  props: function props(_ref) {
	    var ownProps = _ref.ownProps;
	    var _ref$data = _ref.data;
	    var loading = _ref$data.loading;
	    var stakes = _ref$data.stakes;
	    var refetch = _ref$data.refetch;
	    return {
	      ownProps: ownProps,
	      loading: loading,
	      stakes: stakes || [],
	      searchString: ownProps.params.searchString,
	      refetch: refetch
	    };
	  }
	})(StakesSearch);

	exports.default = StakesSearchData;

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = require("graphql-tag");

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Loader;

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Loader() {
	  return _react2.default.createElement(
	    "div",
	    { className: "spinner" },
	    _react2.default.createElement("div", { className: "rect1" }),
	    _react2.default.createElement("div", { className: "rect2" }),
	    _react2.default.createElement("div", { className: "rect3" }),
	    _react2.default.createElement("div", { className: "rect4" }),
	    _react2.default.createElement("div", { className: "rect5" })
	  );
	}

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _templateObject = _taggedTemplateLiteral(['\n  mutation mAddStake(\n    $stakeName: String!\n    $wardName: String!\n  ) {\n    submitStake(\n      stakeName: $stakeName\n      wardName: $wardName\n    ) {\n      _id\n      name\n    }\n  }\n'], ['\n  mutation mAddStake(\n    $stakeName: String!\n    $wardName: String!\n  ) {\n    submitStake(\n      stakeName: $stakeName\n      wardName: $wardName\n    ) {\n      _id\n      name\n    }\n  }\n']);

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(17);

	var _reactApollo = __webpack_require__(9);

	var _graphqlTag = __webpack_require__(25);

	var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var AddStake = function (_Component) {
	  _inherits(AddStake, _Component);

	  function AddStake(props, context) {
	    _classCallCheck(this, AddStake);

	    var _this = _possibleConstructorReturn(this, (AddStake.__proto__ || Object.getPrototypeOf(AddStake)).call(this, props, context));

	    _this.addStake = _this.addStake.bind(_this);
	    return _this;
	  }

	  _createClass(AddStake, [{
	    key: 'addStake',
	    value: function addStake() {
	      var _this2 = this;

	      var stakeName = this.stakeName.value;
	      var wardName = this.wardName.value;
	      this.props.submit({ stakeName: stakeName, wardName: wardName }).then(function (_ref) {
	        var data = _ref.data;

	        _this2.context.router.push('/stake/' + data.submitStake._id);
	      }).catch(function (error) {
	        console.log('there was an error sending the query', error);
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this3 = this;

	      return _react2.default.createElement(
	        'div',
	        { className: 'container' },
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'label',
	            { htmlFor: 'stakeName' },
	            'Stake Name'
	          ),
	          _react2.default.createElement('input', { id: 'stakeName', ref: function ref(_ref2) {
	              _this3.stakeName = _ref2;
	            }, type: 'text', className: 'form-control form-control-lg', defaultValue: this.props.searchString })
	        ),
	        _react2.default.createElement('br', null),
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'label',
	            { htmlFor: 'wardName' },
	            'Ward Name'
	          ),
	          _react2.default.createElement('input', { id: 'wardName', ref: function ref(_ref3) {
	              _this3.wardName = _ref3;
	            }, type: 'text', className: 'form-control form-control-lg' })
	        ),
	        _react2.default.createElement('br', null),
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'button',
	            { onClick: this.addStake, className: 'btn btn-secondary btn-lg form-control form-control-lg', type: 'button' },
	            'Add Stake and Ward'
	          )
	        )
	      );
	    }
	  }]);

	  return AddStake;
	}(_react.Component);

	AddStake.contextTypes = {
	  router: _react2.default.PropTypes.object.isRequired
	};

	AddStake.propTypes = {
	  submit: _react.PropTypes.func.isRequired,
	  searchString: _react.PropTypes.string.isRequired
	};

	var mAddStake = (0, _graphqlTag2.default)(_templateObject);

	var AddStakeWithData = (0, _reactApollo.graphql)(mAddStake, {
	  props: function props(_ref4) {
	    var mutate = _ref4.mutate;
	    return {
	      submit: function submit(_ref5) {
	        var stakeName = _ref5.stakeName;
	        var wardName = _ref5.wardName;
	        return mutate({ variables: { stakeName: stakeName, wardName: wardName } });
	      }
	    };
	  }
	})(AddStake);

	exports.default = AddStakeWithData;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _templateObject = _taggedTemplateLiteral(['\n  query qStake(\n    $stakeId: String!,\n  ) {\n    stake: getStake(\n      stakeId: $stakeId,\n    ) {\n      _id\n      name\n      wards{\n        _id\n        name\n        routeCount\n      }\n    }\n  }\n'], ['\n  query qStake(\n    $stakeId: String!,\n  ) {\n    stake: getStake(\n      stakeId: $stakeId,\n    ) {\n      _id\n      name\n      wards{\n        _id\n        name\n        routeCount\n      }\n    }\n  }\n']);

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(17);

	var _reactApollo = __webpack_require__(9);

	var _graphqlTag = __webpack_require__(25);

	var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

	var _loader = __webpack_require__(26);

	var _loader2 = _interopRequireDefault(_loader);

	var _addWard = __webpack_require__(29);

	var _addWard2 = _interopRequireDefault(_addWard);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Stake = function (_Component) {
	  _inherits(Stake, _Component);

	  function Stake(props) {
	    _classCallCheck(this, Stake);

	    return _possibleConstructorReturn(this, (Stake.__proto__ || Object.getPrototypeOf(Stake)).call(this, props));
	  }

	  _createClass(Stake, [{
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      return this.props.loading ? _react2.default.createElement(_loader2.default, null) : _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'div',
	          { className: 'jumbotron jumbotron-fluid wmr-jumbotron' },
	          _react2.default.createElement(
	            'div',
	            { className: 'container' },
	            _react2.default.createElement(
	              'h2',
	              { className: 'display-5 text-xs-center' },
	              this.props.stake.name
	            ),
	            _react2.default.createElement(
	              'p',
	              { className: 'text-xs-center' },
	              'Not what you where looking for? Click here to go back.'
	            )
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'container list' },
	          _react2.default.createElement(
	            'ul',
	            { className: 'list-group' },
	            !this.props.stake.wards ? null : this.props.stake.wards.map(function (ward) {
	              return _react2.default.createElement(
	                'li',
	                { key: ward._id, className: 'list-group-item' },
	                _react2.default.createElement(
	                  _reactRouter.Link,
	                  { to: '/stake/' + _this2.props.stakeId + '/ward/' + ward._id },
	                  _react2.default.createElement(
	                    'span',
	                    { className: 'tag tag-default tag-pill pull-xs-right' },
	                    ward.routeCount
	                  ),
	                  ward.name
	                )
	              );
	            })
	          ),
	          _react2.default.createElement('hr', null),
	          _react2.default.createElement(_addWard2.default, { refetchStake: this.props.refetch, stakeId: this.props.stake._id })
	        )
	      );
	    }
	  }]);

	  return Stake;
	}(_react.Component);

	Stake.propTypes = {
	  stake: _react2.default.PropTypes.object.isRequired,
	  loading: _react.PropTypes.bool.isRequired,
	  stakeId: _react2.default.PropTypes.string.isRequired,
	  refetch: _react.PropTypes.func
	};

	var qStake = (0, _graphqlTag2.default)(_templateObject);

	var StakeData = (0, _reactApollo.graphql)(qStake, {
	  options: function options(props) {
	    return {
	      variables: {
	        stakeId: props.params.stakeId
	      }
	    };
	  },


	  // ownProps are the props that are passed into the `ProfileWithData`
	  // when it is used by a parent component
	  props: function props(_ref) {
	    var ownProps = _ref.ownProps;
	    var _ref$data = _ref.data;
	    var loading = _ref$data.loading;
	    var stake = _ref$data.stake;
	    var refetch = _ref$data.refetch;
	    return {
	      ownProps: ownProps,
	      loading: loading,
	      stake: stake || {},
	      stakeId: ownProps.params.stakeId,
	      refetch: refetch
	    };
	  }
	})(Stake);

	exports.default = StakeData;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _templateObject = _taggedTemplateLiteral(['\n  mutation mAddWard(\n    $stakeId: String!\n    $wardName: String!\n  ) {\n    submitWard(\n      stakeId: $stakeId\n      wardName: $wardName\n    ) {\n      _id\n      name\n    }\n  }\n'], ['\n  mutation mAddWard(\n    $stakeId: String!\n    $wardName: String!\n  ) {\n    submitWard(\n      stakeId: $stakeId\n      wardName: $wardName\n    ) {\n      _id\n      name\n    }\n  }\n']);

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(17);

	var _reactApollo = __webpack_require__(9);

	var _graphqlTag = __webpack_require__(25);

	var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

	var _reactSAlert = __webpack_require__(22);

	var _reactSAlert2 = _interopRequireDefault(_reactSAlert);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var AddWard = function (_Component) {
	  _inherits(AddWard, _Component);

	  function AddWard(props, context) {
	    _classCallCheck(this, AddWard);

	    var _this = _possibleConstructorReturn(this, (AddWard.__proto__ || Object.getPrototypeOf(AddWard)).call(this, props, context));

	    _this.addWard = _this.addWard.bind(_this);
	    return _this;
	  }

	  _createClass(AddWard, [{
	    key: 'addWard',
	    value: function addWard() {
	      var stakeId = this.props.stakeId;
	      var wardName = this.wardName.value;
	      _reactSAlert2.default.info('The ward, ' + wardName + ', was added.', {
	        position: 'top',
	        effect: 'scale',
	        onShow: function onShow() {
	          console.log('aye!');
	        }
	      });
	      // this.props.submit({ stakeId, wardName }).then(({ data }) => {
	      //   console.log('got data', data);
	      //   // this.context.router.push(`/stake/${data.submitWard._id}`);
	      //   this.props.refetchStake();
	      //   this.wardName.value = '';

	      // }).catch((error) => {
	      //   console.log('there was an error sending the query', error);
	      // });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      return _react2.default.createElement(
	        'div',
	        { className: 'container' },
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'label',
	            { htmlFor: 'wardName' },
	            'Ward Name'
	          ),
	          _react2.default.createElement('input', { id: 'wardName', ref: function ref(_ref) {
	              _this2.wardName = _ref;
	            }, type: 'text', className: 'form-control form-control-lg' })
	        ),
	        _react2.default.createElement('br', null),
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'button',
	            { onClick: this.addWard, className: 'btn btn-secondary btn-lg form-control form-control-lg', type: 'button' },
	            'Add Ward'
	          )
	        )
	      );
	    }
	  }]);

	  return AddWard;
	}(_react.Component);

	AddWard.contextTypes = {
	  router: _react2.default.PropTypes.object.isRequired
	};

	AddWard.propTypes = {
	  submit: _react.PropTypes.func.isRequired,
	  refetchStake: _react.PropTypes.func.isRequired,
	  stakeId: _react.PropTypes.string.isRequired
	};

	var mAddWard = (0, _graphqlTag2.default)(_templateObject);

	var AddWardWithData = (0, _reactApollo.graphql)(mAddWard, {
	  props: function props(_ref2) {
	    var mutate = _ref2.mutate;
	    return {
	      submit: function submit(_ref3) {
	        var stakeId = _ref3.stakeId;
	        var wardName = _ref3.wardName;
	        return mutate({ variables: { stakeId: stakeId, wardName: wardName } });
	      }
	    };
	  }
	})(AddWard);

	exports.default = AddWardWithData;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _templateObject = _taggedTemplateLiteral(['\n  query qStake(\n    $stakeId: String!,\n    $wardId: String!,\n  ) {\n    stake: getStake(\n      stakeId: $stakeId,\n    ) {\n      _id\n      name\n    }\n    ward: getWard(\n      stakeId: $stakeId,\n      wardId: $wardId,\n    ) {\n      _id\n      name\n      routes {\n        _id\n        chapel\n        deacons {\n          _id\n          color\n          passToBishop\n          seat {\n            bench\n            position\n            top\n            left\n          }\n          route {\n            bench\n            direction\n            top\n            left\n          }\n          bishop {\n            top\n            left\n          }\n        }\n      }\n    }\n  }\n'], ['\n  query qStake(\n    $stakeId: String!,\n    $wardId: String!,\n  ) {\n    stake: getStake(\n      stakeId: $stakeId,\n    ) {\n      _id\n      name\n    }\n    ward: getWard(\n      stakeId: $stakeId,\n      wardId: $wardId,\n    ) {\n      _id\n      name\n      routes {\n        _id\n        chapel\n        deacons {\n          _id\n          color\n          passToBishop\n          seat {\n            bench\n            position\n            top\n            left\n          }\n          route {\n            bench\n            direction\n            top\n            left\n          }\n          bishop {\n            top\n            left\n          }\n        }\n      }\n    }\n  }\n']);

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(17);

	var _reactApollo = __webpack_require__(9);

	var _graphqlTag = __webpack_require__(25);

	var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

	var _loader = __webpack_require__(26);

	var _loader2 = _interopRequireDefault(_loader);

	var _chapel = __webpack_require__(31);

	var _chapel2 = _interopRequireDefault(_chapel);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	// import AddWard from '../../../../src/ui/components/addWard/addWard.js';

	var Ward = function (_Component) {
	  _inherits(Ward, _Component);

	  function Ward(props, context) {
	    _classCallCheck(this, Ward);

	    var _this = _possibleConstructorReturn(this, (Ward.__proto__ || Object.getPrototypeOf(Ward)).call(this, props, context));

	    _this.addRoute = _this.addRoute.bind(_this);
	    return _this;
	  }

	  _createClass(Ward, [{
	    key: 'addRoute',
	    value: function addRoute(event) {
	      event.preventDefault();
	      this.context.router.push('/stake/' + this.props.stakeId + '/ward/' + this.props.wardId + '/new-route');
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      return this.props.loading ? _react2.default.createElement(_loader2.default, null) : _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'div',
	          { className: 'jumbotron jumbotron-fluid wmr-jumbotron' },
	          _react2.default.createElement(
	            'div',
	            { className: 'container' },
	            _react2.default.createElement(
	              'h2',
	              { className: 'display-5 text-xs-center' },
	              this.props.ward.name
	            ),
	            _react2.default.createElement(
	              'h5',
	              { className: 'display-5 text-xs-center' },
	              this.props.stake.name
	            )
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'container list' },
	          _react2.default.createElement(
	            'div',
	            { className: '' },
	            !this.props.ward.routes ? null : this.props.ward.routes.map(function (route) {
	              return _react2.default.createElement(
	                'div',
	                { key: route._id, style: {
	                    transform: 'scale(0.5)',
	                    height: '200px',
	                    transformOrigin: '50% 0',
	                    backgroundColor: '#00e9a8'
	                  } },
	                _react2.default.createElement(
	                  _reactRouter.Link,
	                  { to: '/stake/' + _this2.props.stakeId + '/ward/' + _this2.props.wardId + '/route/' + route._id },
	                  _react2.default.createElement(_chapel2.default, {
	                    chapelLayout: route.chapel,
	                    deacons: route.deacons,
	                    routeId: route._id
	                  })
	                )
	              );
	            })
	          ),
	          _react2.default.createElement('hr', null),
	          _react2.default.createElement(
	            'div',
	            { className: 'form-group' },
	            _react2.default.createElement(
	              'button',
	              { onClick: this.addRoute, className: 'btn btn-secondary btn-lg form-control form-control-lg', type: 'button' },
	              'Add a Route'
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return Ward;
	}(_react.Component);

	Ward.propTypes = {
	  stake: _react2.default.PropTypes.object.isRequired,
	  loading: _react.PropTypes.bool.isRequired,
	  stakeId: _react2.default.PropTypes.string.isRequired,
	  refetch: _react.PropTypes.func
	};

	Ward.contextTypes = {
	  router: _react2.default.PropTypes.object.isRequired
	};

	var qStake = (0, _graphqlTag2.default)(_templateObject);

	var WardData = (0, _reactApollo.graphql)(qStake, {
	  options: function options(props) {
	    return {
	      variables: {
	        stakeId: props.params.stakeId,
	        wardId: props.params.wardId
	      }
	    };
	  },


	  // ownProps are the props that are passed into the `ProfileWithData`
	  // when it is used by a parent component
	  props: function props(_ref) {
	    var ownProps = _ref.ownProps;
	    var _ref$data = _ref.data;
	    var loading = _ref$data.loading;
	    var stake = _ref$data.stake;
	    var ward = _ref$data.ward;
	    var refetch = _ref$data.refetch;
	    return {
	      ownProps: ownProps,
	      loading: loading,
	      stake: stake || {},
	      ward: ward || {},
	      stakeId: ownProps.params.stakeId,
	      wardId: ownProps.params.wardId,
	      refetch: refetch
	    };
	  }
	})(Ward);

	exports.default = WardData;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.AddRouteWithData = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _templateObject = _taggedTemplateLiteral(['\n  mutation mAddRoute(\n    $stakeId: String!\n    $wardId: String!\n    $chapel: [Int]\n    $deacons: [DeaconInput]\n  ) {\n    submitRoute(\n      stakeId: $stakeId\n      wardId: $wardId\n      chapel: $chapel\n      deacons: $deacons\n    ) {\n      _id\n    }\n  }\n'], ['\n  mutation mAddRoute(\n    $stakeId: String!\n    $wardId: String!\n    $chapel: [Int]\n    $deacons: [DeaconInput]\n  ) {\n    submitRoute(\n      stakeId: $stakeId\n      wardId: $wardId\n      chapel: $chapel\n      deacons: $deacons\n    ) {\n      _id\n    }\n  }\n']);

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(17);

	var _reactApollo = __webpack_require__(9);

	var _graphqlTag = __webpack_require__(25);

	var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

	var _shortid = __webpack_require__(16);

	var _shortid2 = _interopRequireDefault(_shortid);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Chapel = function (_Component) {
	  _inherits(Chapel, _Component);

	  function Chapel(props, context) {
	    _classCallCheck(this, Chapel);

	    var _this = _possibleConstructorReturn(this, (Chapel.__proto__ || Object.getPrototypeOf(Chapel)).call(this, props, context));

	    console.log(props);

	    _this.selectThisBench = _this.selectThisBench.bind(_this);
	    _this.addDeacon = _this.addDeacon.bind(_this);
	    _this.saveRoute = _this.saveRoute.bind(_this);
	    _this.incrementStep = _this.incrementStep.bind(_this);
	    _this.setDeacon = _this.setDeacon.bind(_this);
	    _this.selectSeatingBench = _this.selectSeatingBench.bind(_this);
	    _this.passToBishop = _this.passToBishop.bind(_this);
	    _this.selectFirstBech = _this.selectFirstBech.bind(_this);
	    _this.setPassDirection = _this.setPassDirection.bind(_this);
	    _this.toggleSelectSeat = _this.toggleSelectSeat.bind(_this);
	    _this.toggleSelectRoute = _this.toggleSelectRoute.bind(_this);
	    _this.state = {
	      selectedBench: '0:0:0',
	      selectSeat: false,
	      selectRoute: false,
	      deacons: props.deacons,
	      step: 1,
	      deaconId: ''
	    };
	    return _this;
	  }

	  _createClass(Chapel, [{
	    key: 'selectThisBench',
	    value: function selectThisBench(_ref) {
	      var selectedBench = _ref.target.dataset.selectedBench;

	      this.setState({ selectedBench: selectedBench });
	    }
	  }, {
	    key: 'toggleSelectSeat',
	    value: function toggleSelectSeat() {
	      this.setState({ selectSeat: !this.state.selectSeat });
	    }
	  }, {
	    key: 'toggleSelectRoute',
	    value: function toggleSelectRoute() {
	      this.setState({ selectRoute: !this.state.selectRoute });
	    }
	  }, {
	    key: 'incrementStep',
	    value: function incrementStep() {
	      var step = this.state.step;
	      step++;
	      if (step > 5) step = 1;
	      this.setState({ step: step });
	    }
	  }, {
	    key: 'setDeacon',
	    value: function setDeacon(deaconId) {
	      this.setState({ deaconId: deaconId });
	    }
	  }, {
	    key: 'renderBench',
	    value: function renderBench(_ref2) {
	      var _this2 = this;

	      var position = _ref2.position;
	      var top = _ref2.top;
	      var left = _ref2.left;
	      var right = _ref2.right;

	      return _react2.default.createElement(
	        'div',
	        {
	          onClick: this.selectThisBench,
	          key: position,
	          ref: function ref(_ref3) {
	            _this2[position] = _ref3;
	          },
	          'data-selected-bench': '' + position,
	          className: 'bench',
	          style: {
	            top: top,
	            left: left,
	            right: right
	          }
	        },
	        _react2.default.createElement('div', { 'data-selected-bench': '' + position, className: 'benchEnd benchEndLeft' }),
	        _react2.default.createElement('div', { 'data-selected-bench': '' + position, className: 'benchBack' }),
	        _react2.default.createElement('div', { 'data-selected-bench': '' + position, className: 'benchSeat' }),
	        _react2.default.createElement('div', { 'data-selected-bench': '' + position, className: 'benchEnd benchEndRight' }),
	        this.state.selectSeat ? _react2.default.createElement('div', { 'data-selected-bench': '' + position, className: 'benchTarget' }) : this.state.selectRoute ? _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement('div', { 'data-selected-bench': position + ':right', className: 'benchTarget benchRight' }),
	          _react2.default.createElement('div', { 'data-selected-bench': position + ':left', className: 'benchTarget benchLeft' })
	        ) : null,
	        this.state.selectSeat ? this.state.selectedBench !== '' + position ? null : _react2.default.createElement('div', { className: 'benchHightlight' }) : this.state.selectRoute ? _react2.default.createElement(
	          'div',
	          null,
	          this.state.selectedBench !== position + ':right' ? null : _react2.default.createElement('div', { className: 'benchHightlight benchRight' }),
	          this.state.selectedBench !== position + ':left' ? null : _react2.default.createElement('div', { className: 'benchHightlight benchLeft' })
	        ) : null
	      );
	    }
	  }, {
	    key: 'benchPrep',
	    value: function benchPrep(_ref4) {
	      var position = _ref4.position;
	      var top = _ref4.top;
	      var left = _ref4.left;
	      var width = _ref4.width;
	      var rows = _ref4.rows;

	      var totalWidth = 300;
	      if (rows === 0) {
	        return [null];
	      }
	      var benches = [];
	      for (var i = 0; i < rows; i++) {
	        benches.push(this.renderBench({
	          position: position + ':' + i,
	          top: top + 30 * i + 'px',
	          left: left + 'px',
	          right: totalWidth - width - left + 'px'
	        }));
	      }
	      return benches;
	    }
	  }, {
	    key: 'renderBenches',
	    value: function renderBenches(sections) {
	      var _this3 = this;

	      //default render top left bench
	      var space = 100;
	      var renderedBenches = sections.reduce(function (benches, section, index) {
	        var totalWidth = 300;
	        var left = 0;
	        var width = 75;
	        var top = 100;
	        var sectionHeight = 90;
	        var rows = [1, 1, 1, 1, 1, 1];

	        var loopCount = section === 0 ? 1 : section;
	        width = (totalWidth - 20 * (section - 1)) / loopCount;

	        for (var i = 0; i < loopCount; i++) {

	          var sectionOfBenches = _this3.benchPrep({
	            position: index + ':' + i,
	            top: space,
	            left: left + (width + 20) * i,
	            width: width,
	            rows: section === 0 ? 0 : 3
	          });

	          benches = [].concat(benches, sectionOfBenches);
	        }
	        space += section === 0 ? 30 : 90;
	        return benches;
	      }, []);
	      return renderedBenches;
	    }
	  }, {
	    key: 'getBenches',
	    value: function getBenches() {
	      return _react2.default.createElement(
	        'div',
	        null,
	        this.renderBenches(this.props.chapelLayout)
	      );
	    }
	  }, {
	    key: 'renderDeacons',
	    value: function renderDeacons() {
	      // <div className="deacon"></div>
	      // <div className="deacon route routeDown"></div>
	      // <div className="deacon route routeUp"></div>
	      return this.state.deacons.reduce(function (allDeacons, deacon) {
	        var deaconPositions = [];
	        //push in seat position
	        //get seat bench position

	        deaconPositions.push(_react2.default.createElement('div', { key: deacon._id + ':seat', className: 'deacon', style: {
	            left: deacon.seat.left + 'px',
	            top: deacon.seat.top + 'px',
	            backgroundColor: deacon.color
	          } }));
	        //push in pass to bishop position
	        if (deacon.passToBishop) {

	          deaconPositions.push(_react2.default.createElement('div', { key: deacon._id + ':bishop', className: 'deacon', style: {
	              left: deacon.bishop.left + 'px',
	              top: deacon.bishop.top + 'px',
	              backgroundColor: deacon.color
	            } }));
	        }
	        // push in route position
	        // "0:1:0:right"
	        if (deacon.route.bench) {

	          deaconPositions.push(_react2.default.createElement('div', { key: deacon._id + ':route', className: 'deacon route ' + (deacon.route.direction ? 'route' + deacon.route.direction : ''), style: {
	              left: deacon.route.left + 'px',
	              top: deacon.route.top + 'px',
	              backgroundColor: deacon.color
	            } }));
	        }
	        return [].concat(allDeacons, deaconPositions);
	      }, []);
	    }
	  }, {
	    key: 'getDeaconColor',
	    value: function getDeaconColor(number) {
	      return ['#801515', '#116611', '#261758', '#806D15', '#882E61', '#7B9E35', '#2E4172', '#AA7939', '#D46A6A', '#55AA55', '#615192', '#FCEDA5', '#CA85AC', '#D0EB9A', '#7584A9', '#FCD7A5'][number];
	    }
	  }, {
	    key: 'addDeacon',
	    value: function addDeacon() {
	      var deacons = this.state.deacons;
	      var deacon = {
	        _id: _shortid2.default.generate(),
	        color: this.getDeaconColor(deacons.length), // TODO: make list of safe colors :) 
	        passToBishop: false,
	        seat: {
	          bench: '',
	          top: 0,
	          left: 0,
	          position: null
	        },
	        route: {
	          bench: '',
	          top: 0,
	          left: 0,
	          direction: ''
	        },
	        bishop: {
	          top: null,
	          left: null
	        }
	      };
	      deacons.push(deacon);
	      this.setDeacon(deacon._id);
	      this.toggleSelectSeat();
	      this.setState({ deacons: deacons });
	      this.incrementStep();
	    }
	  }, {
	    key: 'saveRoute',
	    value: function saveRoute() {
	      var _this4 = this;

	      var stakeId = this.props.stakeId;
	      var wardId = this.props.wardId;
	      var chapel = this.props.chapelLayout;
	      var deacons = this.state.deacons;
	      console.log(stakeId, wardId, chapel, deacons);
	      this.props.submit({
	        stakeId: stakeId,
	        wardId: wardId,
	        chapel: chapel,
	        deacons: deacons
	      }).then(function (_ref5) {
	        var data = _ref5.data;

	        _this4.context.router.push('/stake/' + _this4.props.stakeId + '/ward/' + wardId + '/route/' + data.submitRoute._id);
	      }).catch(function (error) {
	        console.log('there was an error sending the query', error);
	      });
	    }
	  }, {
	    key: 'selectSeatingBench',
	    value: function selectSeatingBench() {
	      var _this5 = this;

	      this.toggleSelectSeat();
	      var deacons = this.state.deacons;
	      var deacon = deacons.filter(function (d) {
	        return d._id === _this5.state.deaconId;
	      })[0];
	      deacon.seat.bench = this.state.selectedBench;

	      var seatBench = this[deacon.seat.bench];

	      var deaconsSittingHere = deacons.filter(function (d) {
	        return d.seat.bench === deacon.seat.bench;
	      });
	      var currentSeatPosition = Math.max.apply(Math, _toConsumableArray(deaconsSittingHere.map(function (d) {
	        return d.seat.position;
	      })));
	      deacon.seat.position = currentSeatPosition || currentSeatPosition === 0 ? currentSeatPosition + 1 : 0;

	      var top = 0;
	      var left = 0;
	      if (seatBench) {
	        top = seatBench.offsetTop;
	        left = seatBench.offsetLeft;
	      }

	      deacon.seat.top = top + 2;
	      deacon.seat.left = left + 1 + 11 * (deacon.seat.position - 1);

	      this.setState({ deacons: deacons });
	      this.incrementStep();
	    }
	  }, {
	    key: 'passToBishop',
	    value: function passToBishop(_ref6) {
	      var _this6 = this;

	      var _passToBishop = _ref6.target.dataset.passToBishop;

	      var deacons = this.state.deacons;
	      var deacon = deacons.filter(function (d) {
	        return d._id === _this6.state.deaconId;
	      })[0];
	      deacon.passToBishop = _passToBishop === 'true';
	      if (deacon.passToBishop) {
	        var bishopChair = this.bishopChair;
	        var top = 0;
	        var left = 0;
	        if (bishopChair) {
	          top = bishopChair.offsetTop + 20;
	          left = bishopChair.offsetLeft + bishopChair.offsetParent.offsetLeft - 15;
	        }
	        deacon.bishop.top = top;
	        deacon.bishop.left = left;
	      }

	      this.toggleSelectRoute();
	      this.setState({ deacons: deacons });
	      this.incrementStep();
	    }
	  }, {
	    key: 'selectFirstBech',
	    value: function selectFirstBech() {
	      var _this7 = this;

	      this.toggleSelectRoute();
	      var deacons = this.state.deacons;
	      var deacon = deacons.filter(function (d) {
	        return d._id === _this7.state.deaconId;
	      })[0];
	      deacon.route.bench = this.state.selectedBench;

	      var routeBenchId = deacon.route.bench;
	      var routeBench = void 0;
	      var top = 0;
	      var left = 0;
	      var side = 'right';
	      if (routeBenchId.includes(':right')) {
	        routeBenchId = routeBenchId.replace(/:right/i, '');
	        routeBench = this[routeBenchId];
	        top = routeBench.offsetTop + 2;
	        left = routeBench.offsetLeft + routeBench.offsetWidth;
	      } else {
	        side = 'left';
	        routeBenchId = routeBenchId.replace(/:left/i, '');
	        routeBench = this[routeBenchId];
	        top = routeBench.offsetTop + 2;
	        left = routeBench.offsetLeft - 10;
	      }

	      deacon.route.top = top;
	      deacon.route.left = left;

	      this.setState({ deacons: deacons });
	      this.incrementStep();
	    }
	  }, {
	    key: 'setPassDirection',
	    value: function setPassDirection(_ref7) {
	      var _this8 = this;

	      var passDirection = _ref7.target.dataset.passDirection;

	      var deacons = this.state.deacons;
	      var deacon = deacons.filter(function (d) {
	        return d._id === _this8.state.deaconId;
	      })[0];
	      deacon.route.direction = passDirection;
	      this.setState({ deacons: deacons });
	      this.incrementStep();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this9 = this;

	      return _react2.default.createElement(
	        'div',
	        { className: '' },
	        _react2.default.createElement(
	          'div',
	          { className: 'chapel', style: {
	              transform: 'scale(' + (this.props.scale || 1) + ')'
	            } },
	          _react2.default.createElement(
	            'div',
	            { className: 'stand' },
	            _react2.default.createElement(
	              'div',
	              { className: 'centerSection' },
	              _react2.default.createElement('div', { className: 'podium' }),
	              _react2.default.createElement('div', { ref: function ref(_ref8) {
	                  _this9.bishopChair = _ref8;
	                }, className: 'chair chairOne' }),
	              _react2.default.createElement('div', { className: 'chair chairTwo' }),
	              _react2.default.createElement('div', { className: 'chair chairThree' })
	            ),
	            _react2.default.createElement('div', { className: 'sacramentTable sacramentTableLeft' }),
	            _react2.default.createElement('div', { className: 'sacramentTable sacramentTableRight' })
	          ),
	          this.getBenches(),
	          this.renderDeacons()
	        ),
	        this.props.routeId ? null : _react2.default.createElement(
	          'div',
	          { className: 'interact' },
	          this.state.step !== 1 ? null : _react2.default.createElement(
	            'div',
	            { className: 'step stepOne' },
	            _react2.default.createElement(
	              'div',
	              { className: 'form-group' },
	              _react2.default.createElement(
	                'label',
	                { htmlFor: 'addDeacon' },
	                'Click to add another deacon.'
	              ),
	              _react2.default.createElement(
	                'button',
	                { id: 'addDeacon', onClick: this.addDeacon, className: 'btn btn-secondary btn-lg form-control form-control-lg', type: 'button' },
	                'Add a Deacon'
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'form-group' },
	              _react2.default.createElement(
	                'label',
	                { htmlFor: 'addDeacon' },
	                'Click save the route.'
	              ),
	              _react2.default.createElement(
	                'button',
	                { id: 'addDeacon', onClick: this.saveRoute, className: 'btn btn-secondary btn-lg form-control form-control-lg', type: 'button' },
	                'Save Route'
	              )
	            )
	          ),
	          this.state.step !== 2 ? null : _react2.default.createElement(
	            'div',
	            { className: 'step stepTwo' },
	            _react2.default.createElement(
	              'div',
	              { className: 'form-group' },
	              _react2.default.createElement(
	                'label',
	                { htmlFor: 'addDeacon' },
	                'Select the bench he sits on.'
	              ),
	              _react2.default.createElement(
	                'button',
	                { id: 'addDeacon', onClick: this.selectSeatingBench, className: 'btn btn-secondary btn-lg form-control form-control-lg', type: 'button' },
	                'Next'
	              )
	            )
	          ),
	          this.state.step !== 3 ? null : _react2.default.createElement(
	            'div',
	            { className: 'step stepThree' },
	            _react2.default.createElement(
	              'div',
	              { className: 'form-group' },
	              _react2.default.createElement(
	                'label',
	                { htmlFor: 'sacramentToBishop' },
	                'Passes Sacrament to the Bishop?'
	              ),
	              _react2.default.createElement(
	                'button',
	                { id: 'sacramentToBishop', 'data-pass-to-bishop': true, onClick: this.passToBishop, className: 'btn btn-secondary btn-lg form-control form-control-lg', type: 'button' },
	                'Yes'
	              ),
	              _react2.default.createElement(
	                'button',
	                { id: 'sacramentToBishop', 'data-pass-to-bishop': false, onClick: this.passToBishop, className: 'btn btn-secondary btn-lg form-control form-control-lg', type: 'button' },
	                'No'
	              )
	            )
	          ),
	          this.state.step !== 4 ? null : _react2.default.createElement(
	            'div',
	            { className: 'step stepFour' },
	            _react2.default.createElement(
	              'div',
	              { className: 'form-group' },
	              _react2.default.createElement(
	                'label',
	                { htmlFor: 'addDeacon' },
	                'Select the bench he passes sacrament to first.'
	              ),
	              _react2.default.createElement(
	                'button',
	                { id: 'addDeacon', onClick: this.selectFirstBech, className: 'btn btn-secondary btn-lg form-control form-control-lg', type: 'button' },
	                'Next'
	              )
	            )
	          ),
	          this.state.step !== 5 ? null : _react2.default.createElement(
	            'div',
	            { className: 'step stepFive' },
	            _react2.default.createElement(
	              'div',
	              { className: 'form-group' },
	              _react2.default.createElement(
	                'label',
	                { htmlFor: 'sacramentToBishop' },
	                'Moves up or down?'
	              ),
	              _react2.default.createElement(
	                'button',
	                { id: 'sacramentToBishop', 'data-pass-direction': 'Up', onClick: this.setPassDirection, className: 'btn btn-secondary btn-lg form-control form-control-lg', type: 'button' },
	                'Up'
	              ),
	              _react2.default.createElement(
	                'button',
	                { id: 'sacramentToBishop', 'data-pass-direction': 'Down', onClick: this.setPassDirection, className: 'btn btn-secondary btn-lg form-control form-control-lg', type: 'button' },
	                'Down'
	              )
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return Chapel;
	}(_react.Component);

	exports.default = Chapel;


	Chapel.contextTypes = {
	  router: _react2.default.PropTypes.object.isRequired
	};

	Chapel.propTypes = {
	  chapelLayout: _react.PropTypes.array
	};

	var mAddRoute = (0, _graphqlTag2.default)(_templateObject);

	var AddRouteWithData = (0, _reactApollo.graphql)(mAddRoute, {
	  props: function props(_ref9) {
	    var mutate = _ref9.mutate;
	    return {
	      submit: function submit(_ref10) {
	        var stakeId = _ref10.stakeId;
	        var wardId = _ref10.wardId;
	        var chapel = _ref10.chapel;
	        var deacons = _ref10.deacons;
	        return mutate({ variables: { stakeId: stakeId, wardId: wardId, chapel: chapel, deacons: deacons } });
	      }
	    };
	  }
	})(Chapel);

	exports.AddRouteWithData = AddRouteWithData;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _chapel = __webpack_require__(31);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var NewRoute = function (_Component) {
	  _inherits(NewRoute, _Component);

	  function NewRoute(props, context) {
	    _classCallCheck(this, NewRoute);

	    return _possibleConstructorReturn(this, (NewRoute.__proto__ || Object.getPrototypeOf(NewRoute)).call(this, props, context));
	  }

	  _createClass(NewRoute, [{
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        { className: 'container' },
	        _react2.default.createElement(_chapel.AddRouteWithData, _extends({}, this.props.params, { chapelLayout: [3, 3, 0, 3], deacons: [] }))
	      );
	    }
	  }]);

	  return NewRoute;
	}(_react.Component);

	exports.default = NewRoute;


	NewRoute.contextTypes = {};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _templateObject = _taggedTemplateLiteral(['\n  query qRoute(\n    $stakeId: String!,\n    $wardId: String!,\n    $routeId: String!,\n  ) {\n    route: getRoute(\n      stakeId: $stakeId,\n      wardId: $wardId,\n      routeId: $routeId,\n    ) {\n      _id\n      chapel\n      deacons {\n        _id\n        color\n        passToBishop\n        seat {\n          bench\n          position\n          top\n          left\n        }\n        route {\n          bench\n          direction\n          top\n          left\n        }\n        bishop {\n          top\n          left\n        }\n      } \n    }\n  }\n'], ['\n  query qRoute(\n    $stakeId: String!,\n    $wardId: String!,\n    $routeId: String!,\n  ) {\n    route: getRoute(\n      stakeId: $stakeId,\n      wardId: $wardId,\n      routeId: $routeId,\n    ) {\n      _id\n      chapel\n      deacons {\n        _id\n        color\n        passToBishop\n        seat {\n          bench\n          position\n          top\n          left\n        }\n        route {\n          bench\n          direction\n          top\n          left\n        }\n        bishop {\n          top\n          left\n        }\n      } \n    }\n  }\n']);

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactApollo = __webpack_require__(9);

	var _graphqlTag = __webpack_require__(25);

	var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

	var _chapel = __webpack_require__(31);

	var _chapel2 = _interopRequireDefault(_chapel);

	var _loader = __webpack_require__(26);

	var _loader2 = _interopRequireDefault(_loader);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Route = function (_Component) {
	  _inherits(Route, _Component);

	  function Route(props, context) {
	    _classCallCheck(this, Route);

	    return _possibleConstructorReturn(this, (Route.__proto__ || Object.getPrototypeOf(Route)).call(this, props, context));
	  }

	  _createClass(Route, [{
	    key: 'render',
	    value: function render() {
	      return this.props.loading ? _react2.default.createElement(_loader2.default, null) : _react2.default.createElement(
	        'div',
	        { className: 'container' },
	        _react2.default.createElement(_chapel2.default, _extends({}, this.props.params, {
	          chapelLayout: this.props.route.chapel,
	          deacons: this.props.route.deacons
	        }))
	      );
	    }
	  }]);

	  return Route;
	}(_react.Component);

	Route.contextTypes = {};

	var qRoute = (0, _graphqlTag2.default)(_templateObject);

	var RouteData = (0, _reactApollo.graphql)(qRoute, {
	  options: function options(props) {
	    return {
	      variables: {
	        stakeId: props.params.stakeId,
	        wardId: props.params.wardId,
	        routeId: props.params.routeId
	      }
	    };
	  },


	  // ownProps are the props that are passed into the `ProfileWithData`
	  // when it is used by a parent component
	  props: function props(_ref) {
	    var ownProps = _ref.ownProps;
	    var _ref$data = _ref.data;
	    var loading = _ref$data.loading;
	    var route = _ref$data.route;
	    var refetch = _ref$data.refetch;
	    return {
	      ownProps: ownProps,
	      loading: loading,
	      route: route || {},
	      stakeId: ownProps.params.stakeId,
	      wardId: ownProps.params.wardId,
	      routeId: ownProps.params.routeId,
	      refetch: refetch
	    };
	  }
	})(Route);

	exports.default = RouteData;

/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 35 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = require("compression");

/***/ }
/******/ ]);