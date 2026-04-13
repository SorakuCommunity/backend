module.exports = {
  apps: [
    {
      name: "restapi-anime",
      script: "src/index.js",
      interpreter: "none",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_development: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      error_file: "logs/error.log",
      out_file: "logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      max_memory_restart: "1G",
      autorestart: true,
      watch: false,
      restart_delay: 1000,
    },
  ],
};
