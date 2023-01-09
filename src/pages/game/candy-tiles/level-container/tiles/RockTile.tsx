import { useState } from 'react';
import { checkForAdjacentMatch } from '../../../../../game-algorithms/tile-matching';
import { TileProps } from './Tile';
import rockCrack1SFX from './../../../../../assets/audio/rockCrack1.mp3';
import rockCrack2SFX from './../../../../../assets/audio/rockCrack2.mp3';
import { useRecoilState, useRecoilValue } from 'recoil';
import { matchListState } from '../../../../../recoil/atoms/matchList';
import useEffectAfterFirstRender from '../../../../../hooks/useEffectAfterFirstRender';
import { levelTilesState } from '../../../../../recoil/atoms/levelTiles';
import rockTileSprite from './../../../../../assets/img/tiles/rock.png';

const rockCrack1Sound = new Audio(rockCrack1SFX);
const rockCrack2Sound = new Audio(rockCrack2SFX);

const RockTile = ({ index }: TileProps) => {
	const [damaged, setDamaged] = useState(false);
	const matchList = useRecoilValue(matchListState);
	const [levelTiles, setLevelTiles] = useRecoilState(levelTilesState);

	useEffectAfterFirstRender(() => {
		checkMatchInAdjacentTiles();
	}, [matchList]);

	const checkMatchInAdjacentTiles = () => {
		const matched = checkForAdjacentMatch(index, matchList);
		if (!matched) return;

		if (!damaged) {
			rockCrack1Sound.play();
			setDamaged(true);
			return;
		}

		rockCrack2Sound.play();
		const newTiles = structuredClone(levelTiles) as LevelTile[];
		newTiles[index] = { type: 'Normal' };
		setLevelTiles(newTiles);
	};

	return (
		<div className='relative bg-black/25 m-[2%] hover:invert duration-200 select-none rounded cursor-not-allowed' data-index={index}>
			<img
				src={rockTileSprite }
				className='pointer-events-none'
				style={{
					opacity: damaged ? 0.6 : 1,
				}}
			></img>
			<span className='absolute bottom-0 right-0 text-[12px] text-white/50 font-bold hidden'>{index}</span>
		</div>
	);
};

export default RockTile;
