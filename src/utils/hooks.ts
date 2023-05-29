import { useCallback, useEffect, useRef, useState } from "react";
import { initialZoom } from "../contexts/zoom";

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
};

type InitialOptions = {
  initialWidth?: number;
  initialHeight?: number;
};

/**
 * return sizes by ref element 
 * @param element - HTML element | null
 * @param param1 - initial options object like { initialWidth?: number; initialHeight?: number; }
 * @returns [ width, height ]
 */
export const useRefResize = (
  element: HTMLElement | null,
  {
    initialWidth,
    initialHeight
  }: InitialOptions
) => {

  const inFullScreenRef = useRef(false);

  const [ sizes, setSizes ] = useState({
    width: initialWidth || document.body.clientWidth,
    heigth: initialHeight || document.body.clientHeight
  });
  const sizesRef = useRef(sizes);
  useEffect(() => {
    sizesRef.current = sizes;
  }, [sizes]);

  const onRezise = useCallback(() => {
    inFullScreenRef.current = document.fullscreenElement === element;
    const width = element?.clientWidth || document.body.clientWidth;
    const heigth = (!inFullScreenRef.current ? initialHeight : element?.clientHeight) || document.body.clientHeight;
    if(sizesRef.current.width !== width || sizesRef.current.heigth !== heigth) {
      setSizes({
        width,
        heigth
      });
    };
  }, [element]);

  useEffect(() => {
    onRezise();
    window.addEventListener('resize', onRezise);
    return () => {
      window.removeEventListener('resize', onRezise);
    };
  }, [onRezise]);

  return [sizes.width, sizes.heigth];
};