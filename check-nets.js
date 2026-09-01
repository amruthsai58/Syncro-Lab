const os = require('os');
const nets = os.networkInterfaces();
console.log(JSON.stringify(nets, null, 2));
