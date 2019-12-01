var test = require('tape');
require('./_tape');
var assign = require('object.assign');
var hasSymbols = require('has-symbols')();

test('equal', function (t) {
  t.deepEqualTest(
    { a: [2, 3], b: [4] },
    { a: [2, 3], b: [4] },
    'two equal objects',
    true,
    true,
    false
  );
  t.end();
});

test('not equal', function (t) {
  t.deepEqualTest(
    { x: 5, y: [6] },
    { x: 5, y: 6 },
    'two inequal objects are',
    false,
    false
  );
  t.end();
});

test('nested nulls', function (t) {
  t.deepEqualTest(
    [null, null, null],
    [null, null, null],
    'same-length arrays of nulls',
    true,
    true,
    true
  );
  t.end();
});

test('objects with strings vs numbers', function (t) {
  t.deepEqualTest(
    [{ a: 3 }, { b: 4 }],
    [{ a: '3' }, { b: '4' }],
    'objects with equivalent string/number values',
    true,
    false
  );
  t.end();
});

test('non-objects', function (t) {
  t.deepEqualTest(3, 3, 'same numbers', true, true, true);
  t.deepEqualTest('beep', 'beep', 'same strings', true, true, true);
  t.deepEqualTest('3', 3, 'numeric string and number', true, false);
  t.deepEqualTest('3', [3], 'numeric string and array containing number', false, false);
  t.deepEqualTest(3, [3], 'number and array containing number', false, false);

  t.end();
});

test('infinities', function (t) {
  t.deepEqualTest(Infinity, Infinity, '∞ and ∞', true, true, true);
  t.deepEqualTest(-Infinity, -Infinity, '-∞ and -∞', true, true, true);
  t.deepEqualTest(Infinity, -Infinity, '∞ and -∞', false, false);

  t.end();
});

test('arguments class', function (t) {
  function getArgs() {
    return arguments;
  }

  t.deepEqualTest(
    getArgs(1, 2, 3),
    getArgs(1, 2, 3),
    'equivalent arguments objects are equal',
    true,
    true,
    true
  );

  t.deepEqualTest(
    getArgs(1, 2, 3),
    [1, 2, 3],
    'array and arguments with same contents',
    false,
    false
  );

  t.end();
});

test('Dates', function (t) {
  var d0 = new Date(1387585278000);
  var d1 = new Date('Fri Dec 20 2013 16:21:18 GMT-0800 (PST)');

  t.deepEqualTest(d0, d1, 'two Dates with the same timestamp', true, true);

  d1.a = true;

  t.deepEqualTest(d0, d1, 'two Dates with the same timestamp but different own properties', false, false);

  t.test('overriding `getTime`', { skip: !Object.defineProperty }, function (st) {
    var a = new Date('2000');
    var b = new Date('2000');
    Object.defineProperty(a, 'getTime', { value: function () { return 5; } });
    st.deepEqualTest(a, b, 'two Dates with the same timestamp but one has overridden `getTime`', true, true);
    st.end();
  });

  t.end();
});

test('buffers', { skip: typeof Buffer !== 'function' }, function (t) {
  var safeBuffer = Buffer.from && Buffer.from.length > 1 ? Buffer.from : Buffer;
  /* eslint no-buffer-constructor: 1, new-cap: 1 */
  t.deepEqualTest(
    safeBuffer('xyz'),
    safeBuffer('xyz'),
    'buffers with same contents are equal',
    true,
    true,
    true
  );

  t.deepEqualTest(
    safeBuffer('abc'),
    safeBuffer('xyz'),
    'buffers with different contents',
    false,
    false
  );

  t.deepEqualTest(
    safeBuffer(''),
    [],
    'empty buffer and empty array',
    false,
    false
  );

  t.end();
});

test('booleans and arrays', function (t) {
  t.deepEqualTest(
    true,
    [],
    'true and an empty array',
    false,
    false
  );
  t.deepEqualTest(
    false,
    [],
    'false and an empty array',
    false,
    false
  );
  t.end();
});

test('arrays initiated', function (t) {
  var a0 = [
    undefined,
    null,
    -1,
    0,
    1,
    false,
    true,
    undefined,
    '',
    'abc',
    null,
    undefined
  ];
  var a1 = [
    undefined,
    null,
    -1,
    0,
    1,
    false,
    true,
    undefined,
    '',
    'abc',
    null,
    undefined
  ];

  t.deepEqualTest(
    a0,
    a1,
    'arrays with equal contents are equal',
    true,
    true,
    true
  );
  t.end();
});

