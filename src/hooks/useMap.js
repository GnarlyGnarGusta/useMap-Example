import { useReducer, useCallback, useMemo, useRef } from "react";
import { useUpdateEffect } from "./";
import { isFunction, has as objectHas } from "lodash";

const actions = {
  clear: "clear",
  reset: "reset",
  set: "set",
  remove: "remove"
};

const mapReducer = (state, action) => {
  switch (action.type) {
    case actions.clear: {
      return {};
    }
    case actions.reset: {
      return action.data;
    }
    case actions.set: {
      return {
        ...state,
        [action.target]: action.data
      };
    }
    case actions.remove: {
      const { [action.target]: deleted, ...withoutKey } = state;
      return { ...withoutKey };
    }
    default: {
      return state;
    }
  }
};

const useMap = (init) => {
  const initRef = useRef(init);
  const [state, dispatch] = useReducer(mapReducer, initRef.current);
  const reset = useCallback(() => {
    dispatch({
      type: actions.reset,
      data: initRef.current
    });
  }, [dispatch]);

  useUpdateEffect(() => {
    initRef.current = init;
    reset();
  }, [init, reset]);

  const clear = useCallback(() => {
    dispatch({
      type: actions.clear
    });
  }, [dispatch]);

  const set = useCallback(
    (key, updater) => {
      dispatch({
        type: actions.set,
        target: key,
        data: isFunction(updater) ? updater() : updater
      });
    },
    [dispatch]
  );

  const remove = useCallback(
    (key) => {
      dispatch({
        type: actions.remove,
        target: key
      });
    },
    [dispatch]
  );

  const get = useCallback(
    (key) => {
      return state[key];
    },
    [state]
  );

  const has = useCallback(
    (key) => {
      return objectHas(state, key);
    },
    [state]
  );

  const stateSub = useMemo(() => {
    return state;
  }, [state]);

  return {
    values: stateSub,
    clear,
    reset,
    set,
    remove,
    get,
    has
  };
};

export default useMap;
