(function(undefined) {
  "use strict";
  //
  // Environment Check
  //
  // root == window **Client-side**, root == global **Server-side**
  if (typeof(JsEnv) === "undefined" && typeof(require) === "function") { require("JsEnv").exportGlobally(); }

  var root = JsEnv.globalScope,
      window = root.window,
      includedModules = {};

  /********\
  * Logger *
  \********/


  var Logger = {
    log: function(level, args) {
      var a = Array.prototype.slice.call(args);
      a.unshift("[" + Date() + (root.process ? (" " + process.pid) : "") + "] " + level.toUpperCase() + ": ");
      level = (level === "debug" ? "log" : level);
      if (console[level].apply) {
        console[level].apply(console, a);
      } else {
        console[level](a.join(" "));
      }
    },
    info: function() { this.log("log", arguments); },
    warn: function() { this.log("warn", arguments); },
    error: function() {
      var a = Array.prototype.slice.call(arguments);
      if (JsEnv.DEVELOPMENT) {
        if (root.printStackTrace) {
          a.push(printStackTrace().join("\n\n"));
          // Returns stacktrace from custom error
          // printStackTrace({e: lastError});
        } else {
        // NOTE - This is a cheap way to get stacktrace in Chrome, prefer printStackTrace)
          if (a.length === 1 && a[0] && a[0].stack) { a.push(a[0].stack); }
        }
      }
      this.log("error", a);
    },
    debug: function() {
      if (JsEnv.DEVELOPMENT || JsEnv.DEBUG) {
        this.log("debug", arguments);
      }
    },
  }

  //
  // Export
  //

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Logger;
    }
    exports.Logger = Logger;
  } else if (window) {
    window.Logger = Logger;
  } else {
    this.Logger = Logger;
  }
}).call(this);
