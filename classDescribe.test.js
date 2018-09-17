const Suite = require('./classDescribe');

const { Describe , not , dive , Expectations } = Suite;
const { toEqual , toBe , toPass } = Expectations;

let suite = undefined;

suite = new Describe("Mock passing");
suite.it("Should be equal",toEqual(1,1));
suite.it("Should be",toBe(1,1))
suite.it("Should pass",toPass(1, v => v < 2))
suite.results();

suite = new Describe("Mock fail");
suite.it("Should not be equal",not(toEqual(1,1)));
suite.it("Should not be",not(toBe(1,1)))
suite.it("Should pass",not(toPass(1, v => v < 2)))
suite.results();
