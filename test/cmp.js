var test = require('tape');
var equal = require('../');

test('equal', function (t) {
  t.ok(equal(
    { a: [2, 3], b: [4] },
    { a: [2, 3], b: [4] }
  ));
  t.end();
});

test('not equal', function (t) {
  t.notOk(equal(
    { x: 5, y: [6] },
    { x: 5, y: 6 }
  ));
  t.end();
});

test('nested nulls', function (t) {
  t.ok(equal([null, null, null], [null, null, null]));
  t.end();
});

test('strict equal', function (t) {
  t.notOk(equal(
    [{ a: 3 }, { b: 4 }],
    [{ a: '3' }, { b: '4' }],
    { strict: true }
  ));
  t.end();
});

test('non-objects', function (t) {
  t.ok(equal(3, 3));
  t.ok(equal('beep', 'beep'));
  t.ok(equal('3', 3));
  t.notOk(equal('3', 3, { strict: true }));
  t.notOk(equal('3', [3]));
  t.end();
});

test('arguments class', function (t) {
  function getArgs() {
    return arguments;
  }
  t.ok(
    equal(getArgs(1, 2, 3), getArgs(1, 2, 3)),
    'compares arguments'
  );

  t.notOk(
    equal(getArgs(1, 2, 3), [1, 2, 3]),
    'differentiates array and arguments'
  );

  t.notOk(
    equal([1, 2, 3], getArgs(1, 2, 3)),
    'differentiates arguments and array'
  );

  t.end();
});

test('dates', function (t) {
  var d0 = new Date(1387585278000);
  var d1 = new Date('Fri Dec 20 2013 16:21:18 GMT-0800 (PST)');
  t.ok(equal(d0, d1));
  t.end();
});

test('buffers', function (t) {
  /* eslint no-buffer-constructor: 1, new-cap: 1 */
  t.ok(equal(Buffer('xyz'), Buffer('xyz')));
  t.end();
});

test('booleans and arrays', function (t) {
  t.notOk(equal(true, []));
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
    ],
    a1 = [
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

  t.ok(equal(a0, a1));
  t.end();
});

// eslint-disable-next-line max-statements
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
    ],
    a1 = [];

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

  t.ok(equal(a0, a1));
  t.end();
});

// eslint-disable-next-line max-statements
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

  t.ok(equal(a0, a1));
  t.end();
});

test('null == undefined', function (t) {
  t.ok(equal(null, undefined));
  t.notOk(equal(null, undefined, { strict: true }));
  t.end();
});
