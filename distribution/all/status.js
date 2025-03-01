const { id } = require("../util/util");

const status = function(config) {
  const context = {};
  context.gid = config.gid || 'all';

  return {
    get: (configuration, callback) => {
      const remote = {service: 'status', method: 'get'};
      global.distribution[context.gid].comm.send([configuration], remote, (e, v)=> {
        let v2 = 0;
        if (configuration == 'counts' || configuration == 'heapTotal' || configuration == 'heapUsed') {
          // must sum
          for (let key in v) {
            v2 += v[key];
          }
          callback(e, v2);
        } else {
          // no need to sum
          callback(e, v);
        }
        return;
      });
    },

    spawn: (configuration, callback) => {
      // The spawn method starts a new node with appropriate IP and port information, 
      // and adds that node to the corresponding group for all nodes (see above)

      global.distribution.local.status.spawn(configuration, (e, v) => {
        if (e) {
          callback(e, null);
          return;
        }

        global.distribution.local.groups.add(context.gid, configuration, (e, v)=> {
          callback(null, v);
        });
        
        // adds node to corresponding group for all nodes
        const remote = {service: 'groups', method: 'add'};
        global.distribution[context.gid].comm.send([context.gid, v], remote, (e, v) => {
        });

      });
    },

    stop: (callback) => {
      let val_map = {};
      let err_map = {};
      let group_nodes;
      
      global.distribution.local.groups.get(context.gid, (e, v) => {
        if (e) {
          callback(e, null);
          return;
        }
        group_nodes = v;
        const group_len = Object.keys(v).length;

        let i = 0;
        for (let sid in group_nodes) { // TODO use nid
          const nid = id.getNID(group_nodes[sid]);
          if (nid != global.nodeConfig.nid) {
            // stop nodes that are not local node
            let configuration = {node: group_nodes[sid], method: "stop", service: 'status'};

            global.distribution.local.comm.send([], configuration, (e, v) => {
              if (e) {
                err_map[sid] = e;
              } else {
                val_map[sid] = v;
              }

              i += 1;
              if (i == group_len ) {
                callback(err_map, val_map);
                return;
              }
            })
          } else {
            i += 1;
            if (i == group_len ) {
              callback(err_map, val_map);
              return;
            }
          }
        }
      });
    },
  };
};

module.exports = status;
