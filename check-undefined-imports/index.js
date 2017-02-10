const t = require('babel-types')

function buildImportCheck(importSpecifier, importFrom, fileName) {
  const importedVar = importSpecifier.local

  const isDefaultImport = t.isImportDefaultSpecifier(importSpecifier)
  const importName = importedVar.name
  const importType = isDefaultImport ? 'default' : 'named'
  const errorMessage = `Undefined ${importType} import '${importName}' from '${importFrom}' in file '${fileName}'`

  return t.ifStatement(
    t.binaryExpression(
      '===',
      t.unaryExpression('typeof', importedVar),
      t.stringLiteral('undefined')
    ),
    t.throwStatement(t.newExpression(
      t.identifier('Error'),
      [t.stringLiteral(errorMessage)]
    ))
  )
}

module.exports = function () {
  return {
    visitor: {
      ImportDeclaration(path) {
        const imports = path.node.specifiers
        const importFrom = path.node.source.value
        const currentFile = this.file.opts.filename

        const importChecks = imports.map(specifier => {
          const bic = buildImportCheck(specifier, importFrom, currentFile)
          bic.loc = specifier.loc
          return bic
        })
        path.insertAfter(importChecks)
      },
    },
  }
}
