import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ANIMATION_TIME_MS, COLUMN_NUMBER } from '../../../../config';
import { getItemColumnIndex, getItemRowIndex } from '../../../../game-algorithms/tile-matching';
import useEffectAfterFirstRender from '../../../../hooks/useEffectAfterFirstRender';
import { levelItemsState } from '../../../../recoil/atoms/levelItems';
import { renderedLevelItemsState } from '../../../../recoil/atoms/renderedLevelItems';
import Candy from './level-items/Candy';
import Chocolate from './level-items/Chocolate';
import SuperCandy from './level-items/SuperCandy';
import levelManager from './level-manager';
import gsap from 'gsap';

type LevelItemProps = {
	initialIndex: number;
};

const getItemComponent = (item: LevelItem, id: string, itemIndex: number): JSX.Element => {
	switch (item?.type) {
		case 'Candy':
			return <Candy color={item.color} initialIndex={itemIndex} id={id}></Candy>;

		case 'SuperCandy':
			return <SuperCandy color={item.color} initialIndex={itemIndex} id={id}></SuperCandy>;

		case 'Chocolate':
			return <Chocolate initialIndex={itemIndex} id={id}></Chocolate>;

		default:
			return <div></div>;
	}
};

const LevelItem = ({ initialIndex }: LevelItemProps) => {
	const [itemIndex, setItemIndex] = useState(initialIndex);
	const [itemKey, setItemKey] = useState<null | string>();
	const [item, setItem] = useRecoilState(renderedLevelItemsState(itemIndex));
	const levelItems = useRecoilValue(levelItemsState);
	const renderedLevelItem = useRecoilValue(renderedLevelItemsState(initialIndex));

	const levelItemKeyRef = useRef<string | null>(null);

	const elementRef = useRef<HTMLDivElement | null>(null);
	const rowIndexRef = useRef<number>(0);
	const columnIndexRef = useRef<number>(0);
	const positionXRef = useRef<number>(0);
	const positionYRef = useRef<number>(0);

	useEffect(() => {
		setItemKey(levelManager.levelData.items[itemIndex]?.key);
		setItem(levelManager.levelData.items[itemIndex]);

		gsap.fromTo(
			elementRef.current,
			{
				x: 0,
				y: 0,
				xPercent: 100 * (getItemColumnIndex(initialIndex) - 1),
				yPercent: getItemRowIndex(initialIndex) - 100,
			},
			{
				yPercent: 100 * (getItemRowIndex(initialIndex) - 1),
				duration: ANIMATION_TIME_MS / 1000,
				ease: 'bounce.out',
			}
		);
	}, []);

	useEffect(() => {
		initialIndex === 11 && console.log('level items EFFECT');

		if (levelItemKeyRef.current !== null) {
			return;
		}

		levelItemKeyRef.current = levelItems[itemIndex]?.key || null;
	}, [levelItems]);

	useEffectAfterFirstRender(() => {
		initialIndex === 11 && console.log('rendered level items EFFECT');

		const levelItemMatched = renderedLevelItem === null;
		levelItemKeyRef.current = levelItems[initialIndex]?.key || null;
		resetPosition();
		/* if (levelItemMatched) {
			console.log(initialIndex);
			console.log(structuredClone(renderedLevelItem));
      
		} */
	}, [renderedLevelItem]);

	const updateGridPosition = (updateX: boolean = true, updateY: boolean = true): void => {
		const gridIndex = getItemIndex();
		//console.log(`${(item as Candy)?.color || ''} - ${gridIndex}`);

		rowIndexRef.current = getItemRowIndex(gridIndex);
		columnIndexRef.current = getItemColumnIndex(gridIndex);

		updateX && (positionXRef.current = 100 * (columnIndexRef.current - 1));
		updateY && (positionYRef.current = 100 * (rowIndexRef.current - 1));
	};

	const updatePosition = (): void => {
		//if (levelItems[initialIndex]?.key === levelItemKeyRef.current) return;
		initialIndex === 11 && console.log('POSITION UPDATE');

		updateGridPosition();
		if (elementRef.current) {
			elementRef.current.style.transform = `translate(${positionXRef.current}%, ${positionYRef.current}%)`;
		}
	};

	const resetPosition = (): void => {
		updateGridPosition();
		if (elementRef.current) {
			elementRef.current.style.transform = `translate(${positionXRef.current}%, ${positionYRef.current}%)`;
		}
	};

	const getItemIndex = (): number => levelItems.findIndex(x => x?.key === levelItemKeyRef.current);

	updateGridPosition();

	return (
		<div
			className={`p-[1.7%] aspect-square block absolute`}
			style={{
				width: `calc(100%/${COLUMN_NUMBER})`,
				transform: `translateX(${positionXRef.current}%)`,
				animationDuration: 'none',
			}}
			ref={elementRef}
		>
			{getItemComponent(item, itemKey || '', itemIndex)}
		</div>
	);
};

export default LevelItem;
