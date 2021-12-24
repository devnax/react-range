import React, { useMemo, useState, useEffect } from 'react';
import jpath from 'jsonpath';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var uid = function uid() {
  return Math.random().toString(36).substring(2);
};
var is_object = function is_object(val, or) {
  if (or === void 0) {
    or = false;
  }

  return typeof val === 'object' && val !== null && !Array.isArray(val) ? val : or;
};
var is_array = function is_array(val, or) {
  if (or === void 0) {
    or = false;
  }

  return typeof val === 'object' && Array.isArray(val) ? val : or;
};
var in_array = function in_array(item, arr, or) {
  if (or === void 0) {
    or = false;
  }

  return is_array(arr) && arr.indexOf(item) != -1 ? true : or;
};
var is_string = function is_string(val, or) {
  if (or === void 0) {
    or = false;
  }

  return typeof val === 'string' ? true : or;
};
var is_number = function is_number(val, or) {
  if (or === void 0) {
    or = false;
  }

  return typeof val === 'number' ? true : or;
};
var is_callback = function is_callback(val, or) {
  if (or === void 0) {
    or = false;
  }

  return typeof val === 'function' ? val : or;
};
var is_callable = function is_callable(val, or) {
  if (or === void 0) {
    or = false;
  }

  return typeof val === 'function' ? val : or;
};
var is_define = function is_define(val, or) {
  if (or === void 0) {
    or = false;
  }

  return typeof val !== 'undefined' ? val : or;
};
var is_null = function is_null(val, or) {
  if (or === void 0) {
    or = false;
  }

  return val === null ? true : or;
};

var MetaData = /*#__PURE__*/function () {
  function MetaData() {}

  var _proto = MetaData.prototype;

  _proto.addMeta = function addMeta(key, data) {
    this.state.meta_data[key] = this.formateRow({
      meta_value: data
    });
    this.onUpdateState({
      key: key,
      callback: 'addMeta',
      type: 'meta'
    });
  };

  _proto.addMetas = function addMetas(metas) {
    if (!is_object(metas)) {
      return;
    }

    for (var key in metas) {
      var data = metas[key];
      this.state.meta_data[key] = this.formateRow({
        meta_value: data
      });
    }

    this.onUpdateState({
      key: false,
      callback: 'addMetas',
      type: 'meta'
    });
  };

  _proto.useMeta = function useMeta(key, def) {
    var _this = this;

    return [this.getMeta(key, def), function (value) {
      _this.addMeta(key, value);
    }];
  };

  _proto.getMeta = function getMeta(key, def) {
    this.onReadState({
      key: key,
      callback: 'getMeta',
      type: 'meta'
    });
    var meta = this.state.meta_data[key];

    if (meta) {
      return meta.meta_value;
    }

    return def;
  };

  _proto.getMetas = function getMetas(keys, def) {
    this.onReadState({
      key: false,
      callback: 'getMetas',
      type: 'meta'
    });

    if (!is_array(keys)) {
      return;
    }

    var metas = {};

    for (var _iterator = _createForOfIteratorHelperLoose(keys), _step; !(_step = _iterator()).done;) {
      var key = _step.value;
      metas[key] = this.state.meta_data[key] || def;
    }

    return metas;
  };

  _proto.getAllMeta = function getAllMeta() {
    this.onReadState({
      key: false,
      callback: 'getAllMeta',
      type: 'meta'
    });
    return this.state.meta_data;
  };

  _proto.getMetaInfo = function getMetaInfo(key) {
    this.onReadState({
      key: key,
      callback: 'getMetaInfo',
      type: 'meta'
    });
    var meta = this.state.meta_data[key];

    if (meta) {
      return meta;
    }
  };

  _proto.observeMeta = function observeMeta(key) {
    var meta = this.state.meta_data[key];
    this.onReadState({
      key: key,
      callback: 'observeMeta',
      type: 'meta'
    });

    if (meta) {
      return meta.observe;
    }

    var row = this.formateRow({
      meta_value: ''
    });
    return row.observe;
  };

  _proto.deleteMeta = function deleteMeta(key) {
    delete this.state.meta_data[key];
    this.onUpdateState({
      key: key,
      callback: 'deleteMeta',
      type: 'meta'
    });
  };

  _proto.deleteMetas = function deleteMetas(keys) {
    for (var _iterator2 = _createForOfIteratorHelperLoose(keys), _step2; !(_step2 = _iterator2()).done;) {
      var key = _step2.value;
      delete this.state.meta_data[key];
    }

    this.onUpdateState({
      key: false,
      callback: 'deleteMetas',
      type: 'meta'
    });
  };

  _proto.deleteAllMeta = function deleteAllMeta() {
    this.state.meta_data = {};
    this.onUpdateState({
      key: false,
      callback: 'deleteAllMeta',
      type: 'meta'
    });
  };

  return MetaData;
}();

