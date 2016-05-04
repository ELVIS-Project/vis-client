/* */ 
"use strict";
const conversions = require('webidl-conversions');
const utils = require('./utils');
module.exports = {
  convertInherit(obj, ret) {
    let key,
        value;
    key = "behavior";
    value = obj === undefined || obj === null ? undefined : obj[key];
    if (value !== undefined) {
      ret[key] = (value);
    } else {
      ret[key] = "auto";
    }
  },
  convert(obj) {
    if (obj !== undefined && typeof obj !== "object") {
      throw new TypeError("Dictionary has to be an object");
    }
    if (obj instanceof Date || obj instanceof RegExp) {
      throw new TypeError("Dictionary may not be a Date or RegExp object");
    }
    const ret = Object.create(null);
    module.exports.convertInherit(obj, ret);
    return ret;
  }
};