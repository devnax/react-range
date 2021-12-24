import React, { useMemo, useState, useEffect } from 'react';
import jpath from 'jsonpath';

const uid = () => Math.random().toString(36).substring(2);
const is_object = (val, or = false) => typeof val === 'object' && val !== null && !Array.isArray(val) ? val : or;
const is_array = (val, or = false) => typeof val === 'object' && Array.isArray(val) ? val : or;
const in_array = (item, arr, or = false) => is_array(arr) && arr.indexOf(item) != -1 ? true : or;
const is_string = (val, or = false) => typeof val === 'string' ? true : or;
const is_number = (val, or = false) => typeof val === 'number' ? true : or;
const is_callback = (val, or = false) => typeof val === 'function' ? val : or;
const is_callable = (val, or = false) => typeof val === 'function' ? val : or;
const is_define = (val, or = false) => typeof val !== 'undefined' ? val : or;
const is_null = (val, or = false) => val === null ? true : or;

class MetaData {
  addMeta(key, data) {
    this.state.meta_data[key] = this.formateRow({
      meta_value: data
    });
    this.onUpdateState({
      key,
      callback: 'addMeta',
      type: 'meta'
    });
  }

  addMetas(metas) {
    if (!is_object(metas)) {
      return;
    }

    for (let key in metas) {
      const data = metas[key];
      this.state.meta_data[key] = this.formateRow({
        meta_value: data
      });
    }

    this.onUpdateState({
      key: false,
      callback: 'addMetas',
      type: 'meta'
    });
  }

  useMeta(key, def) {
    return [this.getMeta(key, def), value => {
      this.addMeta(key, value);
    }];
  }

  getMeta(key, def) {
    this.onReadState({
      key,
      callback: 'getMeta',
      type: 'meta'
    });
    const meta = this.state.meta_data[key];

    if (meta) {
      return meta.meta_value;
    }

    return def;
  }

  getMetas(keys, def) {
    this.onReadState({
      key: false,
      callback: 'getMetas',
      type: 'meta'
    });

    if (!is_array(keys)) {
      return;
    }

    const metas = {};

    for (let key of keys) {
      metas[key] = this.state.meta_data[key] || def;
    }

    return metas;
  }

  getAllMeta() {
    this.onReadState({
      key: false,
      callback: 'getAllMeta',
      type: 'meta'
    });
    return this.state.meta_data;
  }

  getMetaInfo(key) {
    this.onReadState({
      key,
      callback: 'getMetaInfo',
      type: 'meta'
    });
    const meta = this.state.meta_data[key];

    if (meta) {
      return meta;
    }
  }

  observeMeta(key) {
    const meta = this.state.meta_data[key];
    this.onReadState({
      key,
      callback: 'observeMeta',
      type: 'meta'
    });

    if (meta) {
      return meta.observe;
    }

    const row = this.formateRow({
      meta_value: ''
    });
    return row.observe;
  }

  deleteMeta(key) {
    delete this.state.meta_data[key];
    this.onUpdateState({
      key,
      callback: 'deleteMeta',
      type: 'meta'
    });
  }

  deleteMetas(keys) {
    for (let key of keys) {
      delete this.state.meta_data[key];
    }

    this.onUpdateState({
      key: false,
      callback: 'deleteMetas',
      type: 'meta'
    });
  }

  deleteAllMeta() {
    this.state.meta_data = {};
    this.onUpdateState({
      key: false,
      callback: 'deleteAllMeta',
      type: 'meta'
    });
  }

}

class DataRow extends MetaData {
  formateRow(row) {
    let observe = {};

    let _id = uid();

    if (row.observe) {
      _id = row._id;
      const prev_observe = row.observe();
      observe = { ...prev_observe,
        updated: Date.now()
      };
    } else {
      observe = {
        created: Date.now(),
        updated: Date.now()
      };
    }

    return { ...row,
      _id,
      observe: () => observe
    };
  }

  insert(tb, row) {
    if (!this.hasTable(tb) || !is_object(row)) return;
    row = this.formateRow(row);
    this.state.data[tb].rows.push(row);
    this.onUpdateState({
      key: tb,
      callback: 'insert',
      type: 'data'
    });
    return row;
  }

