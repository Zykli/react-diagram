import { useEffect, useRef } from "react";

/**
 * fn is call only when inputs change, not call on did mount
 * @param fn 
 * @param inputs 
 */
export function useDidUpdateEffect(fn: () => void, inputs: any[]) {
    const didMountRef = useRef(false);
    useEffect(() => {
      if (didMountRef.current) {
        return fn();
      }
      didMountRef.current = true;
    }, inputs);
  }