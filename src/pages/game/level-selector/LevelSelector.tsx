import { useState } from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';

const LevelSelector = () => {
	const [visible, setVisible] = useState<boolean>(false);

	const toggleVisibility = (): void => setVisible(!visible);

	return (
		<div className={`flex bg-black/25 rounded-lg shadow-lg duration-200 ml-auto overflow-hidden ${visible ? 'w-[300px]' : 'w-[34px]'}`}>
			<button
				className='bg-blue hover:bg-purple font-Raleway rounded-tr-lg rounded-br-lg font-bold h-full w-min  duration-200 ml-auto px-[5px]'
				onClick={toggleVisibility}
			>
				<MdKeyboardArrowRight
					className={`block text-white duration-200 ${visible ? 'rotate-180' : 'rotate-0'}`}
					size={'24px'}
				></MdKeyboardArrowRight>
			</button>
		</div>
	);
};

export default LevelSelector;
