import utils = require('../utils');
import nodes = require('../nodes');

/**
 * Set a variable `name` on current scope.
 *
 * @param {StringNode} name
 * @param {Expression} expr
 * @param {BooleanNode} [global]
 * @api public
 */

export function define(name, expr, global){
  utils.assertType(name, 'string', 'name');
  expr = utils.unwrap(expr);
  var scope = this.currentScope;
  if (global && global.toBoolean().isTrue) {
    scope = this.global.scope;
  }
  var node = new nodes.Ident(name.val, expr);
  scope.add(node);
  return nodes.nullNode;
}
