import { Image as SpotifyImage } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';
import { Icons } from '@/components/layout/icons';
import { ComponentProps } from 'react';

interface Props extends ComponentProps<'img'> {
	images: SpotifyImage[];
}

export function ImageThumbnail({ images, ...props }: Props) {
	const image = images
		? images.reverse().find((image) => image !== undefined)
		: null;

	return image ? (
		<Image
			{...props}
			className={props.className}
			priority
			src={image.url}
			height={image.height ?? 64}
			width={image.width ?? 64}
			alt={props.alt ?? 'Thumbnail'}
		/>
	) : (
		<Icons.localFile className={props.className} />
	);
}
