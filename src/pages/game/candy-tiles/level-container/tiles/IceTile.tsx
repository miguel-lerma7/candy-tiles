import { useState } from 'react';
import { TileProps } from './Tile';
import iceCrack1SFX from './../../../../../assets/audio/iceCrack1.mp3';
import iceCrack2SFX from './../../../../../assets/audio/iceCrack2.mp3';
import useEffectAfterFirstRender from '../../../../../hooks/useEffectAfterFirstRender';
import { useRecoilValue, useRecoilState } from 'recoil';
import { matchListState } from '../../../../../recoil/atoms/matchList';
import { levelTilesState } from '../../../../../recoil/atoms/levelTiles';
import iceTileSprite from './../../../../../assets/img/tiles/ice.png';

const iceCrack1Sound = new Audio(iceCrack1SFX);
const iceCrack2Sound = new Audio(iceCrack2SFX);

const IceTile = ({ index }: TileProps) => {
	const [damaged, setDamaged] = useState(false);
	const matchList = useRecoilValue(matchListState);
	const [levelTiles, setLevelTiles] = useRecoilState(levelTilesState);

	useEffectAfterFirstRender(() => {
		checkMatchInTile();
	}, [matchList]);

	const checkMatchInTile = () => {
		const matched = !!matchList.find(x => x.index === index)?.matched;
		if (!matched) return;

		if (!damaged) {
			iceCrack1Sound.play();
			setDamaged(true);
			return;
		}

		iceCrack2Sound.play();
		const newTiles = structuredClone(levelTiles) as LevelTile[];
		newTiles[index] = { type: 'Normal' };
		setLevelTiles(newTiles);
	};

	return (
		<div className='relative bg-black/25 m-[2%] hover:invert duration-200 select-none rounded' data-index={index} data-tile>
			<img
				src={iceTileSprite}
				className='pointer-events-none'
				style={{
					opacity: damaged ? 0.6 : 1,
				}}
			></img>
			<span className='absolute bottom-0 right-0 text-[12px] text-black font-bold'>{index}</span>
		</div>
	);
};

export default IceTile;
