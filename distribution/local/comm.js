/** @typedef {import("../types").Callback} Callback */
/** @typedef {import("../types").Node} Node */

const { serialize } = require("../util/serialization");
const { deserialize } = require("../util/serialization");
const http = require('node:http');


/**
 * @typedef {Object} Target
 * @property {string} service
 * @property {string} method
 * @property {Node} node
 */

/**
 * @param {Array} message
 * @param {Target} remote
 * @param {Callback} [callback]
 * @return {void}
 */
function send(message=[], remote={node: "default", method: "default", service: "default"}, callback=(e, v)=>{}) {  
  if (remote.node == "default") {
    callback(new Error("no remote passed in"), null);
    return;
  }
  let gid = "local"
  if ('gid' in remote) {
    gid = remote['gid'];
  }
  const serialized_msg = serialize(message);
  const options = {
    hostname: remote.node.ip,
    port: remote.node.port,
    path: '/' + gid + '/' + remote.service + '/' + remote.method,
    method: 'PUT',
  };

  const req = http.request(options, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
      let deserialized_res = deserialize(responseBody);
      return callback(...deserialized_res);
    });
  });

  req.write(serialized_msg);
  req.on('error', (err) => 
    callback(new Error("comm send err", {source:err}), null)
  // callback(err, null)
);
  req.end();
}

module.exports = {send};
