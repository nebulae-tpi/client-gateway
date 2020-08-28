const { of, Observable, bindNodeCallback } = require('rxjs');
const { map, tap } = require('rxjs/operators');
const request = require('request');



module.exports = {
  Query: {
    BusinessContactInfo: (root, args, context, info) => {

      const businessInits = [
        {
          name: 'NebulaE',
          whatsapp: 573108942249,
          phone: 3108942249,
          businessId: '423f-54a3-434a-645b'
        },
        {
          name: 'TxPlus Manizales',
          whatsapp: 573108942249,
          phone: 3108942249,
          businessId: 'b19c067e-57b4-468f-b970-d0101a31cacb'
        }
      ];
      const { businessId } = context.authToken;
      console.log('[QUERY]BusinessContactInfo; businessId del token  ==> ', businessId );
      const businessUnit = businessInits.find(bu => bu.businessId === businessId);
      console.log('Unidad encontrada ==> ', businessUnit);
      
      return of(
        {
          name: 'NebulaE',
          whatsapp: 573108942249,
          phone: 3108942249,
          businessId: '423f-54a3-434a-645b'
        }
      ).toPromise()
    },
  },
}