  insertAfter(tb, row, index) {
    if (!this.hasTable(tb) || !is_object(row)) return;
    row = this.formateRow(row);

    if (!isNaN(index) && typeof index === 'number') {
      this.state.data[tb].rows.splice(parseInt(index), 0, row);
    } else {
      this.state.data[tb].rows.push(row);
    }

    this.onUpdateState({
      key: tb,
      callback: 'insertAfter',
      type: 'data'
    });
    return row;
  }

  insertMany(tb, rows) {
    if (!this.hasTable(tb) || !is_array(rows)) return;
    const _rows = [];

    for (let row in rows) {
      row = this.formateRow(row);
      this.state.data[tb].rows.push(row);

      _rows.push(row);
    }

    this.onUpdateState({
      key: tb,
      callback: 'insertMany',
      type: 'data'
    });
    return _rows;
  }

  update(tb, row, where, cb = null) {
    this.query(tb, where, prevRow => {
      if (is_callable(cb)) {
        prevRow = cb(prevRow);
      }

      const fRow = this.formateRow(prevRow);
      return { ...fRow,
        ...row,
        _id: fRow._id
      };
    });
    this.onUpdateState({
      key: tb,
      callback: 'update',
      type: 'data'
    });
  }

  updateAll(tb, row, cb = null) {
    this.query(tb, '@', prevRow => {
      if (is_callable(cb)) {
        prevRow = cb(prevRow);
      }

      const fRow = this.formateRow(prevRow);
      return { ...fRow,
        ...row,
        _id: fRow._id
      };
    });
    this.onUpdateState({
      key: tb,
      callback: 'updateAll',
      type: 'data'
    });
  }

  move(tb, oldIdx, newIdx) {
    if (!this.hasTable(tb)) return;

    if (!isNaN(oldIdx) && !isNaN(newIdx) && typeof oldIdx === 'number' && typeof newIdx === 'number') {
      const row = this.state.data[tb].rows[oldIdx];

      if (row) {
        this.state.data[tb].rows.splice(oldIdx, 1);
        this.state.data[tb].rows.splice(newIdx, 0, row);
        this.onUpdateState({
          key: tb,
          callback: 'move',
          type: 'data'
        });
      }
    }
  }

  count(tb) {
    if (!this.hasTable(tb)) return;
    this.onReadState({
      key: tb,
      callback: 'count',
      type: 'data'
    });
    return this.state.data[tb].rows.length;
  }

  delete(tb, where) {
    this.query(tb, where, () => null);
    this.state.data[tb].rows = this.query(tb, '@');
    this.onUpdateState({
      key: tb,
      callback: 'delete',
      type: 'data'
    });
  }

  get(tb, where) {
    if (where === undefined || where === null) {
      return;
    }

    const data = this.query(tb, where);
    this.onReadState({
      key: tb,
      callback: 'get',
      type: 'data'
    });

    if (data.length && is_number(where)) {
      return data[0];
    } else if (data.length && is_string(where) && where.charAt(0) != '@') {
      return data[0];
    }

    return data.length ? data : false;
  }

  getIndex(tb, id) {
    if (!id) return;
    const data = this.queryNodes(tb, id);

    if (data && data.length) {
      this.onReadState({
        key: tb,
        callback: 'getIndex',
        type: 'data'
      });
      return data[0].path[1];
    }
  }

  getAll(tb) {
    this.onReadState({
      key: tb,
      callback: 'getAll',
      type: 'data'
    });
    return this.query(tb, '@');
  }

}

class DataTable extends DataRow {
  queryExpression(ex) {
    let _q;

    if (is_number(ex)) {
      _q = `$[${ex}]`;
    } else if (is_string(ex)) {
      if (ex.charAt(0) == '@') {
        _q = `$[?(${ex})]`;
      } else {
        _q = `$[?(@._id=='${ex}')]`;
      }
    } else if (is_object(ex)) {
      let _and = "";
      let fex = '';

      for (let k in ex) {
        let v = ex[k];

        if (is_string(ex[k])) {
          v = `'${ex[k]}'`;
        }

        fex += `${_and}@.${k}==${v}`;
        _and = '&&';
      }

      _q = `$[?(${fex})]`;
    } else {
      _q = `$[?(@)]`;
    }

    return _q;
  }

