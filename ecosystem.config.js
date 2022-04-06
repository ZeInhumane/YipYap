module.exports = {
  apps: [{
    script: "index.js",
    instances: "max",
    exec_mode: "cluster",
  }],
  "scripts": {
    "start": "pm2-runtime start ecosystem.config.js --env production",
  },
  env_production: {
    NODE_ENV: "production",
  }
};
