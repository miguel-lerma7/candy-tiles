const hexColors: { [key: string]: string } = {
	'Red': 'bg-[#ff2445]',
	'Orange': 'bg-[#ff670f]',
	'Yellow': 'bg-[#ffbf0f]',
	'Green': 'bg-[#16f74f]',
	'Blue': 'bg-[#1670f7]',
	'Purple': 'bg-[#7b16f7]',
	'White': 'bg-[#fff]',
};

type fxColors = 'Red' | 'Orange' | 'Yellow' | 'Green' | 'Blue' | 'Purple' | 'White';

type CandyPopFXProps = {
	color: fxColors;
	maskSrc: string;
};

const LevelItemFX = ({ color, maskSrc }: CandyPopFXProps) => {
	return (
		<span
			className={`block absolute top-0 left-0 right-0 bottom-0 animate-[candyPopFX_0.3s] opacity-[0] scale-0 ${hexColors[color]}`}
			style={{
				WebkitMaskImage: `url(${maskSrc})`,
				maskImage: `url(${maskSrc})`,
				WebkitMaskSize: 'cover',
				maskSize: 'cover',
			}}
		></span>
	);
};

export default LevelItemFX;
