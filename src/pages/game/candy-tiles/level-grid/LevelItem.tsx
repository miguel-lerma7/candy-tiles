import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ANIMATION_TIME_MS, COLUMN_NUMBER } from '../../../../config';
import { getItemColumnIndex, getItemRowIndex } from '../../../../game-algorithms/tile-matching';
import { levelItemsState } from '../../../../recoil/atoms/levelItems';
import { renderedLevelItemsState } from '../../../../recoil/atoms/renderedLevelItems';
import Candy from './level-items/Candy';
import Chocolate from './level-items/Chocolate';
import SuperCandy from './level-items/SuperCandy';
import levelManager from './level-manager';

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

	const levelItemKeyRef = useRef<string | null>(null);

	const elementRef = useRef<HTMLDivElement | null>(null);
	const rowIndexRef = useRef<number>(0);
	const columnIndexRef = useRef<number>(0);
	const positionXRef = useRef<number>(0);
	const positionYRef = useRef<number>(0);

	useEffect(() => {
		setItemKey(levelManager.levelData.items[itemIndex]?.key);
		setItem(levelManager.levelData.items[itemIndex]);
		updatePosition();
	}, []);

	useEffect(() => {
		if (levelItemKeyRef.current !== null) {
			return;
		}

		levelItemKeyRef.current = levelItems[itemIndex]?.key || null;
	}, [levelItems]);

	const onLevelItemsChanged = (): void => {
		const itemMatched = !levelManager.levelData.items.some(x => x?.key === itemKey);
		//console.log(itemMatched);

		if (itemMatched || !itemKey) return;

		setItemIndex(getItemIndex());
		updatePosition();
	};

	const onItemsRerender = (): void => {
		setItemKey(levelManager.levelData.items[itemIndex]?.key);
		setItem(levelManager.levelData.items[itemIndex]);
		//console.log(levelManager.levelData.items);
	};

	const updateGridPosition = (updateX: boolean = true, updateY: boolean = true): void => {
		const gridIndex = getItemIndex();
		//console.log(`${(item as Candy)?.color || ''} - ${gridIndex}`);

		rowIndexRef.current = getItemRowIndex(gridIndex);
		columnIndexRef.current = getItemColumnIndex(gridIndex);

		updateX && (positionXRef.current = 100 * (columnIndexRef.current - 1));
		updateY && (positionYRef.current = 100 * (rowIndexRef.current - 1));
	};

	const updatePosition = (): void => {
		updateGridPosition();
		if (elementRef.current) {
			elementRef.current.style.transform = `translate(${positionXRef.current}%, ${positionYRef.current}%)`;
		}
	};

	const getItemIndex = (): number => levelItems.findIndex(x => x?.key === levelItemKeyRef.current);

	updateGridPosition();

	return !!itemKey ? (
		<div
			className={`p-[1.7%] aspect-square block absolute`}
			style={{
				width: `calc(100%/${COLUMN_NUMBER})`,
				transform: `translate(${positionXRef.current}%, ${positionYRef.current}%)`,
				transitionDuration: `${ANIMATION_TIME_MS}ms`,
			}}
			ref={elementRef}
		>
			{getItemComponent(item, itemKey || '', itemIndex)}
		</div>
	) : (
		<></>
	);
};

export default LevelItem;
