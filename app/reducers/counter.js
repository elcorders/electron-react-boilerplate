// @flow

/** ORIGINAL START */
// import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../actions/counter';

// export type counterStateType = {
//   counter: number
// };

// type actionType = {
//   type: string
// };

// export default function counter(state: number = 0, action: actionType) {
//   switch (action.type) {
//     case INCREMENT_COUNTER:
//       return state + 1;
//     case DECREMENT_COUNTER:
//       return state - 1;
//     default:
//       return state;
//   }
// }
/** ORIGINAL END */

/* eslint-disable no-param-reassign */
import { INCREMENT_COUNTER } from '../actions/counter';

export type counterStateType = {
  count: number,
  loading: boolean
};

type actionType = {
  type: string
};

const initialState = {
  count: 0,
  loading: false,
};

export default function counter(state: counterStateType = initialState, action: actionType) {
  switch (action.type) {
    case `${INCREMENT_COUNTER}_PENDING`: {
      return {
        ...state,
        loading: true,
      };
    }
    case `${INCREMENT_COUNTER}_FULFILLED`:
    case INCREMENT_COUNTER: {
      const step = action.payload || 1;
      return {
        ...state,
        loading: false,
        count: parseInt(state.count + step, 10) || initialState.count,
      };
    }

    default:
      return state;
  }
}
