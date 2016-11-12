import utils = require('../utils');
import nodes = require('../nodes');
import {readFileSync as readFile} from 'fs';
import {Null} from '../nodes/null';
import {ObjectNode} from '../nodes/object';

/**
 * Convert a .json file into stylus variables or object.
 * Nested variable object keys are joined with a dash (-)
 *
 * Given this sample media-queries.json file:
 * {
 *   "small": "screen and (max-width:400px)",
 *   "tablet": {
 *     "landscape": "screen and (min-width:600px) and (orientation:landscape)",
 *     "portrait": "screen and (min-width:600px) and (orientation:portrait)"
 *   }
 * }
 *
 * Examples:
 *
 *    json('media-queries.json')
 *
 *    @media small
 *    // => @media screen and (max-width:400px)
 *
 *    @media tablet-landscape
 *    // => @media screen and (min-width:600px) and (orientation:landscape)
 *
 *    vars = json('vars.json', { hash: true })
 *    body
 *      width: vars.width
 *
 * @param {StringNode} path
 * @param {BooleanNode} [local]
 * @param {StringNode} [namePrefix]
 * @api public
*/

export function json(path, local, namePrefix): Null | ObjectNode {
  utils.assertString(path, 'path');

  // lookup
  path = path.string;
  var found = utils.lookup(path, this.options.paths, this.options.filename)
    , options = (local && 'object' == local.nodeName) && local;

  if (!found) {
    // optional JSON file
    if (options && options.get('optional').toBoolean().isTrue) {
      return nodes.nullNode;
    }
    throw new Error('failed to locate .json file ' + path);
  }

  // read
  var json = JSON.parse(readFile(found, 'utf8'));

  if (options) {
    return convert(json, options);
  } else {
    oldJson.call(this, json, local, namePrefix);
  }

  function convert(obj, options){
    var ret = new nodes.ObjectNode()
      , leaveStrings = options.get('leave-strings').toBoolean();

    for (var key in obj) {
      var val = obj[key];
      if ('object' == typeof val) {
        ret.set(key, convert(val, options));
      } else {
        val = utils.coerce(val);
        if ('string' == val.nodeName && leaveStrings.isFalse) {
          val = utils.parseString(val.string);
        }
        ret.set(key, val);
      }
    }
    return ret;
  }
}

/**
 * Old `json` BIF.
 *
 * @api private
 */

function oldJson(json, local, namePrefix){
  if (namePrefix) {
    utils.assertString(namePrefix, 'namePrefix');
    namePrefix = namePrefix.val;
  } else {
    namePrefix = '';
  }
  local = local ? local.toBoolean() : new nodes.BooleanNode(local);
  var scope = local.isTrue ? this.currentScope : this.global.scope;

  convert(json);
  return;

  function convert(obj, prefix?){
    prefix = prefix ? prefix + '-' : '';
    for (var key in obj){
      var val = obj[key];
      var name = prefix + key;
      if ('object' == typeof val) {
        convert(val, name);
      } else {
        val = utils.coerce(val);
        if ('string' == val.nodeName) val = utils.parseString(val.string);
        scope.add({ name: namePrefix + name, val: val });
      }
    }
  }
}
