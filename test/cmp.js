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

test('equal with constructor check', function (t) {
    t.ok(equal(
        { a : 'str', b: 10, c: [10, true], d: {k: [1121, 2323], d: Number} },
        { a : String, b: Number, c: [Number, Boolean] , d: {k: Array, d: 10} }
    ));
    t.end();
});
