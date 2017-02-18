/**
 * Created by KaiNguyen on 9/4/16.
 */

const EventEmitter = require('events');
class MyEmitter extends EventEmitter {
}
let myEmitter =  new MyEmitter();

module.exports = myEmitter;