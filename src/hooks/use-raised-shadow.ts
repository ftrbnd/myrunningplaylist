import {
	animate,
	MotionValue,
	useMotionValue,
	useMotionValueEvent,
} from 'motion/react';

const inactiveShadow = '0px 0px 0px rgba(0,0,0,0.8)';

export function useRaisedShadow(value: MotionValue<number>) {
	const boxShadow = useMotionValue(inactiveShadow);
	let isActive = false;

	useMotionValueEvent(value, 'change', (latest) => {
		const wasActive = isActive;
		if (latest !== 0) {
			isActive = true;
			if (isActive !== wasActive) {
				animate(boxShadow, '0px 0px 15px 5px rgba(0,0,0,0.3)');
			}
		} else {
			isActive = false;
			if (isActive !== wasActive) {
				animate(boxShadow, inactiveShadow);
			}
		}
	});

	return boxShadow;
}
