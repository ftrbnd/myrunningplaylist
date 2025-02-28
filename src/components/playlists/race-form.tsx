'use client';

import { metricRaces, imperialRaces } from '@/lib/utils';
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
import { usePlaylist } from '@/hooks/use-playlist';

const metric = metricRaces.map(({ name }) => name);
const imperial = imperialRaces.map(({ name }) => name);
const races = [...metricRaces, ...imperialRaces];

const formSchema = z.object({
	distance: z
		.enum([metric[0], ...metric.slice(0)])
		.or(z.enum([imperial[0], ...imperial.slice(0)])),
	hours: z.coerce.number().min(0).max(9).default(0),
	minutes: z.coerce.number().min(0).max(59),
	seconds: z.coerce.number().min(0).max(59),
});

interface RaceFormProps {
	playlistId: string;
	disabledWhileLoading?: boolean;
}

export function RaceForm({ playlistId, disabledWhileLoading }: RaceFormProps) {
	const playlist = usePlaylist(playlistId);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);

		const race = races.find((r) => r.name === values.distance);
		if (!race)
			throw new Error(`Race with name '${values.distance}' was not found`);

		playlist.setRace({
			name: values.distance,
			value: race.value,
		});
		playlist.setGoalTime({
			hours: values.hours,
			minutes: values.minutes,
			seconds: values.seconds,
		});
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
										{metricRaces.map(({ name }) => (
											<SelectItem
												key={name}
												value={name}>
												{name}
											</SelectItem>
										))}
									</SelectGroup>
									<SelectGroup>
										<SelectLabel>Imperial</SelectLabel>
										{imperialRaces.map(({ name }) => (
											<SelectItem
												key={name}
												value={name}>
												{name}
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
