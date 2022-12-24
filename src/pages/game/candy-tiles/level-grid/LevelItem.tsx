import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { ANIMATION_TIME_SECONS, COLUMN_NUMBER } from '../../../../config';
import { getItemColumnIndex, getItemRowIndex } from '../../../../game-algorithms/tile-matching';
import useEffectAfterFirstRender from '../../../../hooks/useEffectAfterFirstRender';
import { levelItemsState } from '../../../../recoil/atoms/levelItems';
import { renderedLevelItemsState } from '../../../../recoil/atoms/renderedLevelItems';
import Candy from './level-items/Candy';
import Chocolate from './level-items/Chocolate';
import SuperCandy from './level-items/SuperCandy';
import gsap from 'gsap';

type ItemPosition = {
	x: number;
	y: number;
};

type LevelItemProps = {
	initialIndex: number;
};

const getItemComponent = (item: LevelItem | null, itemIndex: number): JSX.Element => {
	const id = item?.key || '';
	switch (item?.type) {
		case 'Candy':
			return <Candy color={item.color} initialIndex={itemIndex} id={id}></Candy>;

		case 'SuperCandy':
			return <SuperCandy color={item.color} initialIndex={itemIndex} id={id} key={id}></SuperCandy>;

		case 'Chocolate':
			return <Chocolate initialIndex={itemIndex} id={id} key={id}></Chocolate>;

		default:
			return <div></div>;
	}
};

const animateItemSpawn = (element: HTMLElement, index: number): void => {
	gsap.fromTo(
		element,
		{
			x: 0,
			y: 0,
			xPercent: 100 * (getItemColumnIndex(index) - 1),
			yPercent: getItemRowIndex(index) - 100,
		},
		{
			yPercent: 100 * (getItemRowIndex(index) - 1),
			duration: 0.75,
			ease: 'bounce.out',
		}
	);
};

const resetItemTransform = (element: HTMLElement, index: number): void => {
	gsap.fromTo(
		element,
		{},
		{
			xPercent: 100 * (getItemColumnIndex(index) - 1),
			yPercent: 100 * (getItemRowIndex(index) - 1),
			duration: 0,
			overwrite: true,
		}
	);
};

const animatePositionChange = (element: HTMLElement, position: ItemPosition): void => {
	gsap.to(element, {
		xPercent: position.x,
		yPercent: position.y,
		duration: ANIMATION_TIME_SECONS,
		ease: 'back.out(1.5)',
	});
};

const LevelItem = ({ initialIndex }: LevelItemProps) => {
	const levelItems = useRecoilValue(levelItemsState);
	const renderedLevelItem = useRecoilValue(renderedLevelItemsState(initialIndex));

	const [levelItemTarget, setLevelItemTarget] = useState<LevelItem | null>(levelItems[initialIndex]);

	const elementRef = useRef<HTMLDivElement | null>(null);
	const rowIndexRef = useRef<number>(0);
	const columnIndexRef = useRef<number>(0);
	const positionRef = useRef<ItemPosition>({ x: 0, y: 0 });

	useEffect(() => {
		animateItemSpawn(elementRef.current as HTMLElement, initialIndex);
	}, []);

	useEffectAfterFirstRender(() => {
		updatePosition();
	}, [levelItems]);

	useEffectAfterFirstRender(() => {
		resetItemTransform(elementRef.current as HTMLElement, initialIndex);
		setLevelItemTarget(renderedLevelItem);
	}, [renderedLevelItem]);

	const updateGridPosition = (): void => {
		const gridIndex = getItemIndex();
		const emptyTarget = gridIndex < 0;

		rowIndexRef.current = getItemRowIndex(emptyTarget ? initialIndex : gridIndex);
		columnIndexRef.current = getItemColumnIndex(emptyTarget ? initialIndex : gridIndex);

		positionRef.current.x = 100 * (columnIndexRef.current - 1);
		positionRef.current.y = 100 * (rowIndexRef.current - 1);
	};

	const updatePosition = () => {
		updateGridPosition();
		const emptyTarget = getItemIndex() < 0;
		!emptyTarget && animatePositionChange(elementRef.current as HTMLElement, positionRef.current);
	};

	const getItemIndex = (): number => levelItems.findIndex(x => x?.key === levelItemTarget?.key);

	return (
		<div
			className={`p-[1.7%] aspect-square block absolute`}
			style={{
				width: `calc(100%/${COLUMN_NUMBER})`,
				animationDuration: 'none',
			}}
			ref={elementRef}
		>
			{levelItemTarget !== null ? getItemComponent(levelItemTarget, getItemIndex()) : <></>}
		</div>
	);
};

export default LevelItem;
