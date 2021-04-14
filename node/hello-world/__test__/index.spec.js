test('测试helloText', ()=>{
  const res = require('../index')
  // console.log('helloText', res);
  expect(res)
  .toBe('hello world1')
})