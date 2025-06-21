export default () => ({
  NODE_ENV: process.env.NODE_ENV,

  port: parseInt(process.env.PORT),

  secret: process.env.SECRET,

  dbHost: process.env.DB_HOST,

  dbPort: parseInt(process.env.DB_PORT),

  dbUsername: process.env.DB_USERNAME,

  dbPassword: process.env.DB_PASSWORD,

  dbName: process.env.DB_NAME,

  EMAIL_HOST: process.env.EMAIL_HOST,

  EMAIL_PORT: parseInt(process.env.EMAIL_PORT),

  EMAIL_USER: process.env.EMAIL_USER,

  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,

  FRONT_END_URL: process.env.FRONT_END_URL,
});
