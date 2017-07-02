import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createMemoryHistory } from 'history';
import { routerMiddleware, routerActions } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import { forwardToMain, forwardToRenderer, triggerAlias, replayActionMain, replayActionRenderer } from 'electron-redux';
import rootReducer from '../reducers';
import * as counterActions from '../actions/counter';
// import type { counterStateType } from '../reducers/counter';

const history = createMemoryHistory();

/**
 * @param  {Object} initialState
 * @param  {String} [scope='main|renderer']
 * @return {Object} store
 */
const configureStore = (initialState, scope = 'main') => {
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
  let composeEnhancers;
  /* eslint-disable no-underscore-dangle */
  if (scope === 'renderer') {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
        actionCreators,
      })
      : compose;
  } else {
    composeEnhancers = compose;
  }
  /* eslint-enable no-underscore-dangle */

  scope === 'main' ? middleware.push(triggerAlias) :
    middleware.push(forwardToMain);

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);

  // Create Store
  const store = createStore(rootReducer, initialState, enhancer);

  // Subscribe to Store Changes
  store.subscribe(() => {
    console.log('store changed: ', store.getState());
  });

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
    );
  }

  scope === 'main' ? replayActionMain(store) : replayActionRenderer(store);

  return store;
};

export default { configureStore, history };