  query(tb, jpQuery, cb = null) {
    try {
      if (is_callable(cb)) {
        return jpath.apply(this.state.data[tb].rows, this.queryExpression(jpQuery), cb);
      }

      return jpath.query(this.state.data[tb].rows, this.queryExpression(jpQuery));
    } catch (err) {
      console.error("PARSE ERROR");
    }
  }

  queryNodes(tb, jpQuery) {
    try {
      return jpath.nodes(this.state.data[tb].rows, this.queryExpression(jpQuery));
    } catch (err) {
      console.error("PARSE ERROR");
    }
  }

  updateTableInfo(tb) {
    if (!this.hasTable(tb)) return;
    this.state.data[tb].info.updated = Date.now();
    this.state.data[tb].info.length = Object.keys(this.state.data[tb].rows).length;
  }

  createTable(tb) {
    this.state.data[tb] = {
      info: {
        created: Date.now(),
        updated: Date.now()
      },
      rows: []
    };
  }

  hasTable(tb) {
    return this.state.data[tb] ? true : false;
  }

  dropTable(tb) {
    delete this.state.data[tb];
  }

  tableInfo(tb) {
    return this.state.data[tb].info;
  }

  observeTable(tb) {
    return this.state.data[tb].info.updated;
  }

}

class Store extends DataTable {
  constructor(settings, intialState) {
    super();
    this.storeID = "_" + uid();
    this.state_info = {
      created: Date.now(),
      updated: Date.now()
    };
    this.settings = {
      tables: [],
      keys: {},
      methods: {},
      onUpdate: () => {},
      onRead: () => {}
    };
    this.assignableTableMethods = [{
      name: 'insert$table',
      method: 'insert'
    }, {
      name: 'insertAfter$table',
      method: 'insertAfter'
    }, {
      name: 'insertMany$table',
      method: 'insertMany'
    }, {
      name: 'update$table',
      method: 'update'
    }, {
      name: 'move$table',
      method: 'move'
    }, {
      name: 'count$table',
      method: 'count'
    }, {
      name: 'delete$table',
      method: 'delete'
    }, {
      name: 'get$table',
      method: 'get'
    }, {
      name: 'getAll$table',
      method: 'getAll'
    }, {
      name: 'get$tableIndex',
      method: 'getIndex'
    }, {
      name: '$tableTableInfo',
      method: 'tableInfo'
    }, {
      name: 'observe$table',
      method: 'observeTable'
    }];
    this.state = intialState;
    this.settingFormate(settings);
    this.assignTables();
    this.assignMethods();
    this.keys = this.settings.keys;
    this.tables = this.settings.tables;
  }

  settingFormate(settings) {
    for (let s in this.settings) {
      if (settings[s]) {
        this.settings[s] = settings[s];
      }
    }
  }

  assignTables() {
    const {
      tables
    } = this.settings;

    for (let tb of tables) {
      this.createTable(tb);

      for (let {
        name,
        method
      } of this.assignableTableMethods) {
        name = name.replace('$table', tb);

        if (!this[name]) {
          this[name] = (...args) => {
            return this[method](tb, ...args);
          };
        }
      }
    }
  }

  assignMethods() {
    const {
      methods
    } = this.settings;

    for (let name in methods) {
      if (!this[name] && is_callable(methods[name])) {
        this[name] = (...args) => {
          return methods[name].apply(this, args);
        };
      }
    }
  }

  storeInfo() {
    return this.state_info;
  }

  onUpdateState(info) {
    this.state_info.updated = Date.now();
    this.updateTableInfo(info.key);
    const {
      onUpdate
    } = this.settings;

    if (is_callable(onUpdate)) {
      onUpdate(info);
    }
  }

  onReadState(info) {
    const {
      onRead
    } = this.settings;

    if (is_callable(onRead)) {
      onRead(info);
    }
  }

  getKey(name) {
    const {
      keys
    } = this.settings;

    if (keys[name]) {
      return keys[name];
    }
  }

  getState() {
    let state = {
      data: {},
      meta_data: this.state.meta_data
    };

    for (let tb in this.state.data) {
      this.query(tb, '@', row => {
        delete row.info;
        delete row.isUpdate;
        return row;
      });
      state.data[tb] = this.query(tb, '@');
    }

    return state;
  }

}

