import { AiFillStar } from 'react-icons/ai';

const starLine =
	'before:content-[""] before:absolute before:block before:h-[2px] before:w-[15px] before:bg-white/30 before:right-[110%] before:top-[40%]';

const ScorePanel = () => {
	return (
		<div className="min-w-[250px] h-[80%] bg-black/25 rounded-lg p-[16px]">
			<h3 className="text-neu-2 white font-System font-semibold block w-full text-center text-[22px]">Score</h3>
			<span className="text-neu-3 block text-center w-full text-[18px]">59</span>

			<h3 className="text-neu-2 font-System font-semibold block w-full text-center text-[22px]">Moves</h3>
			<span className="text-neu-3 block text-center w-full font-bold text-[18px]">15</span>

			<div className="h-[150px] w-[30px] bg-purple p-[5px] relative rounded-lg">
				<span className="bg-blue block w-full h-full scale-y-50 origin-bottom rounded-lg"></span>
				<span className={`absolute left-[115%] bottom-[20%] text-[#ffae17] ${starLine}`}>
					<AiFillStar></AiFillStar>
				</span>
				<span className={`absolute left-[115%] bottom-[50%] text-[#ffae17] ${starLine}`}>
					<AiFillStar></AiFillStar>
				</span>
				<span className={`absolute left-[115%] bottom-[80%] text-[#ffae17] ${starLine}`}>
					<AiFillStar></AiFillStar>
				</span>
			</div>
		</div>
	);
};

export default ScorePanel;
