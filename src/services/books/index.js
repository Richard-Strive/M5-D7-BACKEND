const express = require("express");
const { getbooks } = require("../../lib/fsUtilities");
const booksRouter = express.Router();

//We just need to send data to client for books

booksRouter.get("/", async (req, res, next) => {
	try {
		//We want to grab data from books.json
		const allBooks = await getbooks(); //pending,resolved,rejected

		//We want to send all books to the client
		res.status(200).send(allBooks);
	} catch (error) {
		console.log(error);
		next(error);
	}
});

module.exports = booksRouter;
