const { of, Observable, bindNodeCallback } = require('rxjs');
const { map, tap } = require('rxjs/operators');
const request = require('request');

const buildGoogleMapsParams = () => {
  return {
    googleMapsAndroidKey: process.env.GOOGLE_MAPS_ANDROID_KEY,
    googleMapsBrowserKey: process.env.GOOGLE_MAPS_BROWSER_KEY
  };
}

const buildPredefinedMessages = () => {
  return process.env.PREDEFINED_MESSAGES.messages;
}


module.exports = {

  Query: {

    GoogleMapsParams: (root, args, context, info) => {
      return of({
        googleMapsAndroidKey: process.env.GOOGLE_MAPS_ANDROID_KEY,
        googleMapsBrowserKey: process.env.GOOGLE_MAPS_BROWSER_KEY
      }).toPromise()
    },


    Params: (root, args, context, info) => {
      return of({
        GoogleMapsParams: buildGoogleMapsParams(),
        predefinedMessages: buildPredefinedMessages()
      }).toPromise()
    },

  },
}




