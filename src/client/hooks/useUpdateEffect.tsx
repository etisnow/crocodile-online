import { useEffect, useRef } from "react";

export const useUpdateEffect = (effect: any, deps: any) => {
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            return effect();
        }
    }, deps);
}