import { COLUMN_NUMBER, ROW_NUMBER } from '../../../../../config';

type ScoreFXProps = {
	score: number;
	color: string;
	position: [number, number];
};

const ScoreFX = ({ score, color, position }: ScoreFXProps) => {
	return (
		<div
			className='absolute flex'
			style={{
				transform: `translate(${position[0]}%, ${position[1]}%)`,
				width: `calc(100%/${COLUMN_NUMBER})`,
				height: `calc(100%/${ROW_NUMBER})`,
			}}
		>
			<span className='text-white font-[18px] font-bold text-center m-auto'>{score}</span>
		</div>
	);
};

export default ScoreFX;
