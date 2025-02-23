export default function PlaylistLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section>
			{children}
			{/* TODO: add a toast provider? */}
		</section>
	);
}
