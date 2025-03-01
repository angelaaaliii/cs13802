const groups = function(config) {
  const context = {};
  context.gid = config.gid || 'all';

  return {
    put: (config, group, callback) => {
      const remote = {service: 'groups', method: 'put'};
      global.distribution[context.gid].comm.send([config, group], remote, (e, v)=> {
        callback(e, v);
        return;
      });
    },

    del: (name, callback) => {
      const remote = {service: 'groups', method: 'del'};
      global.distribution[context.gid].comm.send([name], remote, (e, v)=> {
        callback(e, v);
        return;
      });
    },

    get: (name, callback) => {
      const remote = {service: 'groups', method: 'get'};
      global.distribution[context.gid].comm.send([name], remote, (e, v)=> {
        callback(e, v);
        return;
      });
    },

    add: (name, node, callback) => {
      const remote = {service: 'groups', method: 'add'};
      global.distribution[context.gid].comm.send([name, node], remote, (e, v)=> {
        callback(e, v);
        return;
      });
    },

    rem: (name, node, callback) => {
      const remote = {service: 'groups', method: 'rem'};
      global.distribution[context.gid].comm.send([name, node], remote, (e, v)=> {
        callback(e, v);
        return;
      });
    },
  };
};

module.exports = groups;
