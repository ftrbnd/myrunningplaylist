import { Button } from '@/components/ui/button';

interface Props {
	reset: () => void;
	save: () => void;
}

export function CustomToast({ reset, save }: Props) {
	return (
		<div className='flex gap-4 bg-card rounded-md shadow-lg ring-1 ring-black/5 w-full md:max-w-[400px] space-x-16 items-center justify-between p-4'>
			<div className='flex flex-1'>
				<p className='text-sm font-medium text-card-foreground'>
					Save changes?
				</p>
			</div>
			<div className='flex gap-2 items-center'>
				<Button
					variant='destructive'
					onClick={reset}>
					Reset
				</Button>
				<Button onClick={save}>Save</Button>
			</div>
		</div>
	);
}
