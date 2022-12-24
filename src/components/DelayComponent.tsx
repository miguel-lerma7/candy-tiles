import { useEffect, useState } from 'react';

type DelayProps = {
	children: JSX.Element;
	delayMs: number;
};

const DelayComponent = ({ children, delayMs }: DelayProps) => {
	const [show, setShow] = useState(false);

	useEffect(() => {
		setTimeout(() => setShow(true), delayMs);
	}, []);

	return show ? children : <></>;
};

export default DelayComponent;
