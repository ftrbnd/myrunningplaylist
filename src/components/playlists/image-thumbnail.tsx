import { Image as SpotifyImage } from '@spotify/web-api-ts-sdk';
import { Icons } from '@/components/layout/icons';
import { ComponentProps } from 'react';
import { motion } from 'motion/react';

interface Props extends ComponentProps<'img'> {
	images: SpotifyImage[];
}

export function ImageThumbnail({ images, ...props }: Props) {
	const image = images
		? images.reverse().find((image) => image !== undefined)
		: null;

	if (!image) {
		return <Icons.localFile className={props.className} />;
	}

	return (
		<motion.img
			layoutId={image.url}
			className={props.className}
			src={image.url}
			height={image.height ?? 300}
			width={image.width ?? 300}
			alt={props.alt ?? 'Thumbnail'}
			suppressHydrationWarning
		/>
	);
}
