function helpers(babelTypes) {
  const t = babelTypes
  const h = {
    checkParamsStatement(params) {
      const errorMessage = `Undefined function parameter!`
      const paramNullChecks = params.map(p => h.undefinedCheckExpression(p))
      return t.ifStatement(
        h.joinBinaryExpressions(paramNullChecks, '||'),
        t.throwStatement(t.newExpression(
          t.identifier('Error'),
          [t.stringLiteral(errorMessage)]
        ))
      )
    },

    nullCheckExpression(ident) {
      return t.binaryExpression(
        '===',
        ident,
        t.nullLiteral()
      )
    },

    undefinedCheckExpression(ident) {
      return t.binaryExpression(
        '===',
        t.unaryExpression('typeof', ident),
        t.stringLiteral('undefined')
      )
    },

    joinBinaryExpressions(expressions, sep) {
      return expressions.reduce((a, b) => t.logicalExpression(sep, a, b))
    },
  }
  return h
}

export default function ({ types }) {
  const h = helpers(types)

  return {
    visitor: {
      FunctionDeclaration(path) {
        const funcParams = path.node.params
        const check = h.checkParamsStatement(funcParams)
        const funcBlockBody = path.node.body.body
        funcBlockBody.unshift(check)
      },
    },
  }
}
