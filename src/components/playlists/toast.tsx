'use client';

import React from 'react';
import { toast as sonnerToast } from 'sonner';
import { Button } from '@/components/ui/button';

interface CustomProps {
	isReordered: boolean;
	reset: () => void;
	save: () => void;
	id?: string | number;
}

export function toast(props: CustomProps) {
	if (!props.isReordered) {
		return sonnerToast.dismiss();
	}

	return sonnerToast.custom(
		(id) => (
			<Toast
				{...props}
				id={id}
			/>
		),
		{
			duration: Infinity,
		}
	);
}

function Toast(props: CustomProps) {
	const { reset, save, id } = props;

	const handleReset = () => {
		reset();
		sonnerToast.dismiss(id);
	};

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
					onClick={handleReset}>
					Reset
				</Button>
				<Button onClick={save}>Save</Button>
			</div>
		</div>
	);
}
