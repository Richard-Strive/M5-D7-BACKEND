const express = require("express");
const uniqid = require("uniqid");
const {
	getcomments,
	writecomments,
	getbooks,
} = require("../../lib/fsUtilities");

const Joi = require("joi");
const commentRouter = express.Router();
/**
 * - CommentID //Server Generated
 * - asin //server generated
    - UserName
    - Text
    - Date //Server Generated
 */

/**
  * POST /books/id/comments => adds a comment for book {id}
    GET /books/id/comments => gets all the comments for book {id}
    DELETE /books/comments/id => delete comment {id}

  */

const validateCommentInput = (dataToValidate) => {
	const schema = Joi.object().keys({
		text: Joi.string().min(3).max(300).required(),
		username: Joi.string().min(3).max(30).required(),
	});

	console.log(schema.validate(dataToValidate));
	return schema.validate(dataToValidate);
};

commentRouter.post("/:asin/comments", async (req, res, next) => {
	//Get all books
	//check if the books exist
	//check if the body is legit
	try {
		const allBooks = await getbooks();
		const currentBook = allBooks.find(
			(book) => book.asin === req.params.asin
		);

		const { error } = validateCommentInput(req.body);

		if (error) {
			// This is for checking request body
			const err = new Error();
			err.httpStatusCode = 400;
			err.message = error.details[0].message;
			next(err);
		} else if (!currentBook) {
			// This is for invalid book id
			const err = new Error();
			err.httpStatusCode = 404;
			err.message = "There is no book with this asin value";
			next(err);
		} else {
			const allComments = await getcomments();
			const newComment = {
				...req.body,
				_id: uniqid(),
				asin: req.params.asin,
				createdAt: new Date(),
			};

			allComments.push(newComment);

			await writecomments(allComments);

			res.status(201).send(newComment);
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});

commentRouter.get("/:asin/comments", async (req, res, next) => {
	try {
		const allComments = await getcomments();
		//TODO Check the book asin if it's valid

		const bookComments = allComments.filter(
			(comment) => comment.asin === req.params.asin
		);

		res.status(200).send(bookComments);
	} catch (error) {
		console.log(error);
		next(error);
	}
});

commentRouter.delete("/comments/:commentId", async (req, res, next) => {
	try {
		const allComments = await getcomments();

		const currentComment = allComments.find(
			(comment) => comment._id === req.params.commentId
		);

		if (currentComment) {
			const newAllComments = allComments.filter(
				(comment) => comment._id !== req.params.commentId
			);

			await writecomments(newAllComments);
			res.send("Succesfuly Deleted");
		} else {
			const err = new Error();
			err.httpStatusCode = 404;
			next(err);
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});
module.exports = commentRouter;
