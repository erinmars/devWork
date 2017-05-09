var x = {
    a: 1,
    b: 2,
    c: 4
};

var checkEslint = function(some, thing) {
    return some * thing;
};

checkEslint(x.a, x.c);