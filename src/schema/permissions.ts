import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const PERMISSION_CATEGORIES = ['content', 'resource', 'workspace', 'admin'] as const;
export type PermissionCategory = (typeof PERMISSION_CATEGORIES)[number];

export const SUBJECT_TYPES = ['user', 'team', 'organization'] as const;
export type SubjectType = (typeof SUBJECT_TYPES)[number];

export const OBJECT_TYPES = ['workspace', 'resource', 'organization'] as const;
export type ObjectType = (typeof OBJECT_TYPES)[number];

export const PERMISSION_VALUES = ['allow', 'deny', 'unset'] as const;
export type PermissionValue = (typeof PERMISSION_VALUES)[number];

export const permissionActions = sqliteTable('permission_actions', {
	slug: text('slug').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	category: text('category', { enum: PERMISSION_CATEGORIES }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const permissions = sqliteTable('permissions', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	subjectType: text('subject_type', { enum: SUBJECT_TYPES }).notNull(),
	subjectId: text('subject_id').notNull(),
	objectType: text('object_type', { enum: OBJECT_TYPES }).notNull(),
	objectId: text('object_id').notNull(),
	action: text('action')
		.notNull()
		.references(() => permissionActions.slug),
	value: text('value', { enum: PERMISSION_VALUES }).notNull().default('unset'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const permissionActionsRelations = relations(permissionActions, ({ many }) => ({
	permissions: many(permissions)
}));

export const permissionsRelations = relations(permissions, ({ one }) => ({
	permissionAction: one(permissionActions, {
		fields: [permissions.action],
		references: [permissionActions.slug]
	})
}));
