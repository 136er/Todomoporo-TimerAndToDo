import { useRef } from "react";

type AnyFunction = (...args: any[]) => any;

/**
 * usePersistFn instead of useCallback to reduce cognitive load
 */
export function usePersistFn<T extends AnyFunction>(fn: T) {
  const callbackRef = useRef<T>(fn);
  callbackRef.current = fn;

  const stableCallbackRef = useRef<T>(null);
  if (!stableCallbackRef.current) {
    stableCallbackRef.current = function (this: unknown, ...args) {
      return callbackRef.current!.apply(this, args);
    } as T;
  }

  return stableCallbackRef.current!;
}
