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

test('strict equal', function (t) {
    t.notOk(equal(
        [ { a: 3 }, { b: 4 } ],
        [ { a: '3' }, { b: '4' } ],
        { strict: true }
    ));
    t.end();
});

test('arguments class', function (t) {
    t.deepEqual(
        (function(){return arguments})(1,2,3),
        (function(){return arguments})(1,2,3),
        "compares arguments"
    )
    t.notDeepEqual(
        (function(){return arguments})(1,2,3),
        [1,2,3],
        "differenciates array and arguments"
    )
    t.end();
});
