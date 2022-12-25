import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { ANIMATION_TIME_SECONS, COLUMN_NUMBER } from '../../../../config';
import { getItemColumnIndex, getItemRowIndex } from '../../../../game-algorithms/tile-matching';
import useEffectAfterFirstRender from '../../../../hooks/useEffectAfterFirstRender';
import { levelItemsState } from '../../../../recoil/atoms/levelItems';
import Candy from './level-items/Candy';
import Chocolate from './level-items/Chocolate';
import SuperCandy from './level-items/SuperCandy';
import gsap from 'gsap';
import { liveItemsIds } from './ItemGrid';

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
			return <Candy color={item.color} initialIndex={itemIndex} id={id} key={id}></Candy>;

		case 'SuperCandy':
			return <SuperCandy color={item.color} initialIndex={itemIndex} id={id} key={id}></SuperCandy>;

		case 'Chocolate':
			return <Chocolate initialIndex={itemIndex} id={id} key={id}></Chocolate>;

		default:
			return <div></div>;
	}
};

const setPosition = (element: HTMLElement, index: number): void => {
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

const animatePosition = (element: HTMLElement, position: ItemPosition): void => {
	gsap.to(element, {
		xPercent: position.x,
		yPercent: position.y,
		duration: ANIMATION_TIME_SECONS,
		ease: 'back.out(1.5)',
	});
};

const LevelItem = ({ initialIndex }: LevelItemProps) => {
	const levelItems = useRecoilValue(levelItemsState);
	//const renderedLevelItem = useRecoilValue(renderedLevelItemsState(initialIndex));

	const [levelItemTarget, setLevelItemTarget] = useState<LevelItem | null>(levelItems[initialIndex]);

	const elementRef = useRef<HTMLDivElement | null>(null);
	const rowIndexRef = useRef<number>(0);
	const columnIndexRef = useRef<number>(0);
	const positionRef = useRef<ItemPosition>({ x: 0, y: 0 });
	const emptyTargetRef = useRef(false);

	useEffect(() => {
		const validItem = typeof levelItemTarget?.key === 'string';
		validItem && liveItemsIds.push(levelItemTarget?.key || '');
	}, []);

	useEffectAfterFirstRender(() => {
		updatePosition();
		emptyTargetRef.current && spawnItem();
	}, [levelItems]);

	useEffect(() => {
		if (!!levelItemTarget) {
			setPosition(elementRef.current as HTMLElement, getItemIndex());
		}
	}, [levelItemTarget]);

	const spawnItem = () => {
		liveItemsIds.splice(
			liveItemsIds.findIndex(x => x === levelItemTarget?.key),
			0
		);

		const newTarget = levelItems.filter(x => typeof x?.key === 'string').find(y => !liveItemsIds.includes(y?.key || ''));
		const newTargetIsValid = newTarget !== undefined && typeof newTarget?.key === 'string';

		if (!newTargetIsValid) return;

		setLevelItemTarget(newTarget);
		emptyTargetRef.current = false;
		liveItemsIds.push(newTarget?.key || '');
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
