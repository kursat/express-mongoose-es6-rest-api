// config should be imported before importing any other file
// eslint-disable-next-line import/order
import config from './config/config';
import bluebird from 'bluebird';
import debug from 'debug';
import mongoose from 'mongoose';
import util from 'util';
import app from './config/express';

const mongooseLogger = debug('express-mongoose-es6-rest-api:index');

// make bluebird default Promise
mongoose.Promise = bluebird;

// connect to mongo db
mongoose.connect(config.mongoConnectionUrl, {
	keepAlive: 1,
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
});

mongoose.connection.on('error', () => {
	throw new Error(
		`unable to connect to database: ${config.mongoConnectionUrl}`,
	);
});

// print mongoose logs in dev env
if (config.mongooseDebug) {
	mongoose.set('debug', (collectionName, method, query, doc) => {
		mongooseLogger(
			`${collectionName}.${method}`,
			util.inspect(query, false, 20),
			doc,
		);
	});
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
	app.listen(config.port, () => {
		// eslint-disable-next-line no-console
		console.info(`server started on port ${config.port} (${config.env})`);
	});
}

export default app;
