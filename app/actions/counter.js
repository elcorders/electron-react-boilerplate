// @flow

/** ORIGINAL START */
// import type { counterStateType } from '../reducers/counter';

// type actionType = {
//   type: string
// };

// export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
// export const DECREMENT_COUNTER = 'DECREMENT_COUNTER';

// export function increment() {
//   return {
//     type: INCREMENT_COUNTER
//   };
// }

// export function decrement() {
//   return {
//     type: DECREMENT_COUNTER
//   };
// }

// export function incrementIfOdd() {
//   return (dispatch: (action: actionType) => void, getState: () => counterStateType) => {
//     const { counter } = getState();

//     if (counter % 2 === 0) {
//       return;
//     }

//     dispatch(increment());
//   };
// }

// export function incrementAsync(delay: number = 1000) {
//   return (dispatch: (action: actionType) => void) => {
//     setTimeout(() => {
//       dispatch(increment());
//     }, delay);
//   };
// }
/** ORIGINAL END */

// FSA Compliant approach
import { createAliasedAction } from 'electron-redux';
import type { counterStateType } from '../reducers/counter';

type actionType = {
  type: string
};

export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER';

// A standard FSA-complaint action
export function increment() {
  return {
    type: INCREMENT_COUNTER,
  };
}

export function decrement() {
  return {
    type: DECREMENT_COUNTER
  };
}

// FSA with a payload
export function incrementBy(step) {
  return {
    type: INCREMENT_COUNTER,
    payload: step,
  };
}

// redux-thunk action that triggers FSA renderer-side
export function incrementAsync() {
  return dispatch => {
    setTimeout(() => {
      // Yay! Can invoke sync or async actions with `dispatch`
      dispatch(increment());
    }, 1000);
  };
}

export function incrementIfOdd() {
  return (dispatch: (action: actionType) => void, getState: () => counterStateType) => {
    const { count } = getState();

    if (count % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}

// redux-thunk action that triggers FSA with payload
export function incrementByAsync(step) {
  return dispatch => {
    setTimeout(() => {
      dispatch(incrementBy(step));
    }, 1000);
  };
}

// aliased action that triggers FSA main-side
export const incrementMain = createAliasedAction(
  INCREMENT_COUNTER,
  increment
);

// aliased action that triggers thunk action (which produces FSA) main-side (recommended)
export const incrementAsyncMain = createAliasedAction(
  `${INCREMENT_COUNTER}_MAIN`,
  incrementAsync
);

// same as above, with payload (recommended)
export const incrementByAsyncMain = createAliasedAction(
  `${INCREMENT_COUNTER}_BY_ASYNC_MAIN`,
  incrementByAsync
);

export function incrementPromise() {
  return {
    type: INCREMENT_COUNTER,
    payload: {
      promise: new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      }),
    },
  };
}

export const incrementPromiseMain = createAliasedAction(
  `${INCREMENT_COUNTER}_PROMISE_MAIN`,
  incrementPromise
);

export function incrementPromiseLocal() {
  return {
    type: INCREMENT_COUNTER,
    payload: {
      promise: new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      }),
    },
    meta: {
      scope: 'local',
    },
  };
}
