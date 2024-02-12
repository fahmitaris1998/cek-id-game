const fs = require('fs');
const _ = require('lodash');
const fetch = require('node-fetch');

(async () => {
   const response = await fetch(
      'https://api.duniagames.co.id/api/product/v2/product?productType=all&page=1&limit=100&productPage='
   );
   const data = await response.json();
   const newData = data.data.data.map((item) => {
      return {
         id: item.id,
         name: item.gameName,
         slug: item.slug,
         provider: 'duniagames',
      };
   });

   const a = _.orderBy(newData, ['name'], ['asc']);

   let datas = [];

   let abc = async () => {
      for (let i = 0; i < a.length; i++) {
         const response = await fetch(
            `https://api.duniagames.co.id/api/product/v1/product/${a[i].slug}?include=item&includeFaq=true`
         );
         const data = await response.json();
         const getCatalog = await fetch(
            `https://api.duniagames.co.id/api/product/v1/payment-channel/?criteriaId=2&itemId=${data.data?.item?.data[0]?.id}`
         );
         const catalog = await getCatalog.json();

         console.log(a[i].name);
         datas.push({
            ...a[i],
            slug: a[i].slug+"-dg",
            isZone:
               data.data.isZoneId == 0 && data.data.serverIdOptions
                  ? true
                  : !data.data.serverIdOptions && data.data.isZoneId == 1
                  ? true
                  : false,
            dropdown: data.data.serverIdOptions?.map((item) => {
               return {
                  id: item.optionValue,
                  name: item.optionText,
               };
            }),
            itemId: data.data?.item?.data[0]?.id,
            product_ref_denom: data.data?.item?.data[0]?.product_ref_denom,
            product_ref: data.data?.product_ref,
            catalogId: catalog.data?.catalogId || null,
            paymentChannel: catalog.data?.paymentChannel[0]?.id,
         });
         //  console.log(data);
      }
   };

   await abc();
   fs.writeFile('./lib/duniagames.json', JSON.stringify({ data: datas }), 'utf8', function (err) {
      if (err) {
         console.log('An error occured while writing JSON Object to File.');
         return console.log(err);
      }

      console.log('JSON file has been saved.');
   });
})();
