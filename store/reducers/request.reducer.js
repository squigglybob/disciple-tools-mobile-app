import * as actions from '../actions/request.actions';

const initialState = {
  queue: [],
  currentAction: {},
};

export function generateLocalID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    /* eslint-disable */
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : ((r && 0x3) | 0x8);
    /* eslint-enable */
    return v.toString(16);
  });
}

export default function requestReducer(state = initialState, action) {
  let newState = {
    ...state,
    currentAction: {},
  };
  let queue = newState.queue.slice(0); // clone array before modifying it
  const actionToModify = action.payload;
  switch (action.type) {
    case actions.REQUEST:
      // Queue all requests
      if (actionToModify.data.method === 'POST' && actionToModify.action.includes('SAVE')) {
        // Map only POST requests
        let jsonBody = JSON.parse(actionToModify.data.body);
        if (Object.prototype.hasOwnProperty.call(action.payload, 'isConnected')) {
          const jsonBodyId = jsonBody.ID;
          const { isConnected } = actionToModify;
          delete actionToModify.isConnected;
          if (isConnected) {
            // Phone its in ONLINE mode
            // REMOVE ALL AUTOGENERATED IDS FROM JSON
            Object.keys(jsonBody).forEach((key) => {
              const value = jsonBody[key];
              const valueType = Object.prototype.toString.call(value);
              if (valueType === '[object Array]' || Object.prototype.hasOwnProperty.call(value, 'values')) {
                let collectionHasValues; let
                  mappedValue;
                // "contact_" like field
                if (valueType === '[object Array]') {
                  collectionHasValues = (
                    value.length > 0
                    && Object.prototype.toString.call(value[0]) === '[object Object]'
                    && Object.prototype.hasOwnProperty.call(value[0], 'value')
                  );
                  mappedValue = value;
                } else if (Object.prototype.hasOwnProperty.call(value, 'values')) {
                  // { value: '' } array field
                  collectionHasValues = (
                    value.values.length > 0
                    && Object.prototype.toString.call(value.values[0]) === '[object Object]'
                    && Object.prototype.hasOwnProperty.call(value.values[0], 'value')
                  );
                  mappedValue = value.values;
                }
                if (collectionHasValues) {
                  // Remove only AutogeneratedIDs of objects
                  mappedValue = mappedValue.map((object) => {
                    const copyObject = { ...object };
                    if (copyObject.key && /^([a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})$/.test(copyObject.key)) {
                      delete copyObject.key;
                    }
                    return copyObject;
                  });
                  if (valueType === '[object Array]') {
                    jsonBody = {
                      ...jsonBody,
                      [key]: mappedValue,
                    };
                  } else if (Object.prototype.hasOwnProperty.call(value, 'values')) {
                    jsonBody = {
                      ...jsonBody,
                      [key]: {
                        values: mappedValue,
                      },
                    };
                  }
                }
              } else {
                jsonBody = {
                  ...jsonBody,
                  [key]: value,
                };
              }
            });
          } else if (jsonBodyId) {
            // OFFLINE PUT ( Numeric ID / Autogenerated ID ) search it in queue and merge it (if exist)
            // ADD AUTOGENERATED IDS TO { key: null, value: 'any' } OBJECTS
            Object.keys(jsonBody).forEach((key) => {
              const value = jsonBody[key];
              const valueType = Object.prototype.toString.call(value);
              if (valueType === '[object Array]' || Object.prototype.hasOwnProperty.call(value, 'values')) {
                let collectionHasValues; let
                  mappedValue;
                // "contact_" like field
                if (valueType === '[object Array]') {
                  collectionHasValues = (
                    value.length > 0
                    && Object.prototype.toString.call(value[0]) === '[object Object]'
                    && Object.prototype.hasOwnProperty.call(value[0], 'value')
                  );
                  mappedValue = value;
                } else if (Object.prototype.hasOwnProperty.call(value, 'values')) {
                  // { key: '', value: '' } array field
                  collectionHasValues = (
                    value.values.length > 0
                    && Object.prototype.toString.call(value.values[0]) === '[object Object]'
                    && Object.prototype.hasOwnProperty.call(value.values[0], 'value')
                  );
                  mappedValue = value.values;
                }
                if (collectionHasValues) {
                  // Add AutogeneratedID to new objects
                  mappedValue = mappedValue.map((object) => {
                    if (!object.key) {
                      let existingKeyInCollection; let
                        temporalKey;
                      do {
                        // Generate key
                        temporalKey = generateLocalID();
                        // Check if generated key exist in collection
                        /* eslint-disable */
                        existingKeyInCollection = mappedValue.findIndex(objectItem => objectItem.key === temporalKey);
                        /* eslint-enable */
                        // If ID exist, generate another one
                      } while (existingKeyInCollection > -1);
                      return {
                        ...object,
                        key: temporalKey,
                      };
                    }
                    return object;
                  });
                  if (valueType === '[object Array]') {
                    jsonBody = {
                      ...jsonBody,
                      [key]: mappedValue,
                    };
                  } else if (Object.prototype.hasOwnProperty.call(value, 'values')) {
                    jsonBody = {
                      ...jsonBody,
                      [key]: {
                        values: mappedValue,
                      },
                    };
                  }
                }
              } else {
                jsonBody = {
                  ...jsonBody,
                  [key]: value,
                };
              }
            });
            const requestIndex = queue.findIndex((request) => {
              let jsonParseBody;
              if (request.data.body) {
                jsonParseBody = JSON.parse(request.data.body);
              }
              return (actionToModify.url === request.url && actionToModify.action === request.action && jsonParseBody && jsonParseBody.ID === jsonBodyId);
            });
            if (requestIndex > -1) {
              let requestFromQueue = queue[requestIndex];
              const oldRequestBody = JSON.parse(requestFromQueue.data.body);
              let newRequestBody = {
                ...oldRequestBody,
              };
              // MERGE REQUEST BODY CHANGES (MERGE FIELDS OF TYPE COLLECTION AND OTHERS)
              Object.keys(jsonBody).forEach((key) => {
                const value = jsonBody[key];
                const valueType = Object.prototype.toString.call(value);
                if (valueType === '[object Array]' || Object.prototype.hasOwnProperty.call(value, 'values')) {
                  let collection; let
                    oldCollection;
                  if (valueType === '[object Array]') {
                    collection = value;
                    oldCollection = (oldRequestBody[key]) ? [...oldRequestBody[key]] : [];
                  } else if (Object.prototype.hasOwnProperty.call(value, 'values')) {
                    collection = value.values;
                    oldCollection = (oldRequestBody[key]) ? [...oldRequestBody[key].values] : [];
                  }
                  // compare newCollection with oldCollection and merge differences.
                  collection.forEach((object) => {
                    // search object in oldRequestBody
                    if (valueType === '[object Array]') {
                      // 'contact_' like field
                      const findObjectInOldRequestIndex = oldCollection.findIndex(oldObject => (object.key === oldObject.key));
                      if (findObjectInOldRequestIndex > -1) {
                        if (Object.prototype.hasOwnProperty.call(object, 'delete')) {
                          if (/^([a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})$/.test(object.key)
                          ) {
                            // if object have autogenerated id and 'delete' property, remove the object
                            oldCollection.splice(findObjectInOldRequestIndex, 1);
                          } else {
                            oldCollection[findObjectInOldRequestIndex] = {
                              ...object,
                            };
                          }
                        } else {
                          // update the object
                          oldCollection[findObjectInOldRequestIndex] = {
                            ...object,
                          };
                        }
                      } else {
                        // add the object
                        oldCollection.push({
                          ...object,
                        });
                      }
                    } else if (Object.prototype.hasOwnProperty.call(value, 'values')) {
                      // { key: '', value: '' } like field
                      const findObjectInOldRequestIndex = oldCollection.findIndex(oldObject => (object.value === oldObject.value));
                      if (findObjectInOldRequestIndex > -1) {
                        if (Object.prototype.hasOwnProperty.call(object, 'delete')) {
                          oldCollection.splice(findObjectInOldRequestIndex, 1);
                        } else {
                          // update the object
                          oldCollection[findObjectInOldRequestIndex] = {
                            ...object,
                          };
                        }
                      } else {
                        // add the object
                        oldCollection.push({
                          ...object,
                        });
                      }
                    }
                  });
                  if (valueType === '[object Array]') {
                    newRequestBody = {
                      ...newRequestBody,
                      [key]: oldCollection,
                    };
                  } else if (Object.prototype.hasOwnProperty.call(value, 'values')) {
                    newRequestBody = {
                      ...newRequestBody,
                      [key]: {
                        values: oldCollection,
                      },
                    };
                  }
                } else {
                  newRequestBody = {
                    ...newRequestBody,
                    [key]: value,
                  };
                }
              });
              // FILTER DELETED VALUES WITH AUTOGENERATED IDS
              Object.keys(newRequestBody).forEach((key) => {
                const value = newRequestBody[key];
                const valueType = Object.prototype.toString.call(value);
                if (valueType === '[object Array]' || Object.prototype.hasOwnProperty.call(value, 'values')) {
                  let collectionHasValues; let valueList;
                  // "contact_" like field
                  if (valueType === '[object Array]') {
                    collectionHasValues = (
                      value.length > 0
                      && Object.prototype.toString.call(value[0]) === '[object Object]'
                      && Object.prototype.hasOwnProperty.call(value[0], 'key')
                    );
                    valueList = value;
                  } else if (Object.prototype.hasOwnProperty.call(value, 'values')) {
                    // { key: '', value: '' } array field
                    collectionHasValues = (
                      value.values.length > 0
                      && Object.prototype.toString.call(value.values[0]) === '[object Object]'
                      && Object.prototype.hasOwnProperty.call(value.values[0], 'value')
                    );
                    valueList = value.values;
                  }
                  if (collectionHasValues) {
                    // Filter objects like { delete: true, key: 'AutogeneratedUID' }
                    valueList = [...valueList.filter(element => !(element.delete && (/^([a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})$/.test(element.key))))];
                    if (valueType === '[object Array]') {
                      newRequestBody = {
                        ...newRequestBody,
                        [key]: valueList,
                      };
                    } else if (Object.prototype.hasOwnProperty.call(value, 'values')) {
                      newRequestBody = {
                        ...newRequestBody,
                        [key]: {
                          values: valueList,
                        },
                      };
                    }
                  }
                } else {
                  newRequestBody = {
                    ...newRequestBody,
                    [key]: value,
                  };
                }
              });
              requestFromQueue = {
                ...requestFromQueue,
                data: {
                  ...requestFromQueue.data,
                  body: JSON.stringify(newRequestBody),
                },
              };
              queue[requestIndex] = {
                ...requestFromQueue,
              };
              // RETURN ONLY ENTITY CHANGES
              newState = {
                ...newState,
                queue: [...queue],
                currentAction: {
                  ...requestFromQueue,
                  data: {
                    ...requestFromQueue.data,
                    body: JSON.stringify(jsonBody),
                  },
                },
              };
              return newState;
            }
          } else {
            // OFFLINE POST (New entity, add autogenerated ID)
            let existingIdInQueue; let
              newID;
            do {
              // Generate ID
              /* eslint-disable */
              newID = generateLocalID();
              // Check if generated ID exist in queue
              existingIdInQueue = queue.findIndex(request => (request.data.method === 'POST' && JSON.parse(request.data.body).ID && JSON.parse(request.data.body).ID === newID));
              /* eslint-enable */
              // If ID exist, generate another one
            } while (existingIdInQueue > -1);
            // if not, use it
            jsonBody = {
              ...jsonBody,
              ID: newID,
            };
            // Add AutogeneratedId to { key: null, value: 'any' } objects
            Object.keys(jsonBody).forEach((key) => {
              const value = jsonBody[key];
              const valueType = Object.prototype.toString.call(value);
              if (valueType === '[object Array]' || Object.prototype.hasOwnProperty.call(value, 'values')) {
                let collectionHasValues; let
                  mappedValue;
                // "contact_" like field
                if (valueType === '[object Array]') {
                  collectionHasValues = (
                    value.length > 0
                    && Object.prototype.toString.call(value[0]) === '[object Object]'
                    // Object.prototype.hasOwnProperty.call(value[0], 'key') &&
                    && Object.prototype.hasOwnProperty.call(value[0], 'value')
                  );
                  mappedValue = value;
                } else if (Object.prototype.hasOwnProperty.call(value, 'values')) {
                  // { key: '', value: '' } array field
                  collectionHasValues = (
                    value.values.length > 0
                    && Object.prototype.toString.call(value.values[0]) === '[object Object]'
                    && Object.prototype.hasOwnProperty.call(value.values[0], 'value')
                  );
                  mappedValue = value.values;
                }
                if (collectionHasValues) {
                  // Add AutogeneratedID to new objects
                  mappedValue = mappedValue.map((object) => {
                    if (!object.key) {
                      let existingKeyInCollection; let
                        temporalKey;
                      do {
                        // Generate key
                        temporalKey = generateLocalID();
                        // Check if generated key exist in collection
                        /* eslint-disable */
                        existingKeyInCollection = mappedValue.findIndex(objectItem => objectItem.key === temporalKey);
                        /* eslint-enable */
                        // If ID exist, generate another one
                      } while (existingKeyInCollection > -1);
                      return {
                        key: temporalKey,
                        value: object.value,
                      };
                    }
                    return object;
                  });
                  if (valueType === '[object Array]') {
                    jsonBody = {
                      ...jsonBody,
                      [key]: mappedValue,
                    };
                  } else if (Object.prototype.hasOwnProperty.call(value, 'values')) {
                    jsonBody = {
                      ...jsonBody,
                      [key]: {
                        values: mappedValue,
                      },
                    };
                  }
                }
              } else {
                jsonBody = {
                  ...jsonBody,
                  [key]: value,
                };
              }
            });
          }
        }
        actionToModify.data.body = JSON.stringify(jsonBody);
      } else if (actionToModify.data.method === 'GET') {
        // filter out redundant GET requests
        queue = queue.filter(existing => existing.url !== actionToModify.url);
      }
      newState = {
        ...newState,
        queue: [...queue, actionToModify],
        currentAction: actionToModify,
      };
      return newState;
    case actions.RESPONSE:
      // loop through every item in local storage and filter out the successful request
      /* eslint-disable */
      let newQueue;
      /* eslint-enable */
      if (action.payload.data.method === 'POST') {
        newQueue = queue.filter(request => (request.action !== action.payload.action && request.url !== action.payload.url && request.data.method !== action.payload.data.method && request.data.body && JSON.parse(request.data.body).ID !== JSON.parse(action.payload.data.body).ID));
      } else {
        newQueue = queue.filter(request => (request.action !== action.payload.action && request.url !== action.payload.url && request.data.method !== action.payload.data.method));
      }
      newState = {
        ...newState,
        queue: [...newQueue],
      };
      return newState;
    default:
      return newState;
  }
}
