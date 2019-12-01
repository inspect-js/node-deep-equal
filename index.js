var objectKeys = require('object-keys');
var isArguments = require('is-arguments');
var is = require('object-is');
var isRegex = require('is-regex');
var flags = require('regexp.prototype.flags');
var isArray = require('isarray');
var isDate = require('is-date-object');
var whichBoxedPrimitive = require('which-boxed-primitive');
var callBound = require('es-abstract/helpers/callBound');
var whichCollection = require('which-collection');
var getIterator = require('es-get-iterator');

var $getTime = callBound('Date.prototype.getTime');
var gPO = Object.getPrototypeOf;
var $objToString = callBound('Object.prototype.toString');

var $mapHas = callBound('Map.prototype.has', true);
var $mapGet = callBound('Map.prototype.get', true);
var $setHas = callBound('Set.prototype.has', true);

function internalDeepEqual(actual, expected, options, memos) {
  var opts = options || {};

  // 7.1. All identical values are equivalent, as determined by ===.
  if (opts.strict ? is(actual, expected) : actual === expected) {
    return true;
  }

  var actualBoxed = whichBoxedPrimitive(actual);
  var expectedBoxed = whichBoxedPrimitive(expected);
  if (actualBoxed !== expectedBoxed) {
    return false;
  }

  // 7.3. Other pairs that do not both pass typeof value == 'object', equivalence is determined by ==.
  if (!actual || !expected || (typeof actual !== 'object' && typeof expected !== 'object')) {
    if ((actual === false && expected) || (actual && expected === false)) { return false; }
    return opts.strict ? is(actual, expected) : actual == expected;
  }

  /*
   * 7.4. For all other Object pairs, including Array objects, equivalence is
   * determined by having the same number of owned properties (as verified
   * with Object.prototype.hasOwnProperty.call), the same set of keys
   * (although not necessarily the same order), equivalent values for every
   * corresponding key, and an identical 'prototype' property. Note: this
   * accounts for both named and indexed properties on Arrays.
   */
  // see https://github.com/nodejs/node/commit/d3aafd02efd3a403d646a3044adcf14e63a88d32 for memos inspiration

  var actualIndex = memos.actual.indexOf(actual);
  if (actualIndex !== -1) {
    if (actualIndex === memos.expected.indexOf(expected)) {
      return true;
    }
  }

  memos.actual.push(actual);
  memos.expected.push(expected);

  // eslint-disable-next-line no-use-before-define
  return objEquiv(actual, expected, opts, memos);
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isBuffer(x) {
  if (!x || typeof x !== 'object' || typeof x.length !== 'number') {
    return false;
  }
  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    return false;
  }
  if (x.length > 0 && typeof x[0] !== 'number') {
    return false;
  }
  return true;
}

function objEquiv(a, b, opts, memos) {
  /* eslint max-statements: [2, 100], max-lines-per-function: [2, 120], max-depth: [2, 5] */
  var i, key;

  if (typeof a !== typeof b) { return false; }
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) { return false; }

  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) { return false; }

  if ($objToString(a) !== $objToString(b)) { return false; }

  if (isArguments(a) !== isArguments(b)) { return false; }

  var aIsArray = isArray(a);
  var bIsArray = isArray(b);
  if (aIsArray !== bIsArray) { return false; }

  // TODO: replace when a cross-realm brand check is available
  var aIsError = a instanceof Error;
  var bIsError = b instanceof Error;
  if (aIsError !== bIsError) { return false; }
  if (aIsError || bIsError) {
    if (a.name !== b.name || a.message !== b.message) { return false; }
  }

  var aIsRegex = isRegex(a);
  var bIsRegex = isRegex(b);
  if (aIsRegex !== bIsRegex) { return false; }
  if (aIsRegex || bIsRegex) {
    return a.source === b.source && flags(a) === flags(b);
  }

  var aIsDate = isDate(a);
  var bIsDate = isDate(b);
  if (aIsDate !== bIsDate) { return false; }
  if (aIsDate || bIsDate) { // && would work too, because both are true or both false here
    if ($getTime(a) !== $getTime(b)) { return false; }
  }
  if (opts.strict && gPO && gPO(a) !== gPO(b)) { return false; }

  var aIsBuffer = isBuffer(a);
  var bIsBuffer = isBuffer(b);
  if (aIsBuffer !== bIsBuffer) { return false; }
  if (aIsBuffer || bIsBuffer) { // && would work too, because both are true or both false here
    if (a.length !== b.length) { return false; }
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) { return false; }
    }
    return true;
  }

  if (typeof a !== typeof b) { return false; }

  try {
    var ka = objectKeys(a);
    var kb = objectKeys(b);
  } catch (e) { // happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates hasOwnProperty)
  if (ka.length !== kb.length) { return false; }

  // the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  // ~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i]) { return false; }
  }

  // equivalent values for every corresponding key, and ~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!internalDeepEqual(a[key], b[key], opts, memos)) { return false; }
  }

  var aCollection = whichCollection(a);
  var bCollection = whichCollection(b);
  if (aCollection !== bCollection) {
    return false;
  }
  if (aCollection === 'Map' || aCollection === 'Set') {
    var iA = getIterator(a);
    var iB = getIterator(b);
    var resultA;
    var resultB;
    if (aCollection === 'Map') { // aCollection === bCollection
      var aWithBKey;
      var bWithAKey;
      while ((resultA = iA.next()) && (resultB = iB.next()) && !resultA.done && !resultB.done) {
        if (!$mapHas(a, resultB.value[0]) || !$mapHas(b, resultA.value[0])) { return false; }
        if (resultA.value[0] === resultB.value[0]) { // optimization: keys are the same, no need to look up values
          if (!internalDeepEqual(resultA.value[1], resultB.value[1], opts, memos)) { return false; }
        } else {
          aWithBKey = $mapGet(a, resultB.value[0]);
          bWithAKey = $mapGet(b, resultA.value[0]);
          if (
            !internalDeepEqual(resultA.value[1], bWithAKey, opts, memos)
            || !internalDeepEqual(resultB.value[1], aWithBKey, opts, memos)
          ) {
            return false;
          }
        }
      }
    } else if (aCollection === 'Set') { // aCollection === bCollection
      while ((resultA = iA.next()) && (resultB = iB.next()) && !resultA.done && !resultB.done) {
        if (!$setHas(a, resultB.value) || !$setHas(b, resultA.value)) { return false; }
      }
    }
    if (resultA && resultB && resultA.done !== resultB.done) {
      return false;
    }
  }

  return true;
}

module.exports = function deepEqual(a, b, opts) {
  return internalDeepEqual(a, b, opts, { actual: [], expected: [] });
};
