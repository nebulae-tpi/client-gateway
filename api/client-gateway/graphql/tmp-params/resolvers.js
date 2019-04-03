const { from, of, Observable, bindNodeCallback } = require('rxjs');
const { map, tap, toArray } = require('rxjs/operators');
const request = require('request');

const buildPredefinedMessages = () => {  
  const predefinedMessages = JSON.parse(process.env.PREDEFINED_MESSAGES_CLIENT);
  return predefinedMessages.messages;
}

module.exports = {

  Query: {

    PredefinedMessages: (root, args, context, info) => {
      return of(buildPredefinedMessages())
      .toPromise()
    }
  },
}




