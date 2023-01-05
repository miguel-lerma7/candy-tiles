import { useRef } from 'react';
import iceCreamSprite from './../../../../../assets/candies/ice-cream.png';

type IceCreamProps = {
	id: string;
	index: number;
};
const IceCream = ({id, index}:IceCreamProps) => {
	const elementRef = useRef<HTMLImageElement | null>(null);

	return (
		<img
			data-ice-cream
			ref={elementRef}
			src={iceCreamSprite}
			className='block w-full h-full m-0 select-none pointer-events-none duration-200'
		></img>
	);
};

export default IceCream;
