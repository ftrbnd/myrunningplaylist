import { Button } from '@/components/ui/button';
import { useEditPlaylist } from '@/hooks/use-edit-playlist';
import { usePlaylist } from '@/hooks/use-playlist';
import { cn } from '@/lib/cn';
import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ComponentProps } from 'react';

interface Props extends ComponentProps<'div'> {
	playlistId: string;
}

export const MotionEditingToast = motion.create(EditingToast);

function EditingToast({ playlistId, ...props }: Props) {
	const { submitReorder, reorderIsPending } = usePlaylist(playlistId);
	const { store, resetTracks } = useEditPlaylist(playlistId);

	return (
		<div
			ref={props.ref}
			className={cn(
				'flex gap-4 items-center justify-between',
				'max-w-[400px] bg-card rounded-md shadow-lg ring-1 ring-black/5 p-4',
				'fixed bottom-5 left-5 md:left-auto right-5 z-50',
				'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
				props.className
			)}>
			<div className='flex flex-1'>
				<p className='text-sm font-medium text-card-foreground'>
					Save changes?
				</p>
			</div>
			<div className='flex gap-2 items-center'>
				<Button
					disabled={reorderIsPending}
					variant='destructive'
					onClick={resetTracks}>
					Reset
				</Button>
				<Button
					disabled={reorderIsPending}
					onClick={async () =>
						await submitReorder({
							newOrder: store.tracks,
							resetEditedTracks: resetTracks,
						})
					}>
					{reorderIsPending && <Loader2 className='animate-spin' />}
					{reorderIsPending ? 'Saving...' : 'Save'}
				</Button>
			</div>
		</div>
	);
}
