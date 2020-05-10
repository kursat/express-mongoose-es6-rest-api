import fs from 'fs';
import path from 'path';

export default class FileController {
	static get(req, res, next) {
		try {
			const {filename} = req.params;
			const absolutePath = path.resolve(
				`${__dirname}${path.sep}..${path.sep}..${path.sep}uploads${path.sep}${filename}`,
			);

			res.sendFile(absolutePath);
		} catch (e) {
			next(e);
		}
	}

	static getApp(req, res, next) {
		try {
			const {filename} = req.params;
			const absolutePath = path.resolve(
				`${__dirname}${path.sep}..${path.sep}..${path.sep}..${path.sep}mobile-apps${path.sep}${filename}`,
			);

			res.sendFile(absolutePath);
		} catch (e) {
			next(e);
		}
	}

	static remove(req, res, next) {
		try {
			const {filename} = req.params;
			const absolutePath = path.resolve(
				`${__dirname}${path.sep}..${path.sep}..${path.sep}uploads${path.sep}${filename}`,
			);

			fs.unlink(absolutePath, () => {
				res.status(200).send();
			});
		} catch (e) {
			next(e);
		}
	}

	static create(req, res, next) {
		try {
			const filenames = req.files.map((f) => f.filename);

			res.json({
				images: filenames,
			});
		} catch (e) {
			next(e);
		}
	}
}
