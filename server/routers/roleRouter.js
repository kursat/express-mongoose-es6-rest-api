import { Router } from 'express';
import expressJwt from 'express-jwt';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import roleController from '../controllers/roleController';
import config from '../../config/config';

// eslint-disable-next-line new-cap
const roleRouter = Router();

roleRouter.route('/')
  .get(expressJwt({ secret: config.jwtSecret }), roleController.list)
  .post(
    [
      expressJwt({ secret: config.jwtSecret }),
      validate(paramValidation.createRole)
    ],
    roleController.create
  );

roleRouter.route('/:roleId')
  .get(expressJwt({ secret: config.jwtSecret }), roleController.get)
  .put(
    [
      expressJwt({ secret: config.jwtSecret }),
      validate(paramValidation.updateRole)
    ],
    roleController.update
  )
  .delete(expressJwt({ secret: config.jwtSecret }), roleController.remove);

roleRouter.param('roleId', roleController.load);

export default roleRouter;
