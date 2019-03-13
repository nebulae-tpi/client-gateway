const { of, Observable, bindNodeCallback } = require('rxjs');
const { map, tap } = require('rxjs/operators');
const request = require('request');

module.exports = {

  Query: {
    BusinessContactInfo: (root, args, context, info) => {
      return of(
        {
          name: 'NebulaE',
          whatsapp: 573004832728,
          phone: 3004832728,
          businessId: '423f-54a3-434a-645b'
        }
      ).toPromise()
    },
  },
}




