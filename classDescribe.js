const utils = require('./utils');

const not = (expectation) => {
  const { evaluation , who , what , msg , transform , negate } = expectation;
  const neg = !negate;
  return new Expectation(evaluation , { who , what , msg , transform , negate:neg })
}

class Expectation {
  constructor(funk,{ who , what , msg , transform , negate=false }) {
    const neg = negate? "not ":"";
    this.negate = negate;
    this.evaluation = funk;
    this.msg = msg;
    this.who = who;
    this.what = what;
    this.transform = transform;
    this.reason = `Reason: expected ${who} ${neg}${msg} ${transform?transform(what):what}`;
  }

  evaluate(){
    const { who , what , negate } = this;
    if( negate ){
      return !this.evaluation( who , what );
    }
    return this.evaluation( who , what );
  }
}

class Test {
  constructor(description,expectation) {
    this.description = description;
    this.expectation = expectation;
    this.result = "not yet evaluated";
  }

  run(){
    const veracity = !!this.expectation.evaluate();
    const result = veracity? "Passed" : "Failed";
    const reason = veracity? "" : this.expectation.reason ;
    console.log(`   ${this.description}: ${result}. ${reason}`)
    this.result = veracity;
  }
}

class Describe {
  constructor(description) {
    this.description = description;
    this.tests = [];
  }

  it(testname,expectation){
    this.tests = [ ...this.tests , new Test(testname,expectation) ];
  }

  results(){
    console.log(this.description);
    let passed = 0;
    let failed = 0;
    let total  = this.tests.length;
    this.tests.map((test) => {
      test.run();
      if( test.result ){
        passed = passed + 1;
      }else{
        failed = failed + 1;
      }
    })
    console.log(`Results: ${failed} failed. ${total} in total.`);
    console.log(`${((passed/total) * 100).toFixed(2)}% passed \n`);
  }
}

const toEqual = (who , what) => new Expectation(utils.equality, {
  msg: "to equal",
  who,
  what,
})

const toBe = (who , what) => new Expectation(utils.identity, {
  msg: "to be",
  who,
  what,
})

const toPass = (who , what) => new Expectation(utils.reverseApply ,{
  msg: "on passing condition",
  who,
  what,
})

module.exports = {
  Describe,
  not,
  dive: utils.prop,
  Expectations: {
    toEqual,
    toBe,
    toPass,
  }
}
