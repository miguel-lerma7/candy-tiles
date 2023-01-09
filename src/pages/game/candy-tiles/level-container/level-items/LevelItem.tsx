import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { ANIMATION_TIME_MS, COLUMN_NUMBER } from '../../../../../config';
import { getItemColumnIndex, getItemRowIndex } from '../../../../../game-algorithms/tile-matching';
import useEffectAfterFirstRender from '../../../../../hooks/useEffectAfterFirstRender';
import { levelItemsState } from '../../../../../recoil/atoms/levelItems';
import Candy from './Candy';
import Chocolate from './Chocolate';
import SuperCandy from './SuperCandy';
import { liveItemsIds, removeLiveItem } from '../grids/ItemGrid';
import anime from 'animejs';
import IceCream from './IceCream';

type ItemPosition = {
	x: number;
	y: number;
};

type LevelItemProps = {
	initialIndex: number;
};

const getItemComponent = (item: LevelItem | null, index: number): JSX.Element => {
	const id = item?.key || '';
	switch (item?.type) {
		case 'Candy':
			return <Candy color={item.color} id={id} key={id} index={index}></Candy>;

		case 'SuperCandy':
			return <SuperCandy color={item.color} id={id} key={id} index={index}></SuperCandy>;

		case 'Chocolate':
			return <Chocolate id={id} key={id} index={index}></Chocolate>;

		case 'IceCream':
			return <IceCream id={id} key={id} index={index}></IceCream>;

		default:
			return <div></div>;
	}
};

const setPosition = (element: HTMLElement, index: number): void => {
	anime.remove(element);
	anime({
		targets: element,
		translateX: `${100 * (getItemColumnIndex(index) - 1)}%`,
		translateY: `${100 * (getItemRowIndex(index) - 1)}%`,
		duration: 0,
	});
};

const animatePosition = (element: HTMLElement, position: ItemPosition): void => {
	anime({
		targets: element,
		translateX: `${position.x}%`,
		translateY: `${position.y}%`,
		duration: ANIMATION_TIME_MS,
		easing: 'easeOutBack',
	});
};

const LevelItem = ({ initialIndex }: LevelItemProps) => {
	const levelItems = useRecoilValue(levelItemsState);
	const [levelItemTarget, setLevelItemTarget] = useState<LevelItem | null>(levelItems[initialIndex]);

	const elementRef = useRef<HTMLDivElement | null>(null);
	const rowIndexRef = useRef<number>(0);
	const columnIndexRef = useRef<number>(0);
	const positionRef = useRef<ItemPosition>({ x: 0, y: 0 });
	const emptyTargetRef = useRef(false);
	const currentIndexRef = useRef(initialIndex);

	useEffect(() => {
		const validItem = typeof levelItemTarget?.key === 'string';
		validItem && liveItemsIds.push(levelItemTarget?.key || '');
	}, []);

	useEffectAfterFirstRender(() => {
		updatePosition();
		emptyTargetRef.current && spawnItem();
		currentIndexRef.current = levelItems.findIndex(x => x?.key === levelItemTarget?.key);
	}, [levelItems]);

	useEffect(() => {
		if (levelItemTarget) {
			setPosition(elementRef.current as HTMLElement, getItemIndex());
		}
	}, [levelItemTarget]);

	const spawnItem = () => {
		removeLiveItem(levelItemTarget?.key || '');
		const newTarget = levelItems.filter(x => typeof x?.key === 'string').find(y => !liveItemsIds.includes(y?.key || ''));
		const newTargetIsValid = newTarget !== undefined && typeof newTarget?.key === 'string';

		if (!newTargetIsValid) return;

		liveItemsIds.push(newTarget?.key || '');
		currentIndexRef.current = levelItems.findIndex(x => x?.key === newTarget.key);
		setLevelItemTarget(newTarget);
		emptyTargetRef.current = false;
	};

	const updateGridPosition = (): void => {
		const gridIndex = getItemIndex();

		rowIndexRef.current = getItemRowIndex(emptyTargetRef.current ? initialIndex : gridIndex);
		columnIndexRef.current = getItemColumnIndex(emptyTargetRef.current ? initialIndex : gridIndex);

		positionRef.current.x = 100 * (columnIndexRef.current - 1);
		positionRef.current.y = 100 * (rowIndexRef.current - 1);
	};

	const updatePosition = () => {
		updateGridPosition();
		!emptyTargetRef.current && animatePosition(elementRef.current as HTMLElement, positionRef.current);
	};

	const getItemIndex = (): number => {
		const index = levelItems.findIndex(x => x?.key === levelItemTarget?.key);
		emptyTargetRef.current = index < 0;
		return index;
	};

	return (
		<div
			className={'p-[1.7%] aspect-square block absolute'}
			style={{
				width: `calc(100%/${COLUMN_NUMBER})`,
				animationDuration: 'none',
			}}
			ref={elementRef}
		>
			{levelItemTarget !== null ? getItemComponent(levelItemTarget, currentIndexRef.current) : <></>}
		</div>
	);
};

export default LevelItem;
