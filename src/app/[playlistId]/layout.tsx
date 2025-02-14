import { Toaster } from '@/components/ui/sonner';

export default function PlaylistLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section>
			{children}
			<Toaster />
		</section>
	);
}
