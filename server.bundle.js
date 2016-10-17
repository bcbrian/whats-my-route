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

	var _graphqlTools = __webpack_require__(3);

	var _schema = __webpack_require__(4);

	var _schema2 = _interopRequireDefault(_schema);

	var _resolvers = __webpack_require__(5);

	var _resolvers2 = _interopRequireDefault(_resolvers);

	var _react = __webpack_require__(9);

	var _react2 = _interopRequireDefault(_react);

	var _server = __webpack_require__(10);

	var _reactRouter = __webpack_require__(11);

	var _routes = __webpack_require__(12);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// server.js
	var express = __webpack_require__(24);
	var path = __webpack_require__(25);
	var compression = __webpack_require__(26);
	// we'll use this to render our app to an html string

	// and these to match the url to routes and then render


	var app = express();

	app.use(compression());

	// serve our static stuff like index.css
	app.use(express.static(path.join(__dirname, 'public')));

	var schema = (0, _graphqlTools.makeExecutableSchema)({
	  typeDefs: _schema2.default,
	  resolvers: _resolvers2.default
	});

	app.use('/graphql', _bodyParser2.default.json(), (0, _apolloServer.apolloExpress)({ schema: schema }));

	app.use('/graphiql', (0, _apolloServer.graphiqlExpress)({
	  endpointURL: '/graphql'
	}));

	app.get('*', function (req, res) {
	  (0, _reactRouter.match)({ routes: _routes.routes, location: req.url }, function (err, redirect, props) {
	    console.log('props: ', props);
	    // in here we can make some decisions all at once
	    if (err) {
	      // there was an error somewhere during route matching
	      res.status(500).send(err.message);
	    } else if (redirect) {
	      // we haven't talked about `onEnter` hooks on routes, but before a
	      // route is entered, it can redirect. Here we handle on the server.
	      res.redirect(redirect.pathname + redirect.search);
	    } else if (props) {
	      // if we got props then we matched a route and can render
	      var appHtml = (0, _server.renderToString)(_react2.default.createElement(_reactRouter.RouterContext, props));
	      res.send(renderPage(appHtml));
	    } else {
	      // no errors, no redirect, we just didn't match anything
	      res.status(404).send('Not Found');
	    }
	  });
	});

	function renderPage(appHtml) {
	  return '\n    <!doctype html public="storage">\n    <html>\n    <meta charset=utf-8/>\n    <title>My First React Router App</title>\n    <link rel=stylesheet href=/index.css>\n    <div id=app>' + appHtml + '</div>\n    <script src="/bundle.js"></script>\n   ';
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
/***/ function(module, exports) {

	module.exports = require("graphql-tools");

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var schema = "\n\ntype Ward {\n  _id: String!\n  name: String\n}\ntype Stake {\n  _id: String!\n  name: String\n  wards: [Ward]\n  wardCount: Int\n}\n\n\n# the schema allows the following query:\ntype Query {\n  stakes: [Stake]\n  searchStakes(\n    searchString: String!\n  ): [Stake] \n}\n\ntype Mutation {\n  submitStake(\n    stakeName: String!\n    wardName: String!\n  ): Stake\n  \n  submitWard(\n    stakeId: String!\n    wardName: String!\n  ): Stake\n}\n\n\n";

	exports.default = schema;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Stakes = __webpack_require__(6);

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
	      var regexTerms = [];
	      searchTerms.forEach(function (st) {
	        regexTerms.push(new RegExp('.*' + st + '.*'));
	      });
	      return new Promise(function (resolve, reject) {
	        timeoutReject(reject, 'MongoDB timeout when searching stakes (timeout is 500ms)');
	        _Stakes.Stakes.find({ name: { $all: regexTerms } }, function (err, stakes) {
	          if (err) return reject('MongoDB failed to find a match for search');
	          resolve(stakes || []);
	        });
	      });
	    }
	  },
	  Mutation: {
	    submitStake: function submitStake(_, _ref2, context) {
	      var stakeName = _ref2.stakeName;
	      var wardName = _ref2.wardName;

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
	    submitWard: function submitWard(_, _ref3, context) {
	      var stakeId = _ref3.stakeId;
	      var wardName = _ref3.wardName;

	      return new Promise(function (resolve, reject) {
	        timeoutReject(reject, 'MongoDB timeout when adding a ward (timeout is 500ms)');
	        _Stakes.Stakes.findByIdAndUpdate(stakeId, { $push: { wards: { name: wardName } } }, { new: true }, function (err, stake) {
	          if (err) return reject('MongoDB failed to update the stake to the database');
	          resolve(stake);
	        });
	      });
	    }
	  },
	  Stake: {
	    wards: function wards(_ref4, _, context) {
	      var _wards = _ref4.wards;

	      return _wards;
	    },
	    wardCount: function wardCount(_ref5, _, context) {
	      var wards = _ref5.wards;

	      return wards.length;
	    }
	  }
	};

	exports.default = resolveFunctions;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Stakes = undefined;

	var _mongoose = __webpack_require__(7);

	var _mongoose2 = _interopRequireDefault(_mongoose);

	var _shortid = __webpack_require__(8);

	var _shortid2 = _interopRequireDefault(_shortid);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var mongo = _mongoose2.default.connect('mongodb://whatsmyroute:whatsmyroute@ds059316.mlab.com:59316/whatsmyroute');

	var StakeSchema = _mongoose2.default.Schema({
	  name: String,
	  wards: [{
	    name: String,
	    _id: {
	      type: String,
	      'default': _shortid2.default.generate
	    }
	  }]
	});

	var Stakes = _mongoose2.default.model('stakes', StakeSchema);

	exports.Stakes = Stakes;

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("mongoose");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("shortid");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("react-dom/server");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("react-router");

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.routes = undefined;

	var _react = __webpack_require__(9);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(13);

	var _reactRouter = __webpack_require__(11);

	var _apolloClient = __webpack_require__(14);

	var _apolloClient2 = _interopRequireDefault(_apolloClient);

	var _reactApollo = __webpack_require__(15);

	var _layout = __webpack_require__(16);

	var _layout2 = _interopRequireDefault(_layout);

	var _home = __webpack_require__(18);

	var _home2 = _interopRequireDefault(_home);

	var _stakeSearch = __webpack_require__(19);

	var _stakeSearch2 = _interopRequireDefault(_stakeSearch);

	var _stake = __webpack_require__(23);

	var _stake2 = _interopRequireDefault(_stake);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// const networkInterface = createNetworkInterface('https://whats-my-route-bcbrian.c9users.io');
	// const client = new ApolloClient(networkInterface);
	var client = new _apolloClient2.default();

	var routes = _react2.default.createElement(
	  _reactRouter.Route,
	  { path: '/', component: _layout2.default },
	  _react2.default.createElement(_reactRouter.IndexRoute, { component: _home2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: '/search/:searchString', component: _stakeSearch2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: '/stake/:stakeName', component: _stake2.default })
	);

	if (typeof document !== "undefined") {
	  (0, _reactDom.render)(_react2.default.createElement(
	    _reactApollo.ApolloProvider,
	    { client: client },
	    _react2.default.createElement(_reactRouter.Router, { routes: routes, history: _reactRouter.browserHistory })
	  ), document.getElementById('app'));
	}

	exports.routes = routes;

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("react-dom");

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("apollo-client");

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require("react-apollo");

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(9);

	var _react2 = _interopRequireDefault(_react);

	var _reactAddonsCssTransitionGroup = __webpack_require__(17);

	var _reactAddonsCssTransitionGroup2 = _interopRequireDefault(_reactAddonsCssTransitionGroup);

	var _reactRouter = __webpack_require__(11);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
