import joi from 'joi';
import dotenv from 'dotenv';

// require and configure dotenv, will load vars in .env in PROCESS.ENV
dotenv.config();

// define validation for all the env vars
const envVarsSchema = joi
    .object({
        NODE_ENV: joi
            .string()
            .allow(['development', 'production', 'test', 'provision'])
            .default('development'),
        PORT: joi.number().default(4040),
        MONGOOSE_DEBUG: joi.boolean().when('NODE_ENV', {
            is: joi.string().equal('development'),
            then: joi.boolean().default(true),
            otherwise: joi.boolean().default(false),
        }),
        JWT_SECRET: joi
            .string()
            .required()
            .description('JWT Secret required to sign'),
        MONGO_CONNECTION_URL: joi
            .string()
            .required()
            .description('Mongo DB connection url'),
    })
    .unknown()
    .required();

const {error, value: envVars} = joi.validate(process.env, envVarsSchema);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    jwtSecret: envVars.JWT_SECRET,
    mongooseDebug: envVars.MONGOOSE_DEBUG,
    mongoConnectionUrl: envVars.MONGO_CONNECTION_URL,
};

export default config;
