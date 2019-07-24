const { from, of, Observable, bindNodeCallback } = require("rxjs");
const { map, tap, toArray } = require("rxjs/operators");
const request = require("request");
const gregorian = require("weeknumber");

const PEAK_HOURS = JSON.parse(process.env.PEAK_HOURS) || ["6:00,9:00", "11:00,13:30", "17:00, 18:40"];
const PEAK_HOUR_FARE_PER_KILOMETER = parseInt(process.env.PEAK_HOUR_FARE_PER_KILOMETER) ||  1410;
const OFF_PEAK_HOUR_FARE_PER_KILOMETER = parseInt(process.env.OFF_PEAK_HOUR_FARE_PER_KILOMETER) ||  1310;

const buildPredefinedMessages = () => {
  const predefinedMessages = JSON.parse(process.env.PREDEFINED_MESSAGES_CLIENT);
  return predefinedMessages.messages;
};


function getFareValuePerKilometer() {  
  
  let isPeakHour = false;

  PEAK_HOURS.forEach(timerange => {
    let [initialTime, finalTime] = timerange.split(",");

    let initialTimeHour = parseInt(initialTime.split(":")[0]);
    let initialTimeMinutes = parseInt(initialTime.split(":")[1]);
    initialTime = new Date(new Date().toLocaleString("es-CO", {timeZone: "America/Bogota"}))
      .setHours(initialTimeHour, initialTimeMinutes, 0, 0);


    let finalTimeHours = parseInt(finalTime.split(":")[0]);
    let finalTimeMinutes = parseInt(finalTime.split(":")[1]);
    finalTime = new Date(new Date().toLocaleString("es-CO", {timeZone: "America/Bogota"}))
      .setHours(finalTimeHours, finalTimeMinutes, 0, 0);

    if (Date.now() >= initialTime && Date.now() < finalTime) {
      isPeakHour = true
    }
  });

  return isPeakHour ? PEAK_HOUR_FARE_PER_KILOMETER : OFF_PEAK_HOUR_FARE_PER_KILOMETER;
}

module.exports = {
  Query: {
    PredefinedMessages: (root, args, context, info) => {
      return of(buildPredefinedMessages()).toPromise();
    },
    pricePerKilometerOnTrip:(root, args, context, info) => {
      return getFareValuePerKilometer();
    }



  }
};
