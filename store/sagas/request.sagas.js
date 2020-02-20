// adapted from:
//   -- https://www.youtube.com/watch?v=Pg7LgW3TL7A
//   -- https://redux-saga.js.org/docs/advanced/Channels.html

import { take, fork, call, put, race, delay, actionChannel, select } from 'redux-saga/effects';

const REQUEST_TIMEOUT_MILLIS = 10000;

function* sendRequest(url, data) {
  const request = yield fetch(url, data)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      }
      throw response;
    })
    .then((response) => response.json())
    .then((response) => ({
      status: 200,
      data: response,
    }))
    .catch((error) => {
      if (typeof error.json === 'function') {
        return error.json().then((errorJSON) => ({
          status: errorJSON.data && errorJSON.data.status ? errorJSON.data.status : '',
          data: {
            code: errorJSON.code,
            message: errorJSON.message,
          },
        }));
      }
      return {
        status: 400,
        data: {
          code: 400,
          message: error.toString(),
        },
      };
    });
  return request;
}

function* processRequest(request) {
  let oldID;
  let requestCopy = { ...request };

  if (requestCopy.data.body) {
    const jsonParseBody = JSON.parse(requestCopy.data.body);
    // request has ID and the id its Autogenerated

    if (jsonParseBody.ID) {
      if (Number.isNaN(jsonParseBody.ID)) {
        oldID = jsonParseBody.ID;
      }
      delete jsonParseBody.ID;
      requestCopy = {
        ...requestCopy,
        data: {
          ...requestCopy.data,
          body: JSON.stringify(jsonParseBody),
        },
      };
    }
  }
  const { response, timeout } = yield race({
    response: call(sendRequest, requestCopy.url, requestCopy.data),
    timeout: delay(REQUEST_TIMEOUT_MILLIS),
  });
  if (response) {
    if (requestCopy.action) {
      yield put({ type: requestCopy.action, payload: oldID ? { ...response, oldID } : response });
    }
    // Dispatch action 'RESPONSE' to remove request from queue
    yield put({ type: 'RESPONSE', payload: request });
  } else if (timeout) {
    yield put({ type: 'OFFLINE' });
  }
}

export default function* requestSaga() {
  // buffer all incoming requests
  const requestChannel = yield actionChannel('REQUEST');
  while (true) {
    const { request } = yield race({
      request: take(requestChannel),
    });
    const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
    const localGetById = {
      value: null,
      isLocal: false,
    };
    if (request.payload.data.method === 'GET' && request.payload.action.includes('GETBYID')) {
      let id = request.payload.url.split('/');
      id = id[id.length - 1];
      localGetById.value = id;
      if (Number.isNaN(id)) {
        localGetById.isLocal = true;
      }
    }
    if (!isConnected || localGetById.isLocal) {
      // Get last request
      const payload = yield select((state) => state.requestReducer.currentAction);
      // OFFLINE request
      if (payload) {
        if (payload.data.method === 'POST' && payload.action.includes('SAVE')) {
          // Offline entity creation (send "last request" as response)
          /* eslint-disable */
          yield put({ type: payload.action, payload: JSON.parse(payload.data.body) });
          /* eslint-enable */
        }
        if (payload.data.method === 'GET' && payload.action.includes('GETBYID')) {
          yield put({
            type: payload.action,
            payload: { data: { ID: localGetById.value, isOffline: true }, status: 200 },
          });
        }
        if (payload.data.method === 'GET' && payload.action.includes('GETALL')) {
          const entityName = payload.action.substr(0, payload.action.indexOf('_')).toLowerCase();
          const list = yield select((state) => state[`${entityName}Reducer`][`${entityName}`]);
          yield put({ type: payload.action, payload: { data: { posts: list }, status: 200 } });
        }
        if (payload.data.method === 'GET' && payload.action.includes('GET_LOCATIONS')) {
          const entityName = payload.action.substr(0, payload.action.indexOf('_')).toLowerCase();
          const list = yield select((state) => state[`${entityName}Reducer`]['geonames']);
          yield put({
            type: payload.action,
            payload: { data: { location_grid: list }, status: 200 },
          });
        }
      }
    } else if (request) {
      // ONLINE request
      // Get current queue, compare it with last request (if exist, fork it)
      const queue = yield select((state) => state.requestReducer.queue);
      let requestIndex;
      if (request.payload.data.method === 'POST') {
        requestIndex = queue.findIndex(
          (requestQueue) =>
            requestQueue.action === request.payload.action &&
            requestQueue.url === request.payload.url &&
            requestQueue.data.method === request.payload.data.method &&
            JSON.parse(requestQueue.data.body).ID === JSON.parse(request.payload.data.body).ID,
        );
      } else {
        requestIndex = queue.findIndex(
          (requestQueue) =>
            requestQueue.action === request.payload.action &&
            requestQueue.url === request.payload.url &&
            requestQueue.data.method === request.payload.data.method,
        );
      }
      if (requestIndex > -1) {
        yield fork(processRequest, queue[requestIndex]);
      }
    }
  }
}
