
export const ActionLifecycleStatus ={
  Started :'started',
  Resolved : 'resolved',
  Rejected :'rejected',
}

function isPromise(payload) {
  return !!payload && typeof payload.then === 'function';
}

function handlePromise(dispatch, action) {
  const { type, payload, props } = action;

  const { effects } = payload;

  dispatch({
    type,
    status: ActionLifecycleStatus.Started,
  });

  const success = (resolvedData) => {
    effects && effects.success && effects.success(resolvedData);
    effects && effects.finish && effects.finish(resolvedData);

    dispatch({
      type,
      payload: resolvedData,
      status: ActionLifecycleStatus.Resolved,
      props,
    });
  };

  const failure = (rejectedData) => {
    effects && effects.failure && effects.failure(rejectedData);
    effects && effects.finish && effects.finish(rejectedData);

    dispatch({
      type,
      payload: rejectedData,
      status: ActionLifecycleStatus.Rejected,
      props,
    });
  };

  return payload.then(success, failure);
}


function middleware(store) {
  return next => {
    return (action) => {
      if (isPromise(action.payload)) {
        return handlePromise(store.dispatch, action);
      }

      return next(action);
    };
  };
}

export default middleware;