var DataRow = /*#__PURE__*/function (_MetaData) {
  _inheritsLoose(DataRow, _MetaData);

  function DataRow() {
    return _MetaData.apply(this, arguments) || this;
  }

  var _proto = DataRow.prototype;

  _proto.formateRow = function formateRow(row) {
    var _observe = {};

    var _id = uid();

    if (row.observe) {
      _id = row._id;
      var prev_observe = row.observe();
      _observe = _extends({}, prev_observe, {
        updated: Date.now()
      });
    } else {
      _observe = {
        created: Date.now(),
        updated: Date.now()
      };
    }

    return _extends({}, row, {
      _id: _id,
      observe: function observe() {
        return _observe;
      }
    });
  };

  _proto.insert = function insert(tb, row) {
    if (!this.hasTable(tb) || !is_object(row)) return;
    row = this.formateRow(row);
    this.state.data[tb].rows.push(row);
    this.onUpdateState({
      key: tb,
      callback: 'insert',
      type: 'data'
    });
    return row;
  };

  _proto.insertAfter = function insertAfter(tb, row, index) {
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
  };

  _proto.insertMany = function insertMany(tb, rows) {
    if (!this.hasTable(tb) || !is_array(rows)) return;
    var _rows = [];

    for (var row in rows) {
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
  };

  _proto.update = function update(tb, row, where, cb) {
    var _this = this;

    if (cb === void 0) {
      cb = null;
    }

    this.query(tb, where, function (prevRow) {
      if (is_callable(cb)) {
        prevRow = cb(prevRow);
      }

      var fRow = _this.formateRow(prevRow);

      return _extends({}, fRow, row, {
        _id: fRow._id
      });
    });
    this.onUpdateState({
      key: tb,
      callback: 'update',
      type: 'data'
    });
  };

  _proto.updateAll = function updateAll(tb, row, cb) {
    var _this2 = this;

    if (cb === void 0) {
      cb = null;
    }

    this.query(tb, '@', function (prevRow) {
      if (is_callable(cb)) {
        prevRow = cb(prevRow);
      }

      var fRow = _this2.formateRow(prevRow);

      return _extends({}, fRow, row, {
        _id: fRow._id
      });
    });
    this.onUpdateState({
      key: tb,
      callback: 'updateAll',
      type: 'data'
    });
  };

  _proto.move = function move(tb, oldIdx, newIdx) {
    if (!this.hasTable(tb)) return;

    if (!isNaN(oldIdx) && !isNaN(newIdx) && typeof oldIdx === 'number' && typeof newIdx === 'number') {
      var row = this.state.data[tb].rows[oldIdx];

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
  };

  _proto.count = function count(tb) {
    if (!this.hasTable(tb)) return;
    this.onReadState({
      key: tb,
      callback: 'count',
      type: 'data'
    });
    return this.state.data[tb].rows.length;
  };

  _proto["delete"] = function _delete(tb, where) {
    this.query(tb, where, function () {
      return null;
    });
    this.state.data[tb].rows = this.query(tb, '@');
    this.onUpdateState({
      key: tb,
      callback: 'delete',
      type: 'data'
    });
  };

  _proto.get = function get(tb, where) {
    if (where === undefined || where === null) {
      return;
    }

    var data = this.query(tb, where);
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
  };

  _proto.getIndex = function getIndex(tb, id) {
    if (!id) return;
    var data = this.queryNodes(tb, id);

    if (data && data.length) {
      this.onReadState({
        key: tb,
        callback: 'getIndex',
        type: 'data'
      });
      return data[0].path[1];
    }
  };

  _proto.getAll = function getAll(tb) {
    this.onReadState({
      key: tb,
      callback: 'getAll',
      type: 'data'
    });
    return this.query(tb, '@');
  };

  return DataRow;
}(MetaData);

var DataTable = /*#__PURE__*/function (_DataRow) {
  _inheritsLoose(DataTable, _DataRow);

  function DataTable() {
    return _DataRow.apply(this, arguments) || this;
  }

  var _proto = DataTable.prototype;

  _proto.queryExpression = function queryExpression(ex) {
    var _q;

    if (is_number(ex)) {
      _q = "$[" + ex + "]";
    } else if (is_string(ex)) {
      if (ex.charAt(0) == '@') {
        _q = "$[?(" + ex + ")]";
      } else {
        _q = "$[?(@._id=='" + ex + "')]";
      }
    } else if (is_object(ex)) {
      var _and = "";
      var fex = '';

      for (var k in ex) {
        var v = ex[k];

        if (is_string(ex[k])) {
          v = "'" + ex[k] + "'";
        }

        fex += _and + "@." + k + "==" + v;
        _and = '&&';
      }

      _q = "$[?(" + fex + ")]";
    } else {
      _q = "$[?(@)]";
    }

    return _q;
  };

  _proto.query = function query(tb, jpQuery, cb) {
    if (cb === void 0) {
      cb = null;
    }

    try {
      if (is_callable(cb)) {
        return jpath.apply(this.state.data[tb].rows, this.queryExpression(jpQuery), cb);
      }

      return jpath.query(this.state.data[tb].rows, this.queryExpression(jpQuery));
    } catch (err) {
      console.error("PARSE ERROR");
    }
  };

  _proto.queryNodes = function queryNodes(tb, jpQuery) {
    try {
      return jpath.nodes(this.state.data[tb].rows, this.queryExpression(jpQuery));
    } catch (err) {
      console.error("PARSE ERROR");
    }
  };

  _proto.updateTableInfo = function updateTableInfo(tb) {
    if (!this.hasTable(tb)) return;
    this.state.data[tb].info.updated = Date.now();
    this.state.data[tb].info.length = Object.keys(this.state.data[tb].rows).length;
  };

  _proto.createTable = function createTable(tb) {
    this.state.data[tb] = {
      info: {
        created: Date.now(),
        updated: Date.now()
      },
      rows: []
    };
  };

  _proto.hasTable = function hasTable(tb) {
    return this.state.data[tb] ? true : false;
  };

  _proto.dropTable = function dropTable(tb) {
    delete this.state.data[tb];
  };

  _proto.tableInfo = function tableInfo(tb) {
    return this.state.data[tb].info;
  };

  _proto.observeTable = function observeTable(tb) {
    return this.state.data[tb].info.updated;
  };

  return DataTable;
}(DataRow);

var Store = /*#__PURE__*/function (_DataTable) {
  _inheritsLoose(Store, _DataTable);

  function Store(settings, intialState) {
    var _this;

    _this = _DataTable.call(this) || this;
    _this.storeID = "_" + uid();
    _this.state_info = {
      created: Date.now(),
      updated: Date.now()
    };
    _this.settings = {
      tables: [],
      keys: {},
      methods: {},
      onUpdate: function onUpdate() {},
      onRead: function onRead() {}
    };
    _this.assignableTableMethods = [{
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
    _this.state = intialState;

    _this.settingFormate(settings);

    _this.assignTables();

    _this.assignMethods();

    _this.keys = _this.settings.keys;
    _this.tables = _this.settings.tables;
    return _this;
  }

  var _proto = Store.prototype;

  _proto.settingFormate = function settingFormate(settings) {
    for (var s in this.settings) {
      if (settings[s]) {
        this.settings[s] = settings[s];
      }
    }
  };

  _proto.assignTables = function assignTables() {
    var _this2 = this;

    var tables = this.settings.tables;

    var _loop = function _loop() {
      var tb = _step.value;

      _this2.createTable(tb);

      var _loop2 = function _loop2() {
        var _step2$value = _step2.value,
            name = _step2$value.name,
            method = _step2$value.method;
        name = name.replace('$table', tb);

        if (!_this2[name]) {
          _this2[name] = function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return _this2[method].apply(_this2, [tb].concat(args));
          };
        }
      };

      for (var _iterator2 = _createForOfIteratorHelperLoose(_this2.assignableTableMethods), _step2; !(_step2 = _iterator2()).done;) {
        _loop2();
      }
    };

    for (var _iterator = _createForOfIteratorHelperLoose(tables), _step; !(_step = _iterator()).done;) {
      _loop();
    }
  };

  _proto.assignMethods = function assignMethods() {
    var _this3 = this;

    var methods = this.settings.methods;

    var _loop3 = function _loop3(name) {
      if (!_this3[name] && is_callable(methods[name])) {
        _this3[name] = function () {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return methods[name].apply(_this3, args);
        };
      }
    };

    for (var name in methods) {
      _loop3(name);
    }
  };

  _proto.storeInfo = function storeInfo() {
    return this.state_info;
  };

  _proto.onUpdateState = function onUpdateState(info) {
    this.state_info.updated = Date.now();
    this.updateTableInfo(info.key);
    var onUpdate = this.settings.onUpdate;

    if (is_callable(onUpdate)) {
      onUpdate(info);
    }
  };

  _proto.onReadState = function onReadState(info) {
    var onRead = this.settings.onRead;

    if (is_callable(onRead)) {
      onRead(info);
    }
  };

  _proto.getKey = function getKey(name) {
    var keys = this.settings.keys;

    if (keys[name]) {
      return keys[name];
    }
  };

  _proto.getState = function getState() {
    var state = {
      data: {},
      meta_data: this.state.meta_data
    };

    for (var tb in this.state.data) {
      this.query(tb, '@', function (row) {
        delete row.info;
        delete row.isUpdate;
        return row;
      });
      state.data[tb] = this.query(tb, '@');
    }

    return state;
  };

  return Store;
}(DataTable);

var _rootStore = {
  store: null,
  configs: {}
};
var initialState = {
  data: {},
  meta_data: {}
};
var initRootStore = function initRootStore(configs) {
  if (_rootStore.store) return;
  _rootStore.configs = configs;
  _rootStore.store = new Store({
    tables: ['Readables']
  }, initialState);
};
var getRootConfigs = function getRootConfigs() {
  return _rootStore.configs;
};
var useRootStore = function useRootStore() {
  return _rootStore.store;
};
var dispatchComponents = function dispatchComponents(_ref) {
  var key = _ref.key,
      type = _ref.type;
  var readables = [];
  var rootStore = _rootStore.store;

  if (type === 'meta') {
    if (!key) {
      readables = rootStore.getReadables({
        type: 'meta'
      });
    } else {
      readables = rootStore.getReadables({
        type: 'meta',
        key: key
      });
    }
  } else if (type === 'data') {
    readables = rootStore.getReadables({
      type: 'data',
      key: key
    });
  }

  var dispatches = [];

  if (readables) {
    for (var _iterator = _createForOfIteratorHelperLoose(readables), _step; !(_step = _iterator()).done;) {
      var readable = _step.value;

      if (!dispatches.includes(readable.compId)) {
        if (readable.compId) {
          readable.dispatch();
        }

        dispatches.push(readable.compId);
      }
    }
  }
};
var insertReadable = function insertReadable(_ref2) {
  var storeId = _ref2.storeId,
      key = _ref2.key,
      type = _ref2.type,
      _dispatch = _ref2.dispatch;
  var rootStore = _rootStore.store;
  var exists = rootStore.getReadables({
    compId: storeId,
    key: key,
    type: type
  });

  if (!exists) {
    rootStore.insertReadables({
      dispatch: function dispatch() {
        return _dispatch(Math.random());
      },
      compId: storeId,
      key: key,
      type: type
    });
  }
};
var deleteReadables = function deleteReadables(storeId) {
  var rootStore = _rootStore.store;
  rootStore.deleteReadables({
    compId: storeId
  });
};

var _excluded = ["key", "type", "callback"];
var _stack = {
  store: null,
  configs: {}
};
var useStore = (function () {
  if (_stack.store) return _stack.store;
  var configs = getRootConfigs();
  _stack.store = new Store(_extends({}, configs, {
    onUpdate: function onUpdate(_ref) {
      var key = _ref.key,
          type = _ref.type,
          rest = _objectWithoutPropertiesLoose(_ref, _excluded);

      dispatchComponents({
        key: key,
        type: type
      });
    },
    onRead: function onRead() {}
  }), initialState);
  return _stack.store;
});

var _excluded$1 = ["Comp"],
    _excluded2 = ["key", "type"],
    _excluded3 = ["key", "type"];

var Render = function Render(_ref) {
  var Comp = _ref.Comp,
      props = _objectWithoutPropertiesLoose(_ref, _excluded$1);

  var _useState = useState(Math.random().toString()),
      dispatch = _useState[1];

  var _useState2 = useState(false),
      store = _useState2[0],
      setStore = _useState2[1];

  var rootConfigs = getRootConfigs();
  useEffect(function () {
    var _store = store;

    if (!store) {
      _store = new Store(_extends({}, rootConfigs, {
        onUpdate: function onUpdate(_ref2) {
          var key = _ref2.key,
              type = _ref2.type,
              rest = _objectWithoutPropertiesLoose(_ref2, _excluded2);

          if (is_callable(rootConfigs.onUpdate)) {
            rootConfigs.onUpdate(_extends({
              key: key,
              type: type
            }, rest));
          }

          dispatchComponents({
            key: key,
            type: type
          });
        },
        onRead: function onRead(_ref3) {
          var key = _ref3.key,
              type = _ref3.type,
              rest = _objectWithoutPropertiesLoose(_ref3, _excluded3);

          if (is_callable(rootConfigs.onRead)) {
            rootConfigs.onRead(_extends({
              key: key,
              type: type
            }, rest));
          }

          insertReadable({
            storeId: _store.storeID,
            key: key,
            type: type,
            dispatch: dispatch
          });
        }
      }), initialState);
      setStore(_store);
    }

    return function () {
      deleteReadables(_store.storeID);
    };
  }, []);

  if (!store) {
    return '';
  }

  return /*#__PURE__*/React.createElement(Comp, _extends({}, props, {
    store: store
  }));
};

var withStore = (function (Comp, resolve) {
  if (typeof resolve === 'function') {
    return function (props) {
      var store = useStore();
      var deps = resolve(_extends({}, props, {
        store: store
      }));
      deps = deps ? deps : props;
      return useMemo(function () {
        return /*#__PURE__*/React.createElement(Render, _extends({}, deps, props, {
          Comp: Comp
        }));
      }, Object.values(deps));
    };
  }

  return function (props) {
    return /*#__PURE__*/React.createElement(Render, _extends({}, props, {
      Comp: Comp
    }));
  };
});

var createStore = function createStore(Comp, configs) {
  initRootStore(configs);
  return withStore(function (props) {
    return /*#__PURE__*/React.createElement(Comp, props);
  });
};

var useConfig = function useConfig() {
  return getRootConfigs();
};

var storeID = function storeID() {
  return useRootStore().storeID;
};

export { createStore, in_array, is_array, is_callable, is_callback, is_define, is_null, is_number, is_object, is_string, storeID, uid, useConfig, useStore, withStore };
//# sourceMappingURL=index.modern.js.map
