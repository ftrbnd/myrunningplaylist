'use client';

import {
	distanceSchema,
	metricRaceNames,
	imperialRaceNames,
	allRaces,
} from '@/lib/race';
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
import { durationSchema } from '@/lib/duration';

const formSchema = distanceSchema.and(durationSchema);

interface RaceFormProps {
	playlistId: string;
	disabledWhileLoading?: boolean;
}

// TODO: fix uncontrolled input error
export function RaceForm({ playlistId, disabledWhileLoading }: RaceFormProps) {
	const playlist = usePlaylist(playlistId);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		const raceValue = allRaces.get(values.distance);
		if (!raceValue)
			throw new Error(`Race with name '${values.distance}' was not found`);

		playlist.setRace({
			name: values.distance,
			value: raceValue,
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
										{metricRaceNames.map((name) => (
											<SelectItem
												key={name}
												value={name}>
												{name}
											</SelectItem>
										))}
									</SelectGroup>
									<SelectGroup>
										<SelectLabel>Imperial</SelectLabel>
										{imperialRaceNames.map((name) => (
											<SelectItem
												key={name}
												value={name}>
												{name}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
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
										defaultValue={0}
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
										defaultValue={0}
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
										defaultValue={0}
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
				<FormDescription>What is your goal time?</FormDescription>
				<div className='flex gap-2 justify-between items-center w-full'>
					<Button
						disabled={disabledWhileLoading}
						variant='secondary'
						onClick={(e) => {
							e.preventDefault();
							playlist.setRace(null);
						}}>
						Reset
					</Button>
					<Button
						disabled={disabledWhileLoading}
						type='submit'>
						Submit
					</Button>
				</div>
			</form>
		</Form>
	);
}
