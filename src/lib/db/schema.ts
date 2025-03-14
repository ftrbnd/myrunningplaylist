import { InferSelectModel } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
	id: text('id').primaryKey(),
	spotifyId: text('spotify_id').notNull(),
	displayName: text('display_name').notNull(),
	avatar: text('avatar').array(),
	accessToken: text('access_token').notNull(),
	refreshToken: text('refresh_token').notNull(),
	accessTokenExpiresAt: timestamp('access_token_expires_at', {
		withTimezone: true,
		mode: 'date',
	}).notNull(),
});

export const sessions = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date',
	}).notNull(),
});

export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>;

export type NewUser = Omit<User, 'id'>;
export type UserTokens = Pick<
	User,
	'accessToken' | 'refreshToken' | 'accessTokenExpiresAt'
>;
