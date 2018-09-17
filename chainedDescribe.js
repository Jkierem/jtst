'use-strict'

const utils = require('./utils.js');
const {
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
} = utils;

const showResults = ({passed,failed}) => () => {
  const percentage = (passed/(passed+failed))*100;
  console.log(`Results: ${failed} failed. ${failed+passed} in total`)
  console.log(`${percentage.toFixed(2)}% passed\n`)
}

const describe = (description) => {
  console.log(`Tests: ${description}`);
  return {
    it: it({ passed:0 , failed:0 }),
  }
}

const it = (suite) => (should) => {
  return {
    expect: expected(suite,should)
  }
}

const expected = (suite,should) => (who, mod=truthify , opMod="") => {
  const partialExpect =  _expected(should,who,suite);
  return {
    get not(){ return expected(suite,should)(who,falsify,opMod+"not ") },
    toEqual: partialExpect( mod(equality),`${opMod}to equal`),
    toBe: partialExpect( mod(identity),`${opMod}to be`),
    toHavePropertyDefined: partialExpect(mod(hasProp),`${opMod}to have property`),
    toHaveLengthOf: partialExpect(mod(haveLengthOf),`${opMod}to have length of`),
    toBeOfType: partialExpect(mod(isTypeOf),`${opMod}to be type of`),
    toBeInstanceOf: (what) => partialExpect(mod(isInstanceOf(what)),`${opMod}to be instance of`)(what.name),
    toBeDefined: () => partialExpect( mod(isDefined), `${opMod}to be`)("defined"),
    toBeUndefined: () => partialExpect( mod(falsify(isDefined)) , `${opMod}to be`)("undefined"),
    toBeNull: () => partialExpect(mod(isNull),`${opMod}to be`)("null"),
    toPass: (condition) => partialExpect(mod(condition),`${opMod}to pass`)("given condition"),
    toHaveProperty: (propName,value) => {
      if( !value ){
        return expected(suite,should)(prop(propName,who),mod,opMod)
      }
      return _expected(should,prop(propName,who),suite)(mod(equality),`${opMod}have property equal to`)(value)
    }
  }
}

const _expected = (msg , who , suite) => ( func , opname ) => (what) => {
  let { passed , failed } = suite;
  const veracity = !!func(who,what);
  const result =  veracity ? "Passed" : "Failed" ;
  const extra = !veracity ? `Reason: expected ${who} ${opname} ${what}` : "" ;
  console.log(`   ${msg}: ${result}. ${extra}`);
  const newSuite = {
    passed:  veracity ? passed + 1 : passed,
    failed: !veracity ? failed + 1 : failed,
  }
  return{
    it: it(newSuite),
    results: showResults(newSuite)
  }
}

module.exports = describe;
