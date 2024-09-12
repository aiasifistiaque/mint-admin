import createCollection from './collection/createCollection.model';
import viewCollections from './collection/getAllCollections.model';

import getAllCategories from './categories/getAllCategories.model';
// import createCategory from './categories/createCategory.model';
import getCategoryById from './categories/getCategoryById.model';
import updateCategory from './categories/editCategories.model';
import getCollectionById from './collection/getCollectionById.model';

const collections = {
	create: createCollection,
	getAll: viewCollections,
	getById: getCollectionById,
};

const categories = {
	getAll: getAllCategories,
	create: updateCategory,
	getById: getCategoryById,
	update: updateCategory,
};

export { collections, categories };