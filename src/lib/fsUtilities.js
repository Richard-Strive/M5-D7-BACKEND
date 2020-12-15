const { readJSON, writeJSON } = require("fs-extra");
const { join } = require("path");

const booksPath = join(__dirname, "../services/books/books.json");
const commentsPath = join(__dirname, "../services/comments/comments.json");

const readDB = async (filePath) => {
	try {
		const fileJson = await readJSON(filePath);
		return fileJson;
	} catch (error) {
		throw new Error(error);
	}
};

const writeDB = async (filePath, fileContent) => {
	try {
		await writeJSON(filePath, fileContent);
	} catch (error) {
		throw new Error(error);
	}
};

module.exports = {
	getbooks: async () => readDB(booksPath),
	writebooks: async (booksData) => writeDB(booksPath, booksData),
	getcomments: async () => readDB(commentsPath),
	writecomments: async (commentsData) => writeDB(commentsPath, commentsData),
};