test('arrays assigned', function (t) {
  var a0 = [
    undefined,
    null,
    -1,
    0,
    1,
    false,
    true,
    undefined,
    '',
    'abc',
    null,
    undefined
  ];
  var a1 = [];

  a1[0] = undefined;
  a1[1] = null;
  a1[2] = -1;
  a1[3] = 0;
  a1[4] = 1;
  a1[5] = false;
  a1[6] = true;
  a1[7] = undefined;
  a1[8] = '';
  a1[9] = 'abc';
  a1[10] = null;
  a1[11] = undefined;
  a1.length = 12;

  t.deepEqualTest(a0, a1, 'a literal array and an assigned array', true, true);
  t.end();
});

test('arrays push', function (t) {
  var a0 = [
      undefined,
      null,
      -1,
      0,
      1,
      false,
      true,
      undefined,
      '',
      'abc',
      null,
      undefined
    ],
    a1 = [];

  a1.push(undefined);
  a1.push(null);
  a1.push(-1);
  a1.push(0);
  a1.push(1);
  a1.push(false);
  a1.push(true);
  a1.push(undefined);
  a1.push('');
  a1.push('abc');
  a1.push(null);
  a1.push(undefined);
  a1.length = 12;

  t.deepEqualTest(a0, a1, 'a literal array and a pushed array', true, true);
  t.end();
});

test('null == undefined', function (t) {
  t.deepEqualTest(null, undefined, 'null and undefined', true, false);

  t.end();
});

test('NaNs', function (t) {
  t.deepEqualTest(
    NaN,
    NaN,
    'two NaNs',
    false,
    true
  );

  t.deepEqualTest(
    { a: NaN },
    { a: NaN },
    'two equiv objects with a NaN value',
    false,
    true
  );

  t.deepEqualTest(NaN, 1, 'NaN and 1', false, false);

  t.end();
});

test('zeroes', function (t) {
  t.deepEqualTest(0, -0, '0 and -0', true, false);

  t.deepEqualTest({ a: 0 }, { a: -0 }, 'two objects with a same-keyed 0/-0 value', true, false);

  t.end();
});

test('Object.create', { skip: !Object.create }, function (t) {
  var a = { a: 'A' };
  var b = Object.create(a);
  b.b = 'B';
  var c = Object.create(a);
  c.b = 'C';

  t.deepEqualTest(
    b,
    c,
    'two objects with the same [[Prototype]] but a different own property',
    false,
    false
  );

  t.end();
});

test('Object.create(null)', { skip: !Object.create }, function (t) {
  t.deepEqualTest(
    Object.create(null),
    Object.create(null),
    'two empty null objects',
    true,
    true,
    true
  );

  t.deepEqualTest(
    Object.create(null, { a: { value: 'b' } }),
    Object.create(null, { a: { value: 'b' } }),
    'two null objects with the same property pair',
    true,
    true,
    true
  );

  t.end();
});

test('regexes vs dates', function (t) {
  var d = new Date(1387585278000);
  var r = /abc/;

  t.deepEqualTest(d, r, 'Date and RegExp', false, false);

  t.end();
});

test('regexen', function (t) {
  t.deepEqualTest(/abc/, /xyz/, 'two different regexes', false, false);
  t.deepEqualTest(/abc/, /abc/, 'two abc regexes', true, true, false);
  t.deepEqualTest(/xyz/, /xyz/, 'two xyz regexes', true, true, false);

  t.end();
});

test('arrays and objects', function (t) {
  t.deepEqualTest([], {}, 'empty array and empty object', false, false);
  t.deepEqualTest([], { length: 0 }, 'empty array and empty arraylike object', false, false);
  t.deepEqualTest([1], { 0: 1 }, 'array and similar object', false, false);

  t.end();
});

test('functions', function (t) {
  function f() {}

  t.deepEqualTest(f, f, 'a function and itself', true, true, true);
  t.deepEqualTest(function () {}, function () {}, 'two distinct functions', false, false, true);

  t.end();
});

test('Errors', function (t) {
  t.deepEqualTest(new Error('xyz'), new Error('xyz'), 'two errors of the same type with the same message', true, true, false);
  t.deepEqualTest(new Error('xyz'), new TypeError('xyz'), 'two errors of different types with the same message', false, false);
  t.deepEqualTest(new Error('xyz'), new Error('zyx'), 'two errors of the same type with a different message', false, false);

  t.deepEqualTest(
    new Error('a'),
    assign(new Error('a'), { code: 10 }),
    'two otherwise equal errors with different own properties',
    false,
    false
  );

  t.end();
});

test('errors', function (t) {

  t.end();
});

