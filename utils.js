const falsify = (what) => (...args) => !what(...args);
const identityFunk = x => x;
const equality = (x,y) => x == y;
const identity = (x,y) => x === y;
const isDefined = x => !!x;
const hasProp = (obj,att) => isDefined(obj) ? isDefined(obj[att]) : false;
const isInstanceOf = (type) => (obj) => obj instanceof type;
const isNull = (something) => something === null;
const isTypeOf = (obj,type) => typeof obj === type;
const haveLengthOf = (who,n) => who.length == n;
const prop = (name,obj) => obj ? obj[name] : undefined;
const reverseApply = (data,funk) => funk(data);

module.exports = {
  equality,
  falsify,
  hasProp,
  haveLengthOf,
  identity,
  identityFunk,
  isDefined,
  isInstanceOf,
  isNull,
  isTypeOf,
  prop,
  reverseApply,
}
