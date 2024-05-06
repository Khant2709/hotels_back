import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;

export const COMPANY_MAIL = process.env.COMPANY_MAIL;
export const USER_NAME_MAIL = process.env.USER_NAME_MAIL;
export const PASSWORD_MAIL = process.env.PASSWORD_MAIL;
export const FROM_MAIL = process.env.FROM_MAIL;

export const DB_HOST = process.env.DB_HOST;
export const DB_USER = process.env.DB_USER;
export const DB_DATABASE = process.env.DB_DATABASE;
export const DB_PASSWORD = process.env.DB_PASSWORD;

export const LOGIN_NAME = process.env.LOGIN_NAME;
export const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD;
export const LOGIN_TOKEN = process.env.LOGIN_TOKEN;

export const DIRECTORY_UPLOADS = '/root/backend/uploads';