const _rootStore = {
  store: null,
  configs: {}
};
const initialState = {
  data: {},
  meta_data: {}
};
const initRootStore = configs => {
  if (_rootStore.store) return;
  _rootStore.configs = configs;
  _rootStore.store = new Store({
    tables: ['Readables']
  }, initialState);
};
const getRootConfigs = () => {
  return _rootStore.configs;
};
const useRootStore = () => {
  return _rootStore.store;
};
const dispatchComponents = ({
  fromRoot,
  key,
  type
}) => {
  let readables = [];
  const rootStore = _rootStore.store;

  if (type === 'meta') {
    if (!key) {
      readables = rootStore.getReadables({
        type: 'meta'
      });
    } else {
      readables = rootStore.getReadables({
        type: 'meta',
        key
      });
    }
  } else if (type === 'data') {
    readables = rootStore.getReadables({
      type: 'data',
      key
    });
  }

  const dispatches = [];

  if (readables) {
    for (let readable of readables) {
      if (!dispatches.includes(readable.compId)) {
        if (readable.compId) {
          readable.dispatch();
        }

        dispatches.push(readable.compId);
      }
    }
  }
};
const insertReadable = ({
  storeId,
  key,
  type,
  dispatch
}) => {
  const rootStore = _rootStore.store;
  const exists = rootStore.getReadables({
    compId: storeId,
    key,
    type
  });

  if (!exists) {
    rootStore.insertReadables({
      dispatch: () => dispatch(Math.random()),
      compId: storeId,
      key,
      type
    });
  }
};
const deleteReadables = storeId => {
  const rootStore = _rootStore.store;
  rootStore.deleteReadables({
    compId: storeId
  });
};

const _stack = {
  store: null,
  configs: {}
};
var useStore = (() => {
  if (_stack.store) return _stack.store;
  const configs = getRootConfigs();
  _stack.store = new Store({ ...configs,
    onUpdate: ({
      key,
      type,
      callback,
      ...rest
    }) => {
      dispatchComponents({
        key,
        type
      });
    },
    onRead: () => {}
  }, initialState);
  return _stack.store;
});

const Render = ({
  Comp,
  ...props
}) => {
  const [, dispatch] = useState(Math.random().toString());
  const [store, setStore] = useState(false);
  const rootConfigs = getRootConfigs();
  useEffect(() => {
    let _store = store;

    if (!store) {
      _store = new Store({ ...rootConfigs,
        onUpdate: ({
          key,
          type,
          ...rest
        }) => {
          if (is_callable(rootConfigs.onUpdate)) {
            rootConfigs.onUpdate({
              key,
              type,
              ...rest
            });
          }

          dispatchComponents({
            key,
            type
          });
        },
        onRead: ({
          key,
          type,
          ...rest
        }) => {
          if (is_callable(rootConfigs.onRead)) {
            rootConfigs.onRead({
              key,
              type,
              ...rest
            });
          }

          insertReadable({
            storeId: _store.storeID,
            key,
            type,
            dispatch
          });
        }
      }, initialState);
      setStore(_store);
    }

    return () => {
      deleteReadables(_store.storeID);
    };
  }, []);

  if (!store) {
    return '';
  }

  return /*#__PURE__*/React.createElement(Comp, Object.assign({}, props, {
    store: store
  }));
};

var withStore = ((Comp, resolve) => {
  if (typeof resolve === 'function') {
    return props => {
      let store = useStore();
      let deps = resolve({ ...props,
        store
      });
      deps = deps ? deps : props;
      return useMemo(() => /*#__PURE__*/React.createElement(Render, Object.assign({}, deps, props, {
        Comp: Comp
      })), Object.values(deps));
    };
  }

  return props => /*#__PURE__*/React.createElement(Render, Object.assign({}, props, {
    Comp: Comp
  }));
});

const createStore = (Comp, configs) => {
  initRootStore(configs);
  return withStore(props => {
    return /*#__PURE__*/React.createElement(Comp, props);
  });
};

const useConfig = () => getRootConfigs();

const storeID = () => useRootStore().storeID;

export { createStore, in_array, is_array, is_callable, is_callback, is_define, is_null, is_number, is_object, is_string, storeID, uid, useConfig, useStore, withStore };
//# sourceMappingURL=index.modern.js.map
