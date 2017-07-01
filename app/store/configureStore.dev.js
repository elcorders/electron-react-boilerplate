import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createMemoryHistory } from 'history';
import { routerMiddleware, routerActions } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';
import * as counterActions from '../actions/counter';
// import type { counterStateType } from '../reducers/counter';
//
import { forwardToMain, forwardToRenderer, triggerAlias, replayActionMain, replayActionRenderer } from 'electron-redux';

let history = createMemoryHistory();

/**
 * @param  {Object} initialState
 * @param  {String} [scope='main|renderer']
 * @return {Object} store
 */
const configureStore = (initialState = {}, scope = 'main') => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  if (scope === 'main') { middleware.push(forwardToRenderer); }

  // Thunk Middleware
  middleware.push(thunk);

  // Logging Middleware
  const logger = createLogger({
    // level: 'info',
    level: scope === 'main' ? undefined : 'info',
    collapsed: true
  });
  middleware.push(logger);

  // Router Middleware
  const router = routerMiddleware(history);
  middleware.push(router);

  // Redux DevTools Configuration
  const actionCreators = {
    ...counterActions,
    ...routerActions,
  };
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */


  let composeEnhancers;

  scope === 'main' ? composeEnhancers = compose : composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
      actionCreators,
    })
    : compose;
  /* eslint-enable no-underscore-dangle */

  scope === 'main' ? middleware.push(triggerAlias) :
    middleware.push(forwardToMain);

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);

  // let initialState = {};
  // if (scope !== 'main') { initialState = getInitialStateRenderer(); }

  // Create Store
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
    );
  }

  // scope === 'main' ? replayActionMain(store) : replayActionRenderer(store);

  if (scope === 'main') {
    console.log('throw');
    console.log('store: ', store);
    replayActionMain(store);
  } else {
    replayActionRenderer(store);
  }

  return store;
};

// export default { configureStore, history };
export default { configureStore };
