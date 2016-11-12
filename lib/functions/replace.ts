import utils = require('../utils');
import nodes = require('../nodes');

/**
 * Returns string with all matches of `pattern` replaced by `replacement` in given `val`
 *
 * @param {StringNode} pattern
 * @param {StringNode} replacement
 * @param {StringNode|Ident} val
 * @return {StringNode|Ident}
 * @api public
 */

export function replace(pattern, replacement, val){
  utils.assertString(pattern, 'pattern');
  utils.assertString(replacement, 'replacement');
  utils.assertString(val, 'val');
  pattern = new RegExp(pattern.string, 'g');
  var res = val.string.replace(pattern, replacement.string);
  return val instanceof nodes.Ident
    ? new nodes.Ident(res)
    : new nodes.StringNode(res);
};
