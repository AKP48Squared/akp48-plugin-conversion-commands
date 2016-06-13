'use strict';
const ConvertBase = require('./ConvertBase');
const ConvertTemp = require('./ConvertTemp');
const Qty = require('js-quantities');

class Conversion extends global.AKP48.pluginTypes.MessageHandler {
  constructor(AKP48) {
    super(AKP48, 'Conversion');
  }
}

Conversion.prototype.handleCommand = function (context) {
  global.logger.silly(`${this.name}: Received command.`);

  var text = context.rawArgs();
  var command = context.command();
  var responses = [];

  if(typeof ConvertBase[command] === 'function') {
    global.logger.silly(`${this.name}: Responding to ${command} command.`);
    for (var i = 0; i < text.length; i++) {
      responses.push(`${text[i]} => ${ConvertBase[command](text[i])}`);
    }

    return context.reply(responses.join(', '));
  }

  if(typeof ConvertTemp[command] === 'function') {
    global.logger.silly(`${this.name}: Responding to ${command} command.`);
    for (var i = 0; i < text.length; i++) {
      responses.push(`${ConvertTemp[command](text[i])}`);
    }
    return context.reply(responses.join(', '));
  }

  //all-in-one solution time.
  if(command === 'convert') {
    global.logger.silly(`${this.name}: Responding to convert command.`);
    var to = text[0];
    text.shift();
    try {
      for (var i = 0; i < text.length; i++) {
        var q = new Qty(text[i]);
        if(q.isCompatible(to)) {
          responses.push(`${q.toPrec(0.01).toString()} => ${q.to(to).toPrec(0.01).toString()}`);
        } else {
          responses.push(`Incompatible units: ${q.toPrec(0.01).toString()}`);
        }
      }
    } catch(e) {
      responses.push(`Error! ${e.message}.`);
    }

    return context.reply(responses.join(', '));
  }
};

module.exports = Conversion;
