import { useEffect, useRef } from "react";

export default (effect: React.EffectCallback, deps?: React.DependencyList | undefined) => {
  const effectCount = useRef(0);

  useEffect(() => {
    effectCount.current += 1;
    effectCount.current > 2 && effect();
  }, deps)
}