"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moon = function (data, self, persistedState) {
    var _self = self;
    // States default
    var _data = data;
    // States of proxy type
    var _data_proxy = {};
    // Callback of watch
    var _callback = {};
    // Set States
    var $_set = function (obj, key) {
        // If set, specify the key name，only update or add corresponding key value
        if (key) {
            _data_proxy[key] = obj;
        }
        else {
            Object.keys(obj).map(function (key) {
                _data_proxy[key] = obj[key];
            });
        }
    };
    var $_watch = function (key, cb, immediate) {
        var _a;
        if (immediate === void 0) { immediate = false; }
        _callback = Object.assign({}, _callback, (_a = {},
            _a[key] = _callback[key] || [],
            _a));
        // 一个组件周期内一个队象限制一个watch，限制watch粒度
        _callback[key] = [cb];
        // (_callback as any)[key].push(cb)
        _data_proxy = new Proxy(_data, {
            get: function (target, name, receiver) {
                return Reflect.get(target, name, receiver);
            },
            set: function (target, name, value, receiver) {
                if (Array.isArray(_callback[name])) {
                    _callback[name].map(function (func) { return func(value, _data[name]); });
                }
                return Reflect.set(target, name, value, receiver);
            }
        });
        // Trigger listening during initialization
        immediate && $_set(_data_proxy);
        // Persistence
        if (persistedState) {
            sessionStorage.getItem("moon") && $_set(JSON.parse(sessionStorage.getItem("moon")));
            window.addEventListener("beforeunload", function () {
                sessionStorage.setItem("moon", JSON.stringify($_getData()));
            });
        }
    };
    // Get States
    var $_getData = function (key) {
        return key ? _data[key] : _data;
    };
    if (_self) {
        _self.$_set = $_set;
        _self.$_watch = $_watch;
        _self.$_getData = $_getData;
    }
    return {
        $_set: $_set,
        $_watch: $_watch,
        $_getData: $_getData
    };
};
exports.default = moon;
