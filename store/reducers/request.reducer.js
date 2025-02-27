import * as actions from "../actions/request.actions";

const initialState = [];

// https://stackoverflow.com/a/32922084
const deepEqual = (x, y) => {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y;
  return x && y && tx === "object" && tx === ty
    ? ok(x).length === ok(y).length &&
        ok(x).every((key) => deepEqual(x[key], y[key]))
    : x === y;
};

export default function requestReducer(state = initialState, action) {
  switch (action.type) {
    case actions.REQUEST_ENQUEUE:
      if (!action?.request) return state;
      // NOTE: filter out duplicates
      const _state = state?.filter(
        (request) => !deepEqual(request, action.request)
      );
      return [..._state, action.request];
    case actions.REQUEST_DEQUEUE:
      if (!action?.request) return state;
      return (
        state?.filter((request) => !deepEqual(request, action.request)) ?? []
      );
    default:
      return state;
  }
}
