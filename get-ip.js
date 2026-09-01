const os = require('os');
const nets = os.networkInterfaces();
let ip = 'localhost';
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    if (net.family === 'IPv4' && !net.internal) {
      ip = net.address;
      break;
    }
  }
}
console.log('LAN_IP=' + ip);
