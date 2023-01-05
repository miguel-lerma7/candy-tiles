import candyHexColors from '../../../../../data/candy-hex-colors';

type fxColors = 'Red' | 'Orange' | 'Yellow' | 'Green' | 'Blue' | 'Purple' | 'White';

type CandyPopFXProps = {
	color: fxColors;
	maskSrc: string;
};

const LevelItemFX = ({ color, maskSrc }: CandyPopFXProps) => {
	return (
		<span
			className='block absolute top-0 left-0 right-0 bottom-0 animate-[candyPopFX_0.3s] opacity-[0] scale-0'
			style={{
				WebkitMaskImage: `url(${maskSrc})`,
				maskImage: `url(${maskSrc})`,
				WebkitMaskSize: 'cover',
				maskSize: 'cover',
				backgroundColor: candyHexColors[color],
			}}
		></span>
	);
};

export default LevelItemFX;
