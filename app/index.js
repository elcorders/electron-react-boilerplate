import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
// import { configureStore, history } from './store/configureStore';
import { configureStore } from './store/configureStore';
import './app.global.css';
import { getInitialStateRenderer, replayActionRenderer } from 'electron-redux';

const initialState = getInitialStateRenderer();
const store = configureStore(initialState, 'renderer');
replayActionRenderer(store);

render(
  <AppContainer>
    <Root store={store} />
  </AppContainer>,
  document.getElementById('root')
);

// if (module.hot) {
//   module.hot.accept('./containers/Root', () => {
//     const NextRoot = require('./containers/Root'); // eslint-disable-line global-require
//     render(
//       <AppContainer>
//         <NextRoot store={store} history={history} />
//       </AppContainer>,
//       document.getElementById('root')
//     );
//   });
// }

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root'); // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextRoot store={store} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
