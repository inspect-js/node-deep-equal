export var objectKeys = typeof Object.keys === 'function'
  ? Object.keys : shim;

export function shim (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}
