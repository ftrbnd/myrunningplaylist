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

	if (!image) {
		return <Icons.localFile className={props.className} />;
	}

	return (
		<Image
			{...props}
			className={props.className}
			priority
			src={image.url}
			height={image.height ?? 300}
			width={image.width ?? 300}
			alt={props.alt ?? 'Thumbnail'}
			suppressHydrationWarning
		/>
	);
}
