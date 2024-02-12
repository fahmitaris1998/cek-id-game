const fetch = require('node-fetch');
const { dataGame } = require('../lib/dataGame');
const crypto = require('crypto');

const cekIdGameController = async (req, res) => {
   const slug = req.params.game;
   const { id, zone } = req.query;

   const game = dataGame.find((item) => item.slug === slug);
   if (!game) return res.status(404).json({ status: false, message: 'Game not found' });
   if (!id) return res.status(400).json({ status: false, message: 'ID is required' });
   if (game.isZone && !zone) return res.status(400).json({ status: false, message: 'Zone is required' });
   // console.log("ini",id)

   if (game.provider == 'duniagames') {
      let payload = {
         productId: game.id,
         itemId: game.itemId,
         catalogId: game.catalogId,
         paymentId: game.paymentChannel,
         gameId: id,
         zoneId: zone || null,
         product_ref: game.product_ref,
         product_ref_denom: game.product_ref_denom,
      };

      const getUsernameGame = await fetch('https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
         },

         body: JSON.stringify(payload),
      });

      try {
         const data = await getUsernameGame.json();
         if (data.status.code == 0) {
            return res.status(200).json({
               status: true,
               message: 'ID berhasil ditemukan',
               data: {
                  username: data.data?.gameDetail?.userName,
                  user_id: id,
                  zone: zone || null,
               },
            });
         } else {
            return res.status(404).json({ status: false, message: data.status?.message || 'ID Tidak ditemukan' });
         }
      } catch (err) {
         return res.status(500).json({ status: false, message: 'Internal Server Error' });
      }
   } else if (game.provider == 'codashop') {
      let dataBody;
      switch (game.slug) {
         case 'higgs-domino':
            dataBody = `voucherPricePoint.id=27605&voucherPricePoint.price=15000.0&voucherPricePoint.variablePrice=0&n=2%2F21%2F2023-2116&email=okebagsu426%40gmail.com&userVariablePrice=0&order.data.profile=eyJuYW1lIjoiICIsImRhdGVvZmJpcnRoIjoiIiwiaWRfbm8iOiIifQ%3D%3D&user.userId=${id}&user.zoneId=&msisdn=&voucherTypeName=HIGGS&voucherTypeId=49&gvtId=60&shopLang=id_ID&checkoutId=fdc7bd2e-d86a-4ec5-ac68-e2dbfbb2a02c&affiliateTrackingId=&impactClickId=3NhRLCwl%3AxyNRNtT6ryOjXyTUkAyLjRfFSnCU80&anonymousId=7eb09d46-b08e-46c1-bc83-c127489d4d6c&fullUrl=https%3A%2F%2Fwww.codashop.com%2Fid-id%2Fhiggs-domino&userSessionId=b2tlYmFnc3U0MjZAZ21haWwuY29t&userEmailConsent=false&userMobileConsent=false&verifiedMsisdn=&promoId=&promoCode=&clevertapId=49bec2319150449bb397c95acb9aaa02`;
            break;
         case 'hago':
            dataBody = `voucherPricePoint.id=16107&voucherPricePoint.price=30294.0&voucherPricePoint.variablePrice=0&n=2%2F21%2F2023-2027&email=okebagsu426%40gmail.com&userVariablePrice=0&order.data.profile=eyJuYW1lIjoiICIsImRhdGVvZmJpcnRoIjoiIiwiaWRfbm8iOiIifQ%3D%3D&user.userId=${id}&user.zoneId=&msisdn=&voucherTypeName=HAGO&voucherTypeId=33&gvtId=43&shopLang=id_ID&checkoutId=bea3ecd6-4cdc-4b91-be56-a28fc0b4ffb6&affiliateTrackingId=&impactClickId=3NhRLCwl%3AxyNRNtT6ryOjXyTUkAyLjRfFSnCU80&anonymousId=7eb09d46-b08e-46c1-bc83-c127489d4d6c&fullUrl=https%3A%2F%2Fwww.codashop.com%2Fid-id%2Fhago&userSessionId=b2tlYmFnc3U0MjZAZ21haWwuY29t&userEmailConsent=false&userMobileConsent=false&verifiedMsisdn=&promoId=&promoCode=&clevertapId=49bec2319150449bb397c95acb9aaa02`;
            break;
         case 'lords-mobile':
            dataBody = `voucherPricePoint.id=49967&voucherPricePoint.price=5000.0&voucherPricePoint.variablePrice=0&n=7%2F14%2F2023-206&email=okebagus%40gmail.com&userVariablePrice=0&order.data.profile=eyJuYW1lIjoiICIsImRhdGVvZmJpcnRoIjoiIiwiaWRfbm8iOiIifQ%3D%3D&user.userId=${id}&user.zoneId=1051&msisdn=&voucherTypeName=LORDS_MOBILE&voucherTypeId=76&gvtId=93&shopLang=id_ID&checkoutId=7beb916e-70ad-45ec-ba54-7dabcbf49816&affiliateTrackingId=&impactClickId=&anonymousId=c36f04c2-606b-4420-8224-3558c2f0ef4b&fullUrl=https%3A%2F%2Fwww.codashop.com%2Fid-id%2Flords-mobile&userSessionId=b2tlYmFndXNAZ21haWwuY29t&userEmailConsent=false&userMobileConsent=false&verifiedMsisdn=&promoId=&promoCode=&clevertapId=2b03801e6ebd45cdb2d0c1a033ba47cc&promotionReferralCode=`;
            break;
         default:
            dataBody = `voucherPricePoint.id=${game.priceId}&voucherPricePoint.price=${
               game.price
            }&voucherPricePoint.variablePrice=0&n=${formatedDate()}-206&email=okebagsu426@gmail.com&userVariablePrice=0&order.data.profile=eyJuYW1lIjoiICIsImRhdGVvZmJpcnRoIjoiIiwiaWRfbm8iOiIifQ%3D%3D&user.userId=${id}&user.zoneId=${
               zone || ''
            }&msisdn=081123123123&voucherTypeName=${game.voucherTypeName}&voucherTypeId=${game.voucherTypeId}&gvtId=${
               game.gvtId
            }&shopLang=id_ID&checkoutId=${crypto.randomUUID()}&affiliateTrackingId=&impactClickId=3NhRLCwl:xyNRNtT6ryOjXyTUkAyLjRfFSnCU80&anonymousId=${crypto.randomUUID()}&fullUrl=${
               'https://www.codashop.com/id-id/' + game.slug
            }&userSessionId=${crypto.randomUUID()}&userEmailConsent=false&userMobileConsent=false&verifiedMsisdn=&promoId=&promoCode=&clevertapId=49bec2319150449bb397c95acb9aaa02`;
            break;
      }

      const getUsernameGame = await fetch('https://order-sg.codashop.com/initPayment.action', {
         method: 'POST',
         headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'user-agent':
               'Mozilla/5.0 Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
            'x-session-country2name': 'ID',
            'x-session-key': '',
            'x-xsrf-token': null,
         },
         body: dataBody,
      });

      try {
         const getUsernameGameResponse = await getUsernameGame.json();
         // console.log('getUsernameGameResponse', getUsernameGameResponse?.confirmationFields?.roles);
         if (getUsernameGameResponse.RESULT_CODE && getUsernameGameResponse.RESULT_CODE == 10001)
            return res.status(400).json({ status: false, message: 'Silahkan Coba 5 detik lagi' });
         if (getUsernameGameResponse.success) {
            if (getUsernameGameResponse.result == '')
               return res.status(404).json({ status: false, message: 'ID tidak ditemukan' });
            const result = decodeURIComponent(getUsernameGameResponse.result) || {};
            const newResult = JSON.parse(result) || {};

            return res.status(200).json({
               status: true,
               message: 'ID berhasil ditemukan',
               data: {
                  username: newResult?.username || getUsernameGameResponse?.confirmationFields?.playerName ||getUsernameGameResponse?.confirmationFields?.roles[0]?.role || null,
                  user_id: id,
                  zone: zone || null,
               },
            });
         }

         return res.status(200).json({ status: false, message: getUsernameGameResponse.errorMsg || 'Hubungi Admin' });
      } catch (err) {
         console.log(err);
         return res.status(500).json({ status: false, message: 'Internal Server Error' });
      }
   } else if (game.provider == 'au2mobile') {
      const cekAu = await fetch(`http://dancingidol.uniuhk.com/api/role/info?roleId=${id}`);
      try {
         const cekAuResponse = await cekAu.json();
         if (cekAuResponse.code == 0) {
            return res.status(200).json({
               status: true,
               message: 'ID berhasil ditemukan',
               data: {
                  username: cekAuResponse.data?.rolename,
                  user_id: id,
                  zone: zone || null,
               },
            });
         } else {
            return res.status(404).json({ status: false, message: 'ID tidak ditemukan' });
         }
      } catch (err) {
         console.log(err);
         return res.status(500).json({ status: false, message: 'Internal Server Error' });
      }
   } else if (game.provider == 'roglobal') {
      const cekRo = await fetch(
         `
      https://roglobal.com/api/pay/game/server/roles?server_id=${zone}&open_id=${id}`,
         {
            headers: {
               Accept: '*/*',
               'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
               Sign: '17c72c9d1d0898d0da6b1285983b74ee',
               Timestamp: '1687920476',
            },
         }
      );
      try {
         const cekRoResponse = await cekRo.json();

         if (cekRoResponse.code == 0) {
            if (cekRoResponse.data.list.length == 0) {
               return res.status(404).json({ status: false, message: 'ID tidak ditemukan' });
            } else {
               return res.status(200).json({
                  status: true,
                  message: 'ID berhasil ditemukan',
                  data: {
                     username: cekRoResponse.data?.list[0]?.role_info,
                     user_id: id,
                     zone: game.dropdown.filter((item) => item.zoneId == zone)[0].name || null,
                  },
               });
            }
         } else {
            return res.status(404).json({ status: false, message: 'ID tidak ditemukan' });
         }
      } catch (err) {
         console.log(err);
         return res.status(500).json({ status: false, message: 'Internal Server Error' });
      }
   }
   return res.status(500).json({ status: false, message: 'Cek ID Game Error, Hubungi admin' });
};

const formatedDate = () => {
   const date = new Date();
   const month = date.getMonth() + 1;
   const day = date.getDate();
   const year = date.getFullYear();

   const formattedDate = `${month}/${day}/${year}`;

   return formattedDate;
};
module.exports = { cekIdGameController };
