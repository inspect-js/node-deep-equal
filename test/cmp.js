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
  t.ok(equal(3, 3, { strict: true }));
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

test('null == undefined', function (t) {
  t.ok(equal(null, undefined), 'null == undefined');
  t.ok(equal(undefined, null), 'undefined == null');
  t.notOk(equal(null, undefined, { strict: true }), 'null !== undefined');
  t.notOk(equal(undefined, null, { strict: true }), 'undefined !== null');
  t.end();
});

test('NaNs', function (t) {
  t.notOk(equal(NaN, NaN), 'NaN is not NaN');
  t.ok(equal(NaN, NaN, { strict: true }), 'strict: NaN is NaN');

  t.notOk(equal({ a: NaN }, { a: NaN }), 'two equiv objects with a NaN value are not equiv');
  t.ok(equal({ a: NaN }, { a: NaN }, { strict: true }), 'strict: two equiv objects with a NaN value are equiv');

  t.notOk(equal(NaN, 1), 'NaN !== 1');
  t.notOk(equal(NaN, 1, { strict: true }), 'strict: NaN !== 1');

  t.end();
});

test('zeroes', function (t) {
  t.ok(equal(0, -0), '0 is -0');
  t.ok(equal(-0, 0), '-0 is 0');

  t.notOk(equal(0, -0, { strict: true }), 'strict: 0 is -0');
  t.notOk(equal(-0, 0, { strict: true }), 'strict: -0 is 0');

  t.ok(equal({ a: 0 }, { a: -0 }), 'two objects with a same-keyed 0/-0 value are equal');
  t.ok(equal({ a: -0 }, { a: 0 }), 'two objects with a same-keyed -0/0 value are equal');

  t.notOk(equal({ a: 0 }, { a: -0 }, { strict: true }), 'strict: two objects with a same-keyed 0/-0 value are equal');
  t.notOk(equal({ a: -0 }, { a: 0 }, { strict: true }), 'strict: two objects with a same-keyed -0/0 value are equal');

  t.end();
});

test('Object.create', { skip: !Object.create }, function (t) {
  var a = { a: 'A' };
  var b = Object.create(a);
  b.b = 'B';
  var c = Object.create(a);
  c.b = 'C';

  t.notOk(equal(b, c), 'two objects with the same [[Prototype]] but a different own property are not equal');
  t.notOk(equal(c, b), 'two objects with the same [[Prototype]] but a different own property are not equal');

  t.notOk(equal(b, c, { strict: true }), 'strict: two objects with the same [[Prototype]] but a different own property are not equal');
  t.notOk(equal(c, b, { strict: true }), 'strict: two objects with the same [[Prototype]] but a different own property are not equal');

  t.end();
});

test('Object.create(null)', { skip: !Object.create }, function (t) {
  t.ok(equal(Object.create(null), Object.create(null)), 'two empty null objects are deep equal');
  t.ok(equal(Object.create(null), Object.create(null), { strict: true }), 'strict: two empty null objects are deep equal');

  t.ok(equal(Object.create(null, { a: { value: 'b' } }), Object.create(null, { a: { value: 'b' } })), 'two null objects are deep equal');
  t.ok(equal(Object.create(null, { a: { value: 'b' } }), Object.create(null, { a: { value: 'b' } }), { strict: true }), 'strict: two null objects are deep equal');

  t.end();
});

test('regexes vs dates', function (t) {
  var d = new Date(1387585278000);
  var r = /abc/;

  t.notOk(equal(d, r), 'date and regex are not equal');
  t.notOk(equal(r, d), 'regex and date are not equal');

  t.notOk(equal(d, r, { strict: true }), 'strict: date and regex are not equal');
  t.notOk(equal(r, d, { strict: true }), 'strict: regex and date are not equal');

  t.end();
});

test('regexen', function (t) {
  t.notOk(equal(/abc/, /xyz/), 'two different regexes are not equal');
  t.notOk(equal(/xyz/, /abc/), 'two different regexes are not equal');
  t.ok(equal(/abc/, /abc/), 'two same regexes are equal');
  t.ok(equal(/xyz/, /xyz/), 'two same regexes are equal');

  t.notOk(equal(/abc/, /xyz/, { strict: true }), 'strict: two different regexes are not equal');
  t.notOk(equal(/xyz/, /abc/, { strict: true }), 'strict: two different regexes are not equal');
  t.ok(equal(/abc/, /abc/, { strict: true }), 'strict: two same regexes are not equal');
  t.ok(equal(/xyz/, /xyz/, { strict: true }), 'strict: two same regexes are not equal');

  t.end();
});
