import { TbHandMove } from 'react-icons/tb';

const MoveCounter = () => {
	return (
		<div className="bg-purple rounded-lg p-[12px] w-full">
			<h3 className="text-light-blue font-LilyScriptOne font-medium block w-full text-center text-[20px] italic flex items-center gap-x-[8px] justify-center">
				<TbHandMove></TbHandMove>
				Moves
			</h3>
			<span className="text-white block text-center w-full font-LilyScriptOne font-black text-[22px]">15/20</span>
		</div>
	);
};

export default MoveCounter;
