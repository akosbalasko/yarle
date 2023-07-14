const express = require("express");
const path  = require("path");
const cookieParser= require("cookie-parser");
const bodyParser= require("body-parser");
const http= require("http");
const createError= require("http-errors");
const process= require("process");
const { Magic } = require('magic-sdk');

const expressPort = "3000"
//process.env.NODE_OPTIONS="--openssl-legacy-provider"
const app = express(),
	router = express.Router(),
	appName = process.execPath;
/*
if (appName.endsWith(`${name}.exe`)) {
	dbPath = path.join("./resources/app.asar.unpacked", basePath);
}
*/
const routes = [
	{
		path: "/",
		handler: (_req, res) => res.render("index", { title: "Home" }),
	},
	{
		path: "/loginCallback",
		handler: (_req, res) => {
			console.log(_req.query)
		}
	}


];

routes.forEach((route) => {
	router.get(route.path, route.handler);
});

router.post('/generateMagicLinkForMail', async (req, res, next) => {
	console.log(req.body.email)

	MAGIC_PUBLISHABLE_KEY='pk_live_153366AD0DA03DE9';
	const magic = new Magic(MAGIC_PUBLISHABLE_KEY);


    try {
		await magic.auth.loginWithMagicLink({
		  email,
		});
		history.push("/");
	  } catch {
		console.log("not logged in")
		setIsLoggingIn(false);
	  }
})

app.set("port", "3000");
app.set("views", path.join(__dirname, path.join("..", "views")));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, path.join("..", "public"))));
app.use("/", router);
app.use(function (req, res, next) {
	next(createError(404));
});
app.use((err, req, res, _next) => {
	res.locals.title = "error";
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	res.status(err.status || 500);
	res.render("error");
});

function shutdown() {
	console.log("Shutting down Express server...");
	server.close();
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

let server = http.createServer(app);
server.listen(expressPort);
server.on("error", (error) => {
	if (error.syscall !== "listen") {
		throw error;
	}

	var bind =
		typeof expressPort === "string"
			? "Pipe " + expressPort
			: "Port " + expressPort;

	switch (error.code) {
		case "EACCES":
			console.error(bind + " requires elevated privileges");
			process.exit(1);
		case "EADDRINUSE":
			console.error(bind + " is already in use");
			process.exit(1);
		default:
			throw error;
	}
});
server.on("listening", () => console.log(`Listening on: ${expressPort}`));