const fs = require('fs')
test('集成测试 测试生成测试代码文件', () => {
  //环境准备
  //删除测试文件夹
  const testPath = __dirname + '/data/__test__'
  if (fs.existsSync(testPath)) {
    fs.rmdirSync(testPath, {
      recursive: true
    })
  }
  const src = new (require('../index'))()
  src.genJestSource(__dirname + '/data')
})

test('测试文件代码生成', () => {
  const src = new (require('../index'))()
  const ret = src.getTestSource('fun', 'class')
  expect(ret)
  .toBe(`
test('TEST fun', () => {
  const fun = require('../class')
  const ret = fun()
  // expect(ret)
  // .toBe('test return')
})
  `)
})

test('测试文件名生成',()=>{
  const src=new (require('../index'))()
  const ret=src.getTestFileName('/abc/class.js')
  console.log('getTestFileName:', ret);
  expect(ret)
  .toBe('/abc/__test__/class.spec.js')
})