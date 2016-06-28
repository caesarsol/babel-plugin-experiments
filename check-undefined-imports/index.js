function helpers(babelTypes) {
  const t = babelTypes
  const h = {
    checkImport(importSpecifier, fileName) {
      const importedVar = importSpecifier.local
      const isDefaultImport = t.isImportDefaultSpecifier(importSpecifier)
      const importName = importedVar.name
      const importType = isDefaultImport ? 'default' : 'named'
      const errorMessage = `Undefined ${importType} import ${importName} from '${fileName}'!`
      return t.ifStatement(
        h.undefinedCheckExpression(importedVar),
        t.throwStatement(t.newExpression(
          t.identifier('Error'),
          [t.stringLiteral(errorMessage)]
        ))
      )
    },

    undefinedCheckExpression(ident) {
      if (!t.isIdentifier(ident)) throw new Error('Not an identifier!')
      return t.binaryExpression(
        '===',
        t.unaryExpression('typeof', ident),
        t.stringLiteral('undefined')
      )
    },
  }
  return h
}

export default function ({types}) {
  const h = helpers(types)

  return {
    visitor: {
      ImportDeclaration(path) {
        const importedFile = path.node.source.value
        const imports = path.node.specifiers
        path.insertAfter(imports.map((imp) => h.checkImport(imp, importedFile)))
      },
    },
  }
}
