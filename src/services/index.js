const express = require("express");
const { check, validationResult } = require("express-validator");
const uniqid = require("uniqid");
const { getbooks, writebooks } = require("../../lib/fsUtilities");

const booksRouter = express.Router();

const booksValidation = [
  check("name").exists().withMessage("Name is required!"),
  check("brand").exists().withMessage("Brand is required!"),
];

const reviewsValidation = [
  check("rate").exists().withMessage("Rate is required!"),
  check("comment").exists().withMessage("Comment is required!"),
];

booksRouter.post(
  "/books/id/comments",
  reviewsValidation,
  async (req, res, next) => {
    try {
      const validationErrors = validationResult(req);

      // const whiteList = ["name", "description"];

      if (!validationErrors.isEmpty()) {
        const error = new Error();
        error.httpStatusCode = 400;
        error.message = validationErrors;
        next(error);
      } else {
        const books = await getbooks();

        books.push({
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date(),
          _id: uniqid(),
          reviews: [],
        });
        await writebooks(books);
        res.status(201).send();
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

booksRouter.get("/books/id/comments", async (req, res, next) => {
  try {
    const books = await getbooks();

    const productFound = books.find(
      (product) => product._id === req.params.productId
    );

    if (productFound) {
      res.send(productFound.reviews);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

booksRouter.delete("/books/comments/id", async (req, res, next) => {
  try {
    const books = await getbooks();

    const productIndex = books.findIndex(
      (product) => product._id === req.params.productId
    );

    if (productIndex !== -1) {
      books[productIndex].reviews = books[productIndex].reviews.filter(
        (review) => review._id !== req.params.reviewId
      );

      await writebooks(books);
      res.send(books);
    } else {
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = booksRouter;
