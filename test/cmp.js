var test = require('tape');
var equal = require('../');

test('equal', function (t) {
    t.ok(equal(
        { a : [ 2, 3 ], b : [ 4 ] },
        { a : [ 2, 3 ], b : [ 4 ] }
    ));
    t.end();
});

test('not equal', function (t) {
    t.notOk(equal(
        { x : 5, y : [6] },
        { x : 5, y : 6 }
    ));
    t.end();
});

test('nested nulls', function (t) {
    t.ok(equal([ null, null, null ], [ null, null, null ]));
    t.end();
});

test('NaN and 0 values', function (t) {
    t.ok(equal(NaN, NaN));
    t.notOk(equal(0, NaN));
    t.ok(equal(0, 0));
    t.notOk(equal(0, 1));
    t.end();
});


test('nested NaN values', function (t) {
    t.ok(equal([ NaN, 1, NaN ], [ NaN, 1, NaN ]));
    t.end();
});
