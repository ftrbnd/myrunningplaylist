import { betterFetch } from '@better-fetch/fetch';
import { Session } from 'better-auth/types';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
	const { data: session } = await betterFetch<Session>(
		'/api/auth/get-session',
		{
			baseURL: request.nextUrl.origin,
			headers: {
				//get the cookie from the request
				cookie: request.headers.get('cookie') || '',
			},
		}
	);

	if (request.nextUrl.pathname === '/login' && session !== null) {
		return NextResponse.redirect(new URL('/', request.url));
	} else if (!session && request.nextUrl.pathname !== '/login') {
		return NextResponse.redirect(new URL('/login', request.url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
