import {useEffect, useMemo, useRef} from "react";
import _ from "lodash";

interface IDebounceCallback {
  callback: () => void;
}

export const useDebounce = (callback: IDebounceCallback) => {
  const ref = useRef<IDebounceCallback | undefined>(undefined);

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  return useMemo(() => {
    const func = () => {
      const cb: IDebounceCallback | undefined = ref.current;
      if (cb) cb.callback();
    };

    return _.debounce(func, 500);
  }, []);
};