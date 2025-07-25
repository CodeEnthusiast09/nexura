export default () => ({
  port: parseInt(process.env.PORT),

  secret: process.env.SECRET,

  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USENAME,
    pass: process.env.DATABASE_PWD,
    name: process.env.DATABASE_NAME,
  },

  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  frontendUrl: process.env.FRONT_END_URL,

  googleAuth: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
  },
});
