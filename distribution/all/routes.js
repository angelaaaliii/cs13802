/** @typedef {import("../types").Callback} Callback */

function routes(config) {
  const context = {};
  context.gid = config.gid || 'all';

  /**
   * @param {object} service
   * @param {string} name
   * @param {Callback} callback
   */
  function put(service, name, callback = () => { }) { 
    const remote = {service: 'routes', method: 'put'};
    global.distribution[context.gid].comm.send([service, name], remote, (e, v)=> {
      callback(e, v);
      return;
    });
  }

  /**
   * @param {object} service
   * @param {string} name
   * @param {Callback} callback
   */
  function rem(service, name, callback = () => { }) {
    const remote = {service: 'routes', method: 'rem'};
    global.distribution[context.gid].comm.send([service, name], remote, (e, v)=> {
      callback(e, v);
      return;
    });
  }

  return {put, rem};
}

module.exports = routes;
