import { relations } from 'drizzle-orm';
import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { BOOKS_LIBRARY_NAME, HIGHLIGHTS_LIBRARY_NAME } from './constants';

export const bookLibrary = sqliteTable(BOOKS_LIBRARY_NAME, {
	ZASSETID: text('ZASSETID'),
	ZTITLE: text('ZTITLE'),
	ZAUTHOR: text('ZAUTHOR'),
	ZGENRE: text('ZGENRE'),
	ZLANGUAGE: text('ZLANGUAGE'),
	ZLASTOPENDATE: integer('ZLASTOPENDATE'),
	ZCOVERURL: text('ZCOVERURL')
});

export const annotations = sqliteTable(HIGHLIGHTS_LIBRARY_NAME, {
	ZANNOTATIONASSETID: text('ZANNOTATIONASSETID'),
	ZFUTUREPROOFING5: text('ZFUTUREPROOFING5'),
	ZANNOTATIONREPRESENTATIVETEXT: text('ZANNOTATIONREPRESENTATIVETEXT'),
	ZANNOTATIONSELECTEDTEXT: text('ZANNOTATIONSELECTEDTEXT').notNull(),
	ZANNOTATIONLOCATION: text('ZANNOTATIONLOCATION'),
	ZANNOTATIONNOTE: text('ZANNOTATIONNOTE'),
	ZANNOTATIONCREATIONDATE: integer('ZANNOTATIONCREATIONDATE'),
	ZANNOTATIONMODIFICATIONDATE: integer('ZANNOTATIONMODIFICATIONDATE'),
	ZANNOTATIONSTYLE: integer('ZANNOTATIONSTYLE'),
	ZANNOTATIONDELETED: integer('ZANNOTATIONDELETED')
});

export const bookRelations = relations(bookLibrary, ({ many }) => ({
	annotations: many(annotations)
}));

export const annotationRelations = relations(annotations, ({ one }) => ({
	assetId: one(bookLibrary, {
		fields: [ annotations.ZANNOTATIONASSETID ],
		references: [ bookLibrary.ZASSETID ] })
	}
));