test('error = Object', function (t) {
  t.deepEqualTest(
    new Error('a'),
    { message: 'a' },
    false,
    false
  );

  t.end();
});

test('[[Prototypes]]', { skip: !Object.getPrototypeOf }, function (t) {
  function C() {}
  var instance = new C();
  delete instance.constructor;

  t.deepEqualTest({}, instance, 'two identical objects with different [[Prototypes]]', true, false);

  t.test('Dates with different prototypes', { skip: !Object.setPrototypeOf }, function (st) {
    var d1 = new Date(0);
    var d2 = new Date(0);

    t.deepEqualTest(d1, d2, 'two dates with the same timestamp', true, true);

    var newProto = {};
    Object.setPrototypeOf(newProto, Date.prototype);
    Object.setPrototypeOf(d2, newProto);
    st.ok(d2 instanceof Date, 'd2 is still a Date instance after tweaking [[Prototype]]');

    t.deepEqualTest(d1, d2, 'two dates with the same timestamp and different [[Prototype]]', true, false);

    st.end();
  });

  t.end();
});

test('toStringTag', { skip: !hasSymbols || !Symbol.toStringTag }, function (t) {
  var o1 = {};
  t.equal(Object.prototype.toString.call(o1), '[object Object]', 'o1: Symbol.toStringTag works');

  var o2 = {};
  t.equal(Object.prototype.toString.call(o2), '[object Object]', 'o2: original Symbol.toStringTag works');

  t.deepEqualTest(o1, o2, 'two normal empty objects', true, true);

  o2[Symbol.toStringTag] = 'jifasnif';
  t.equal(Object.prototype.toString.call(o2), '[object jifasnif]', 'o2: modified Symbol.toStringTag works');

  t.deepEqualTest(o1, o2, 'two normal empty objects with different toStringTags', false, false);

  t.end();
});

test('boxed primitives', function (t) {
  t.deepEqualTest(Object(false), false, 'boxed and primitive `false`', false, false);
  t.deepEqualTest(Object(true), true, 'boxed and primitive `true`', false, false);
  t.deepEqualTest(Object(3), 3, 'boxed and primitive `3`', false, false);
  t.deepEqualTest(Object(NaN), NaN, 'boxed and primitive `NaN`', false, false);
  t.deepEqualTest(Object(''), '', 'boxed and primitive `""`', false, false);
  t.deepEqualTest(Object('str'), 'str', 'boxed and primitive `"str"`', false, false);

  t.test('symbol', { skip: !hasSymbols }, function (st) {
    var s = Symbol('');
    st.deepEqualTest(Object(s), s, 'boxed and primitive `Symbol()`', false, false);
    st.end();
  });

  t.test('bigint', { skip: typeof BigInt !== 'function' }, function (st) {
    var hhgtg = BigInt(42);
    st.deepEqualTest(Object(hhgtg), hhgtg, 'boxed and primitive `BigInt(42)`', false, false);
    st.end();
  });

  t.test('`valueOf` is called for boxed primitives', function (st) {
    var a = Object(5);
    a.valueOf = function () { throw new Error('failed'); };
    var b = Object(5);
    b.valueOf = function () { throw new Error('failed'); };

    st.deepEqualTest(a, b, 'two boxed numbers with a thrower valueOf', false, false);

    st.end();
  });

  t.end();
});

test('getters', { skip: !Object.defineProperty }, function (t) {
  var a = {};
  Object.defineProperty(a, 'a', { enumerable: true, get: function () { return 5; } });
  var b = {};
  Object.defineProperty(b, 'a', { enumerable: true, get: function () { return 6; } });

  t.deepEqualTest(a, b, 'two objects with the same getter but producing different values', false, false);

  t.end();
});

var isAssertAndNode1321 = process.env.ASSERT && process.version.replace(/^v/g, '').replace(/[^.]+(?:.)?/g, function (x, i) { return x * Math.pow(10, i); }) <= '1320000';
// eslint-disable-next-line no-proto
test('fake arrays: extra keys will be tested', { skip: [].__proto__ !== Array.prototype || isAssertAndNode1321 }, function (t) {
  var a = {
    __proto__: Array.prototype,
    0: 1,
    1: 1,
    2: 'broken',
    length: 2
  };
  if (hasSymbols) {
    Object.defineProperty(a, Symbol.toStringTag, {
      value: 'Array'
    });
  }
  if (Object.defineProperty) {
    Object.defineProperty(a, 'length', {
      enumerable: false
    });
  }

  t.deepEqualTest(a, [1, 1], 'fake and real array with same contents and [[Prototype]]', false, false);
  t.end();
});
