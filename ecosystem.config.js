module.exports = {
 apps : [{
    script    : "index.js",
    instances : "1",
    exec_mode : "cluster",
  }],
  "scripts": {
    "start": "pm2-runtime start index.js -i max",
  },
};
