import {Router} from 'express';
import multer, {diskStorage} from 'multer';
import expressJwt from 'express-jwt';
import {v4 as uuidv4} from 'uuid';
import FileController from '../controllers/FileController';
import config from '../../config/config';

const storage = diskStorage({
	destination(req, file, cb) {
		cb(null, 'uploads');
	},
	filename(req, file, cb) {
		const [, ext] = file.originalname.split('.');
		cb(null, `${file.fieldname}-${uuidv4()}.${ext}`);
	},
});

const upload = multer({storage});

const FileRouter = Router(); // eslint-disable-line new-cap

FileRouter.route('/')
	/** POST /api/files - Create new file */
	.post(
		expressJwt({secret: config.jwtSecret}),
		upload.array('photos', 12),
		FileController.create,
	);

FileRouter.route('/:filename')
	.get(FileController.get)

	.delete(expressJwt({secret: config.jwtSecret}), FileController.remove);

FileRouter.route('/mobile/:filename').get(FileController.getApp);

export default FileRouter;
