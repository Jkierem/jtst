const utils = require('./utils');
const describe = require('./chainedDescribe.js');

describe("Mock passing tests")
.it("Should equal").expect(1).toEqual(1)
.it("Should be").expect(1).toBe(1)
.it("Should have property").expect({prop:"a"}).toHavePropertyDefined("prop")
.it("Should have length of").expect([1,2]).toHaveLengthOf(2)
.it("Should be type of").expect(5).toBeOfType("number")
.it("Should be instance of").expect(new String('string')).toBeInstanceOf(String)
.it("Should be defined").expect({}).toBeDefined()
.it("Should be undefined").expect(undefined).toBeUndefined()
.it("Should be null").expect(null).toBeNull()
.it("Should pass").expect(1).toPass((value)=> value < 2)
.it("Should have nested prop").expect({first:{second:1}}).toHaveProperty("first").toHaveProperty("second",1)
.it("Should have prop chained equal to").expect({prop:5}).toHaveProperty("prop").toEqual(5)
.results()

describe("Mock failing tests")
.it("Should not equal").expect(1).not.toEqual(1)
.it("Should not be").expect(1).not.toBe(1)
.it("Should not have property").expect({prop:"a"}).not.toHavePropertyDefined("prop")
.it("Should not have length of").expect([1,2]).not.toHaveLengthOf(2)
.it("Should not be type of").expect(5).not.toBeOfType("number")
.it("Should not be instance of").expect(new String('string')).not.toBeInstanceOf(String)
.it("Should not be defined").expect({}).not.toBeDefined()
.it("Should not be undefined").expect(undefined).not.toBeUndefined()
.it("Should not be null").expect(null).not.toBeNull()
.it("Should not pass").expect(1).not.toPass((value)=> value < 2)
.it("Should not have nested prop").expect({first:{second:1}}).toHaveProperty("first").not.toHaveProperty("second",1)
.it("Should not have prop chained equal to").expect({prop:5}).toHaveProperty("prop").not.toEqual(5)
.results();