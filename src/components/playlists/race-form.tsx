'use client';

import { raceDistances } from '@/lib/utils';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectGroup,
	SelectLabel,
	SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
	distance: z.enum(raceDistances.metric).or(z.enum(raceDistances.imperial)),
	hours: z.coerce.number().min(0).max(9).optional(),
	minutes: z.coerce.number().min(0).max(59),
	seconds: z.coerce.number().min(0).max(59),
});

export function RaceForm({
	disabledWhileLoading,
}: {
	disabledWhileLoading?: boolean;
}) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col items-start gap-2'>
				<FormField
					disabled={disabledWhileLoading}
					control={form.control}
					name='distance'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Distance</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}>
								<FormControl>
									<SelectTrigger className='w-[200px]'>
										<SelectValue placeholder='Select a distance' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Metric</SelectLabel>
										{raceDistances.metric.map((distance) => (
											<SelectItem
												key={distance}
												value={distance}>
												{distance}
											</SelectItem>
										))}
									</SelectGroup>
									<SelectGroup>
										<SelectLabel>Imperial</SelectLabel>
										{raceDistances.imperial.map((distance) => (
											<SelectItem
												key={distance}
												value={distance}>
												{distance}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							<FormDescription>How long is your race?</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className='flex justify-start gap-1'>
					<FormField
						disabled={disabledWhileLoading}
						control={form.control}
						name='hours'
						render={({ field }) => (
							<FormItem className='w-16 md:w-24 max-w-24'>
								<FormLabel>Hours</FormLabel>
								<FormControl>
									<Input
										min={0}
										max={9}
										type='number'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						disabled={disabledWhileLoading}
						control={form.control}
						name='minutes'
						render={({ field }) => (
							<FormItem className='w-16 md:w-24 max-w-24'>
								<FormLabel>Minutes</FormLabel>
								<FormControl>
									<Input
										min={0}
										max={59}
										required
										type='number'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						disabled={disabledWhileLoading}
						control={form.control}
						name='seconds'
						render={({ field }) => (
							<FormItem className='w-16 md:w-24 max-w-24'>
								<FormLabel>Seconds</FormLabel>
								<FormControl>
									<Input
										min={0}
										max={59}
										required
										type='number'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<Button
					disabled={disabledWhileLoading}
					type='submit'
					className='self-center'>
					Submit
				</Button>
			</form>
		</Form>
	);
}
