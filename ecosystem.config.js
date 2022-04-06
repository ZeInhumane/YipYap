module.exports = {
 apps : [{
    script    : "index.js",
    instances : "max",
    exec_mode : "cluster",
  }],
  "scripts": {
    "start": "pm2-runtime start index.js -i max",
  },
};
