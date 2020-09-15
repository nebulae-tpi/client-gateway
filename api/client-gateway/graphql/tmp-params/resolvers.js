const { from, of, Observable, bindNodeCallback } = require("rxjs");
const { map, tap, toArray } = require("rxjs/operators");
const request = require("request");
const gregorian = require("weeknumber");

const PEAK_HOURS = JSON.parse(process.env.PEAK_HOURS);

const PEAK_HOUR_FARE_PER_KILOMETER_MAP = JSON.parse(process.env.PEAK_HOUR_FARE_PER_KILOMETER_MAP || "{}");

const NIGHT_SURCHARGE_VALUE = parseInt(process.env.NIGHT_SURCHARGE_VALUE);
const NIGHT_SURCHARGE_HOURS = JSON.parse(process.env.NIGHT_SURCHARGE_HOURS);

const MINIMAL_TRIP_COST =  parseInt(process.env.MINIMAL_TRIP_COST);

const buildPredefinedMessages = () => {
  const predefinedMessages = JSON.parse(process.env.PREDEFINED_MESSAGES_CLIENT);
  return predefinedMessages.messages;
};


const locationVsBusinessMap = [
  // CALI
  {
    name: "TPI_CALI",
    latLng: { lat: 5.06317, lng: -75.49798 },
    farePeakHour: PEAK_HOUR_FARE_PER_KILOMETER_MAP["75cafa6d-0f27-44be-aa27-c2c82807742d"].peakHourPerKilometer,
    fareOffPeakHour: PEAK_HOUR_FARE_PER_KILOMETER_MAP["75cafa6d-0f27-44be-aa27-c2c82807742d"].offPeakHourPerKilometer
  },
  // MANIZALES
  {
    name: "TPI_MANIZALES",
    latLng: { lat: 3.42920, lng: -76.52185 },
    farePeakHour: PEAK_HOUR_FARE_PER_KILOMETER_MAP["b19c067e-57b4-468f-b970-d0101a31cacb"].peakHourPerKilometer,
    fareOffPeakHour: PEAK_HOUR_FARE_PER_KILOMETER_MAP["b19c067e-57b4-468f-b970-d0101a31cacb"].offPeakHourPerKilometer
  }
];

console.log("locationVsBusinessMap", JSON.stringify(locationVsBusinessMap));


function distanceBetweenTwoPoint(origin, destination){

  const diffLat = (origin.lat * 100) - (destination.lat * 100);
  const diffLng = (origin.lng * 100) - (destination.lng * 100);

  return Math.sqrt( Math.pow(diffLat, 2) + Math.pow(diffLng, 2) );

}


function getFareSettings(args) {
  console.log(args);
  const { lat, lng } = args;

  console.log("PARAMS:", { lat, lng });
  console.log("locationVsBusinessMap", JSON.stringify(locationVsBusinessMap));

  
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

  const nightHours = NIGHT_SURCHARGE_HOURS.filter(timerange => {
    let [initialTime, finalTime] = timerange.split(",");

    let initialTimeHour = parseInt(initialTime.split(":")[0]);
    let initialTimeMinutes = parseInt(initialTime.split(":")[1]);

    initialTime = new Date(new Date().toLocaleString("es-CO", {timeZone: "America/Bogota"}))
      .setHours(initialTimeHour, initialTimeMinutes, 0, 0);

    let finalTimeHours = parseInt(finalTime.split(":")[0]);
    let finalTimeMinutes = parseInt(finalTime.split(":")[1]);
    finalTime = new Date(new Date().toLocaleString("es-CO", {timeZone: "America/Bogota"}))
      .setHours(finalTimeHours, finalTimeMinutes, 0, 0);

      console.log(initialTime, finalTime);
    return ( Date.now() >= initialTime && Date.now() < finalTime);

  });

  const closestCity = locationVsBusinessMap
    .map(conf => ({ 
      ...conf, 
      distance: distanceBetweenTwoPoint({ lat, lng }, conf.latLng )
    }))
    .sort((a, b) => a.distance - b.distance)[0];

  console.log("closestCity", closestCity );



  return {
    // valuePerKilometer: isPeakHour 
    //   ? closestCity.farePeakHour 
    //   : closestCity.fareOffPeakHour,
    valuePerKilometer: 1150,
    additionalCost: nightHours.length > 0 ? NIGHT_SURCHARGE_VALUE : 0,
    minimalTripCost: MINIMAL_TRIP_COST
  }

}



module.exports = {
  Query: {
    PredefinedMessages: (root, args, context, info) => {
      return of(buildPredefinedMessages()).toPromise();
    },
    FareSettings:(root, args, context, info) => {
      return getFareSettings(args);
    }
  }
};
