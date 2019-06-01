var supportsArgumentsClass = (function(){
  return Object.prototype.toString.call(arguments)
})() == '[object Arguments]';

export function supported(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

export function unsupported(object) {
  return object &&
    typeof object == 'object' &&
    typeof object.length == 'number' &&
    Object.prototype.hasOwnProperty.call(object, 'callee') &&
    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
    false;
}

export var isArguments = supportsArgumentsClass ? supported : unsupported;