/* 17 */
/***/ function(module, exports) {

	module.exports = require("react-addons-css-transition-group");

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(9);

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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.StakesSearch = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _templateObject = _taggedTemplateLiteral(['\n  query qStakes(\n    $searchString: String!,\n  ) {\n    stakes: searchStakes(\n      searchString: $searchString,\n    ) {\n      _id\n      name\n      wardCount\n    }\n  }\n'], ['\n  query qStakes(\n    $searchString: String!,\n  ) {\n    stakes: searchStakes(\n      searchString: $searchString,\n    ) {\n      _id\n      name\n      wardCount\n    }\n  }\n']);

	var _react = __webpack_require__(9);

	var _react2 = _interopRequireDefault(_react);

	var _reactApollo = __webpack_require__(15);

	var _graphqlTag = __webpack_require__(20);

	var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

	var _lodash = __webpack_require__(21);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _loader = __webpack_require__(22);

	var _loader2 = _interopRequireDefault(_loader);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var StakesSearch = exports.StakesSearch = function (_Component) {
	  _inherits(StakesSearch, _Component);

	  function StakesSearch(props) {
	    _classCallCheck(this, StakesSearch);

	    return _possibleConstructorReturn(this, (StakesSearch.__proto__ || Object.getPrototypeOf(StakesSearch)).call(this, props));
	  }

	  _createClass(StakesSearch, [{
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
	            _react2.default.createElement(
	              'p',
	              { className: 'text-xs-center' },
	              'When searching for "',
	              this.props.searchString,
	              '" this is what we found.'
	            )
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'container list' },
	          _react2.default.createElement(
	            'ul',
	            { className: 'list-group' },
	            this.props.stakes.map(function (stake) {
	              return _react2.default.createElement(
	                'li',
	                { className: 'list-group-item' },
	                _react2.default.createElement(
	                  'span',
	                  { className: 'tag tag-default tag-pill pull-xs-right' },
	                  stake.wardCount
	                ),
	                stake.name
	              );
	            })
	          )
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
	    console.log('props.params: ', props.params);
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
/* 20 */
/***/ function(module, exports) {

	module.exports = require("graphql-tag");

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Loader;

	var _react = __webpack_require__(9);

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
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(9);

	var _react2 = _interopRequireDefault(_react);

	var _reactApollo = __webpack_require__(15);

	var _graphqlTag = __webpack_require__(20);

	var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

	var _lodash = __webpack_require__(21);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _loader = __webpack_require__(22);

	var _loader2 = _interopRequireDefault(_loader);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
	              'North Rose Park Stake'
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
	            _react2.default.createElement(
	              'li',
	              { className: 'list-group-item' },
	              _react2.default.createElement(
	                'span',
	                { className: 'tag tag-default tag-pill pull-xs-right' },
	                '2'
	              ),
	              '1st ward'
	            ),
	            _react2.default.createElement(
	              'li',
	              { className: 'list-group-item' },
	              _react2.default.createElement(
	                'span',
	                { className: 'tag tag-default tag-pill pull-xs-right' },
	                '1'
	              ),
	              '6th ward'
	            ),
	            _react2.default.createElement(
	              'li',
	              { className: 'list-group-item' },
	              _react2.default.createElement('i', { className: 'fa fa-plus', 'aria-hidden': 'true' }),
	              ' Add A Ward'
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return Stake;
	}(_react.Component);

	// Stake.propTypes = {
	//   loading: PropTypes.bool.isRequired,
	// };


	exports.default = Stake;

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = require("compression");

/***/ }
/******/ ]);