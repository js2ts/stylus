
/*!
 * Stylus - Arguments
 * Copyright (c) Automattic <developer.wordpress.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

import {Node} from './node';
import {Expression} from './expression';
import utils = require('../utils');

/**
 * Initialize a new `Arguments`.
 *
 * @api public
 */

export class Arguments extends Expression {
  map = {};

  constructor() {
    super();
}

/**
 * Initialize an `Arguments` object with the nodes
 * from the given `expr`.
 *
 * @param {Expression} expr
 * @return {Arguments}
 * @api public
 */

static fromExpression(expr) {
  var args = new Arguments
    , len = expr.nodes.length;
  args.lineno = expr.lineno;
  args.column = expr.column;
  args.isList = expr.isList;
  for (var i = 0; i < len; ++i) {
    args.push(expr.nodes[i]);
  }
  return args;
}

/**
 * Return a clone of this node.
 */

clone(parent): Node {
  var clone = <Arguments>super.clone(parent);
  clone.map = {};
  for (var key in this.map) {
    clone.map[key] = this.map[key].clone(parent, clone);
  }
  clone.isList = this.isList;
  clone.lineno = this.lineno;
  clone.column = this.column;
  clone.filename = this.filename;
  return clone;
}

/**
 * Return a JSON representation of this node.
 *
 * @return {Object}
 * @api public
 */

toJSON() {
  return {
    __type: 'Arguments',
    map: this.map,
    isList: this.isList,
    preserve: this.preserve,
    lineno: this.lineno,
    column: this.column,
    filename: this.filename,
    nodes: this.nodes
  };
}
}