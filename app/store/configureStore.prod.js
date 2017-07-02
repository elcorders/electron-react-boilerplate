// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createMemoryHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { forwardToMain, forwardToRenderer, triggerAlias, replayActionMain, replayActionRenderer } from 'electron-redux';
import rootReducer from '../reducers';
import type { counterStateType } from '../reducers/counter';

// const history = createBrowserHistory();
const history = createMemoryHistory();
const router = routerMiddleware(history);
// const enhancer = applyMiddleware(thunk, router);
let enhancer;

// function configureStore(initialState?: counterStateType) {
//   return createStore(rootReducer, initialState, enhancer);
// }

function configureStore(initialState, scope: string = 'main') {
  scope === 'main' ? enhancer = applyMiddleware(triggerAlias, thunk, router, forwardToRenderer) : enhancer = applyMiddleware(forwardToMain, thunk, router);

  const store = createStore(rootReducer, initialState, enhancer);

  scope === 'main' ? replayActionMain(store) : replayActionRenderer(store);

  return store;
}

export default { configureStore, history };
