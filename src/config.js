const { config } = require("dotenv");

config();

module.exports = {
    USER_DEALERNET: process.env.USER_DEALERNET,
    PASSWORD_DEALERNET: process.env.PASSWORD_DEALERNET,
    DOMAIN: process.env.DOMAIN,
    PORT: process.env.PORT,
    URL_DEALERNET: process.env.URL_DEALERNET,
    SOAP_DEALERNET: process.env.SOAP_DEALERNET,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME,
    DATABASE_PORT: process.env.DATABASE_PORT,
    DOMAIN_FRONT: process.env.DOMAIN_FRONT,
    AWS_SES_ACCESS_KEY: process.env.AWS_SES_ACCESS_KEY,
    AWS_SES_SECRET_KEY: process.env.AWS_SES_SECRET_KEY,
    AWS_SES_REGION: process.env.AWS_SES_REGION,
    AWS_SES_ENDPOINT: process.env.AWS_SES_ENDPOINT,
    URL_BACKEND_EMAIL: process.env.URL_BACKEND_EMAIL,
}