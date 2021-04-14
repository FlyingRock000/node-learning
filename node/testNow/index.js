const fs = require('fs')
const path = require('path')
module.exports = class TextNow {
  genJestSource(sourcePath = path.resolve('./')) {
    const testPath = `${sourcePath}/__test__`
    if (!fs.existsSync(testPath)) {
      fs.mkdirSync(testPath)
    }
    // 遍历代码文件
    let list = fs.readdirSync(sourcePath)
    list
    .map(v => `${sourcePath}/${v}`)
    .filter(v => fs.statSync(v).isFile())
    .filter(v => v.indexOf('.spec') === -1)
    .map(v => this.genTestFile(v))
  }

  genTestFile(fileName) {
    const testFileName = this.getTestFileName(fileName)
    if (fs.existsSync(testFileName)) {
      console.log('该测试代码已存在:' + testFileName);
      return
    }
    const mod = require(fileName)
    let source
    if (typeof mod === 'object'){
      source = Object.keys(mod)
      .map(v => this.getTestSource(v, path.basename(fileName)), true)
      .join('\n')
    }
    if (typeof mod === 'function'){
      const basename = path.basename(fileName)
      source = this.getTestSource(basename.replace('.js', ''), basename)
    }
    fs.writeFileSync(testFileName, source)
  }

  getTestSource(methodName, classFile, isClass = false) {
    return `
test('${'TEST ' + methodName }', () => {
  const ${isClass ? '{' + methodName + '}' : methodName} = require('${'../' + classFile}')
  const ret = ${methodName}()
  // expect(ret)
  // .toBe('test return')
})
  `
  }
  getTestFileName(fileName) {
    const dirname = path.dirname(fileName)
    const basename = path.basename(fileName)
    const extname = path.extname(fileName)
    const textname = basename.replace(extname, `.spec${extname}`)
    return path.format({
      root: dirname + '/__test__/',
      base: textname
    })
  }
}