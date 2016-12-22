//DecoderRing.js

module.exports = doit;

var END_OF_INPUT = -1;

var arrChrs = new Array("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/");
/** @type {Array} */
var reversegetFChars = new Array;
/** @type {number} */
var i = 0;
for (;i < arrChrs.length;i++) {
  /** @type {number} */
  reversegetFChars[arrChrs[i]] = i;
}
var getFStr;
var getFCount;
/**
 * @param {(number|string)} code
 * @return {?}
 */
function ntos(code) {
  code = code.toString(16);
  if (code.length == 1) {
    /** @type {string} */
    code = "0" + code;
  }
  /** @type {string} */
  code = "%" + code;
  return unescape(code);
}
/**
 * @return {?}
 */
function readReversegetF() {
  if (!getFStr) {
    return END_OF_INPUT;
  }
  for (;true;) {
    if (getFCount >= getFStr.length) {
      return END_OF_INPUT;
    }
    var cp = getFStr.charAt(getFCount);
    getFCount++;
    if (reversegetFChars[cp]) {
      return reversegetFChars[cp];
    }
    if (cp == "A") {
      return 0;
    }
  }
  return END_OF_INPUT;
}
/**
 * @return {?}
 */
function readgetF() {
  if (!getFStr) {
    return END_OF_INPUT;
  }
  if (getFCount >= getFStr.length) {
    return END_OF_INPUT;
  }
  /** @type {number} */
  var readgetF = getFStr.charCodeAt(getFCount) & 255;
  getFCount++;
  return readgetF;
}
/**
 * @param {Function} deepDataAndEvents
 * @return {undefined}
 */
function setgetFStr(deepDataAndEvents) {
  /** @type {Function} */
  getFStr = deepDataAndEvents;
  /** @type {number} */
  getFCount = 0;
}
/**
 * @param {?} deepDataAndEvents
 * @return {?}
 */
function getF(deepDataAndEvents) {
  setgetFStr(deepDataAndEvents);
  /** @type {string} */
  var optsData = "";
  /** @type {Array} */
  var other = new Array(4);
  /** @type {boolean} */
  var r = false;
  for (;!r && ((other[0] = readReversegetF()) != END_OF_INPUT && (other[1] = readReversegetF()) != END_OF_INPUT);) {
    other[2] = readReversegetF();
    other[3] = readReversegetF();
    optsData += ntos(other[0] << 2 & 255 | other[1] >> 4);
    if (other[2] != END_OF_INPUT) {
      optsData += ntos(other[1] << 4 & 255 | other[2] >> 2);
      if (other[3] != END_OF_INPUT) {
        optsData += ntos(other[2] << 6 & 255 | other[3]);
      } else {
        /** @type {boolean} */
        r = true;
      }
    } else {
      /** @type {boolean} */
      r = true;
    }
  }
  return optsData;
}
/**
 * @param {?} deepDataAndEvents
 * @return {?}
 */
function doit(deepDataAndEvents) {
  return unescape(getF(getF(deepDataAndEvents)));
}
;