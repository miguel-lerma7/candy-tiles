import { useEffect, useRef } from 'react';

export default (effect: React.EffectCallback, deps?: React.DependencyList | undefined) => {
	const firstRender = useRef(true);

	useEffect(() => {
		!firstRender.current && effect();
		firstRender.current = false;
	}, deps);
};
