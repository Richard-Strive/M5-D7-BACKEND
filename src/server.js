const express = require("express");
const listEndpoints = require("express-list-endpoints");
const booksRoute = require("./services/books");
const commentsRoute = require("./services/comments");
const {
	badRequestHandler,
	notFoundHandler,
	genericErrorHandler,
} = require("./errorHandlers");

const server = express();

const port = process.env.PORT || 3002;

server.use(express.json());

server.use("/books", booksRoute);
server.use("/books", commentsRoute);
//ERROR HANDLING MIDDLEWARES
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.log(listEndpoints(server));

server.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
