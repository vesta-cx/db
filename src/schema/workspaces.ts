import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './users.js';
import { resources } from './resources.js';

export const OWNER_TYPES = ['user', 'organization'] as const;
export type OwnerType = (typeof OWNER_TYPES)[number];

export const VISIBILITY_TYPES = ['public', 'private'] as const;
export type VisibilityType = (typeof VISIBILITY_TYPES)[number];

export const workspaces = sqliteTable('workspaces', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description'),
	ownerType: text('owner_type', { enum: OWNER_TYPES }).notNull(),
	ownerId: text('owner_id').notNull(),
	avatarUrl: text('avatar_url'),
	bannerUrl: text('banner_url'),
	visibility: text('visibility', { enum: VISIBILITY_TYPES }).notNull().default('public'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
	owner: one(users, {
		fields: [workspaces.ownerId],
		references: [users.workosUserId]
	}),
	ownedResources: many(resources)
}));
