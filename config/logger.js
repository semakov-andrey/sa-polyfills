'use strict';

const ifaces = require('os').networkInterfaces();
const logger = require('eazy-logger').Logger();

module.exports = (name, port) => () => {
  const addresses = [];
  Object.keys(ifaces).forEach(ifname => {
    ifaces[ifname].forEach(iface => {
      if ('IPv4' !== iface.family || iface.internal !== false) return;
      addresses.push(`http://${iface.address}:${port}`);
    });
  });
  const local = `http://localhost:${port}`;
  const length = [ local, ...addresses ].reduce((acc, current) => current.length > acc ? current.length : acc, 0);
  const underline = new Array(11 + length).join('-');
  logger.info(`Runned ${name}:`);
  logger.info('{grey:%s}', underline);
  logger.info('%s: {red:%s}', `${new Array(4).join(' ')}Local`, local);
  addresses.forEach(address => logger.info('%s: {red:%s}', 'External', address));
  logger.info('{grey:%s}', underline);
};