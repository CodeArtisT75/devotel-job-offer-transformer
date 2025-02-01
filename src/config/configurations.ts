export const Configurations = () => ({
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!, 10) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },

  app: {
    job_fetching_cron_expression: process.env.JOB_FETCHING_CRON_EXPRESSION ?? '*/1 * * * *', // default is every minute
  },
});
