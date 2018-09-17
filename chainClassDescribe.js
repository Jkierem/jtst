const utils = require('./utils.js');

class Describe {
  constructor(description) {
    this.description = description;
    this.tests = [];
    this.shouldNegate = false;
    this.results = this.results.bind(this);
  }

  toggleNegation(){
    this.shouldNegate = !this.shouldNegate;
  }

  bindExpectancy(should,id){
    const neg = this.shouldNegate ? "not ": "";
    const self = this;
    const { toggleNegation } = this;
    return function(who){
      return {
        get not(){
          self.toggleNegation();
          return self.bindExpectancy(should,id).call(self,who);
        },
        toEqual: this.bindCheckingFunk(id,who,{
          op:utils.equality,
          msg: `${neg}to equal`,
          shouldNegate: this.shouldNegate,
          should
        }).bind(this),
        toBe: this.bindCheckingFunk(id,who,{
          op:utils.identity,
          msg: `${neg}to be`,
          shouldNegate: this.shouldNegate,
          should
        }).bind(this),
        toHavePropertyDefined: this.bindCheckingFunk(id,who,{
          op:utils.hasProp,
          msg: `${neg}to have`,
          shouldNegate: this.shouldNegate,
          should
        }).bind(this),
        toHaveLengthOf: this.bindCheckingFunk(id,who,{
          op:utils.haveLengthOf,
          msg: `${neg}to have length of`,
          shouldNegate: this.shouldNegate,
          should
        }).bind(this),
        toBeOfType: this.bindCheckingFunk(id,who,{
          op:utils.isTypeOf,
          msg: `${neg}to be type of`,
          shouldNegate: this.shouldNegate,
          should
        }).bind(this),
        toBeInstanceOf: this.bindCheckingFunk(id,who,{
          op:utils.isInstanceOf,
          msg: `${neg}to be instance of`,
          shouldNegate: this.shouldNegate,
          transform: (con) => con.name,
          should
        }).bind(this),
        toBeDefined: this.bindCheckingFunk(id,who,{
          op:utils.isDefined,
          msg: `${neg}to be defined`,
          shouldNegate: this.shouldNegate,
          transform: () => "",
          should
        }).bind(this),
        toBeUndefined: this.bindCheckingFunk(id,who,{
          op:utils.falsify(utils.isDefined),
          msg: `${neg}to be undefined`,
          shouldNegate: this.shouldNegate,
          transform: () => "",
          should
        }).bind(this),
        toBeNull: this.bindCheckingFunk(id,who,{
          op:utils.isNull,
          msg: `${neg}to be null`,
          shouldNegate: this.shouldNegate,
          transform: () => "",
          should
        }).bind(this),
        toPass: this.bindCheckingFunk(id,who,{
          op:utils.reverseApply,
          msg: `${neg}on passing given condition`,
          shouldNegate: this.shouldNegate,
          transform: () => "",
          should
        }).bind(this),
        dive: function(propName){
          if( self.shouldNegate ){
            throw Error("Logic error: diving has no inverse function");
          }
          return self.bindExpectancy(should,id).call(self,utils.prop(propName,who))
        },
        toHaveProperty: function(propName,value){
          const { prop } = utils;
          const p = prop(propName,who);
          return self.bindCheckingFunk(id,p,{
            op: utils.equality,
            msg: `${neg}to equal`,
            shouldNegate: self.shouldNegate,
            should
          }).bind(self)(value)
        }
      }
    }
  }

  bindCheckingFunk(id,who,funk){
    return function(what){
      this.assignExpectancy(id,who,what,funk)
      return this;
    }
  }

  assignExpectancy(id,who,what,funk){
    this.tests[id].run = () => {
      const { op , msg , should , shouldNegate , transform } = funk;
      let veracity = !!op(who,what);
      if( shouldNegate ){
        veracity = !veracity;
      }
      const status = veracity ? "Passed" : "Failed";
      const str_what = transform ? transform(what) : what;
      const reason = veracity ? "" : `Reason: expected ${who} ${msg} ${str_what}`;
      console.log(`   ${should}: ${status}. ${reason}`)
      this.tests[id].result = veracity;
    }
  }

  it(should){
    this.shouldNegate = false;
    this.tests = [...this.tests , {
      run:()=>{console.log("undefined behavior")},
      result: "not executed"
    }];
    return {
      expect: this.bindExpectancy(should,this.tests.length - 1).bind(this)
    };
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

const describe = (description) => {
  return new Describe(description);
}

module.exports = describe;
