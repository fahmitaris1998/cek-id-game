const slugify = require('slugify');
const fs = require('fs');
const _ = require('lodash');
const fetch = require('node-fetch');

(async () => {
   /* Codashop */

   let datas = [];

   const getUrl = await fetch('https://api-sg.codashop.com/spring/api/graphql', {
      method: 'POST',
      headers: {
         'content-type': 'application/json',
      },
      body: JSON.stringify({
         operationName: 'GetHomePageInfo',
         variables: {
            countryCodes: ['id'],
            shopLang: '',
         },
         query: 'query GetHomePageInfo($countryCodes: [String], $shopLang: String) {\n  getHomePageInfo(countryCodes: $countryCodes, shopLang: $shopLang) {\n    data {\n      feedSections {\n        name\n        id\n        type\n        tagLine\n        __typename\n      }\n      sortParameters {\n        title\n        params {\n          id\n          name\n          __typename\n        }\n        __typename\n      }\n      feedBanners {\n        cycleTime\n        feedSectionId\n        images {\n          altText\n          href\n          srcUrl\n          startTime\n          endTime\n          __typename\n        }\n        __typename\n      }\n      feedProducts {\n        feedSectionId\n        products {\n          thumbnailUrl\n          productName\n          productUrl\n          sale {\n            enabled\n            text\n            __typename\n          }\n          createdDate\n          popularity\n          __typename\n        }\n        __typename\n      }\n      feedNewsPromo {\n        feedSectionId\n        content {\n          altText\n          endTime\n          imageUrl\n          newsPromotionsUrl\n          title\n          startTime\n          subTitle\n          __typename\n        }\n        __typename\n      }\n      feedAbout {\n        feedSectionId\n        subTitle\n        description\n        content {\n          altText\n          imageUrl\n          title\n          subTitle\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    status\n    __typename\n  }\n}\n',
      }),
   });

   const getUrlResponse = await getUrl.json();

   const oldUrl = [
      ...getUrlResponse.data.getHomePageInfo.data[0].feedProducts[0].products,
      ...getUrlResponse.data.getHomePageInfo.data[0].feedProducts[1].products,
      ...getUrlResponse.data.getHomePageInfo.data[0].feedProducts[2].products,
      ...getUrlResponse.data.getHomePageInfo.data[0].feedProducts[3].products,
   ];

   const url = oldUrl.map((item) => {
      return `/id/${item.productUrl.replaceAll('/id-id/', '')}`;
   });

   // console.log(newUrl);

   // let url = ['/id/hyper-front'];

   let abc = async () => {
      for (let i = 0; i < url.length; i++) {
         const response = await fetch(`https://api-sg.codashop.com/spring/api/graphql`, {
            method: 'POST',
            headers: {
               'content-type': 'application/json',
            },
            body: JSON.stringify({
               operationName: 'GetProductPageInfo',
               variables: {
                  productUrl: url[i],
                  shopLang: '',
               },
               query: 'query GetProductPageInfo($productUrl: String!, $shopLang: String) {\n  getProductPageInfo(productUrl: $productUrl, shopLang: $shopLang) {\n    gameUserInput {\n      sectionTitle\n      imageHelperUrl\n      instructionText\n      fields {\n        data {\n          text\n          value\n          parentValue\n          __typename\n        }\n        placeHolder\n        publisher\n        logoutUrl\n        type\n        name\n        displayMode\n        displayOnly\n        parentField\n        regexName\n        hasParenthesis\n        hasCountryCode\n        length\n        value\n        scope\n        oauthUrl\n        responseType\n        clientId\n        __typename\n      }\n      voucherSectionTitle\n      voucherCategorySectionTitle\n      voucherItemSectionTitle\n      paymentSectionTitle\n      buySectionTitle\n      __typename\n    }\n    productInfo {\n      id\n      gvtId\n      name\n      shortName\n      productTagline\n      shortDescription\n      longDescription\n      metaDescription\n      logoLocation\n      productUrl\n      voucherTypeName\n      voucherTypeId\n      orderUrl\n      productTitle\n      variableDenomPriceMinAmount\n      variableDenomPriceMaxAmount\n      __typename\n    }\n    denominationGroups {\n      displayText\n      displayId\n      pricePoints {\n        id\n        bestdeal\n        paymentChannel {\n          id\n          displayName\n          imageUrl\n          status\n          tagline\n          sortOrder\n          tutorialType\n          tutorialURL\n          statusMessage\n          tutorialLabel\n          isPromotion\n          promotionText\n          isMno\n          infoMessages {\n            icon\n            text\n            __typename\n          }\n          __typename\n        }\n        price {\n          currency\n          amount\n          __typename\n        }\n        isVariablePrice\n        hasDiscount\n        publisherPrice\n        __typename\n      }\n      strikethroughPrice\n      sortOrderId\n      hasStock\n      status\n      isVariableDenom\n      denomImageUrl\n      denomCategoryId\n      denomDetailsTitle\n      denomDetailsImageUrl\n      originalSku\n      voucherId\n      flashSalePromoDetail {\n        promoUsage\n        promoEndDate\n        __typename\n      }\n      __typename\n    }\n    paymentChannels {\n      id\n      displayName\n      imageUrl\n      status\n      sortOrder\n      isPromotion\n      promotionText\n      isMno\n      buyInputs {\n        label\n        buyInputFields {\n          type\n          required\n          placeHolder\n          minLength\n          maxLength\n          name\n          regexName\n          hasCountryCode\n          __typename\n        }\n        __typename\n      }\n      infoMessages {\n        icon\n        text\n        __typename\n      }\n      surchargeNote\n      surchargeLink\n      isRiskCheckingEnabled\n      __typename\n    }\n    faqs {\n      question\n      answer\n      __typename\n    }\n    confirmationDialogSchema {\n      confirmationFields {\n        label\n        value {\n          type\n          field\n          __typename\n        }\n        __typename\n      }\n      invalidUserErrorSchema {\n        errorHeader\n        errorMessage\n        fieldName\n        __typename\n      }\n      __typename\n    }\n    hrefLinks {\n      hrefLang\n      href\n      __typename\n    }\n    cashbackCampaign {\n      campaignId\n      percentage\n      paymentChannelIds\n      skus\n      description\n      cashbackDenomPrice {\n        paymentChannelId\n        voucherId\n        cashbackPrice\n        __typename\n      }\n      qualifyingUsers\n      __typename\n    }\n    displayImage\n    denominationCategories {\n      id\n      parentId\n      sortOrder\n      level\n      name\n      title\n      subTitle\n      description\n      imageUrl\n      __typename\n    }\n    isShowProvince\n    capturedPurchase {\n      purchaseDate\n      denomId\n      paymentChannelId\n      email\n      mobile\n      boletoFirstName\n      boletoLastName\n      boletoDOB\n      boletoCPFNumber\n      userId\n      zoneId\n      denomCategoryId\n      __typename\n    }\n    reviewSummary {\n      isDisabledInCMS\n      starLabel\n      starRatingUrl\n      trustScore\n      totalReviews\n      __typename\n    }\n    enablePromoCode\n    enableGifting\n    __typename\n  }\n}\n',
            }),
         });
         const data = await response.json();
         console.log(data);
         const antiPricePoint = data.data?.getProductPageInfo?.denominationGroups[2]?.pricePoints.findIndex(
            (item) => item.price.amount != '0.0'
         );

         console.log(data.data?.getProductPageInfo?.productInfo?.name);
         datas.push({
            id: 2000 + i,
            name: data.data?.getProductPageInfo?.productInfo?.name,
            slug: slugify(data.data?.getProductPageInfo?.productInfo?.name || 'test' + i, {
               remove: /[*+~.()'"!:@]/g,
               lower: true,
            }),
            isZone:
               data.data.getProductPageInfo?.gameUserInput?.fields[1]?.name === 'zoneId' &&
               data.data.getProductPageInfo?.gameUserInput?.fields[1]?.type !== 'hidden'
                  ? true
                  : false,
            provider: 'codashop',
            voucherTypeName: data.data?.getProductPageInfo?.productInfo?.voucherTypeName,
            priceId: data.data?.getProductPageInfo?.denominationGroups[2]?.pricePoints[antiPricePoint]?.id,
            price: data.data?.getProductPageInfo?.denominationGroups[2]?.pricePoints[antiPricePoint]?.price?.amount,
            gvtId: data.data?.getProductPageInfo?.productInfo?.gvtId,
            voucherTypeId: data.data?.getProductPageInfo?.productInfo?.voucherTypeId,

            dropdown: data.data?.getProductPageInfo?.gameUserInput?.fields[1]?.data?.map((item) => {
               return {
                  zoneId: item.value,
                  name: item.text,
               };
            }),
         });
      }
   };

   await abc();
   fs.writeFile('./lib/codashop.json', JSON.stringify({ data: datas }), 'utf8', function (err) {
      if (err) {
         console.log('An error occured while writing JSON Object to File.');
         return console.log(err);
      }

      console.log('JSON file has been saved.');
   });
})();
