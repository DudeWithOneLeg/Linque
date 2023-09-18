'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = 'PostImages'
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   const validImages = [
    {
      postId: 10,
      userId: 3,
      url: 'https://linque.s3.us-east-2.amazonaws.com/1694635267457.jpg',
      data: `[{"name":"Sunglasses","data":[{"x":0.4845166504383087,"y":0.4430145025253296},{"x":0.6304961442947388,"y":0.4430145025253296},{"x":0.6304961442947388,"y":0.5477353930473328},{"x":0.4845166504383087,"y":0.5477353930473328}]},{"name":"Top","data":[{"x":0.24351447820663452,"y":0.5017593502998352},{"x":0.7712680697441101,"y":0.5017593502998352},{"x":0.7712680697441101,"y":0.988298237323761},{"x":0.24351447820663452,"y":0.988298237323761}]}]`,
      results: `{"0":{"matches":[{"position":1,"title":"Lingj Fashion Glasses Metal Frame Fishing Women's Eyewear Round Sun Glasses Shades Women Men Sunglasses Black Gray, Adult Unisex, Size: One size","link":"https://www.walmart.com/ip/Fashion-Glasses-Metal-Frame-Fishing-Women-s-Eyewear-Round-Sun-Glasses-Shades-Women-Men-Sunglasses-BLACK-GRAY/2417895387","source":"Walmart","source_icon":"https://encrypted-tbn3.gstatic.com/favicon-tbn?q=tbn:ANd9GcTty0_uq5QGsSpEA1agUnwTMPZTu_YvS9mg_tzOR2qy22fR-FGLLoSmA4z4XotJkADD4W1gHczZdZT5PEPvM9Sv6mBjhn-lRnHs4p0G3COAlV8EwJE","price":{"value":"$10.26*","extracted_value":10.26,"currency":"$"},"thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJesnAYiSsyY4l3-KZCq_BabVB45KnWuJ9TCEnCE_N6xVgSn3O"},{"position":2,"title":"AO-1002 Sunglasses - AOLite Nylon Lenses - Polarized","link":"https://www.amazon.com/AO-1002-Sunglasses-AOLite-Lenses-Polarized/dp/B0BQX22R8S","source":"Amazon.com","source_icon":"https://encrypted-tbn1.gstatic.com/favicon-tbn?q=tbn:ANd9GcRm4oMDPHDSWBDQhB5-csYIdmVde_ZfnfUYnfzlJJ9w7zjXG34H4SL9TXI2H8XWInsqPagyhBQjtImrHgLv9Bwvw_d2JvfjMfz3ox9yR82MKQ7yrQ","price":{"value":"$250.00*","extracted_value":250,"currency":"$"},"thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSs24f7OVocUz-QC3Vcj9VpYo_16VgcWhZMnE6eytb3-mmZ9q5"},{"position":3,"title":"Round Sunglasses | Oswald Gold with Green Lenses Sunglasses | FINLAY","link":"https://us.finlayandco.com/products/oswald-gold-with-green-lenses","source":"finlayandco.com","source_icon":"https://encrypted-tbn0.gstatic.com/favicon-tbn?q=tbn:ANd9GcT_fBIwEN0a-BI8ENeqTPc0h7WnsEb6Wcdcruhdz5uA_nceY6Sdagpl-cQNitZt2kLK4XmZmEQ-XQrSVtMdKAXNKtBlleOUQ4kd_iTy66EG_iTc808_i2E","price":{"value":"$150.00*","extracted_value":150,"currency":"$"},"thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVR6i_p6TsKXkYFi591qYSHr8Wfm2BDrfYuPeWaVm9-7yyViLY"},{"position":4,"title":"P3 Round Sunglasses in 23k Gold | Randolph USA","link":"https://www.randolphusa.com/products/p3-23k-gold-american-gray","source":"Randolph Engineering","source_icon":"https://encrypted-tbn1.gstatic.com/favicon-tbn?q=tbn:ANd9GcSA9xNUhdtlQY8JXr5oR98DW5QLh1WM5sWEdc0QNe7QJZZT8mH0h7QZI5DeVsDEHRfNbVAxVOu6gqBNT8tRkzT_n3vc5gil9vzQUjldBmBu1moyR_VTl4b_","price":{"value":"$329.00*","extracted_value":329,"currency":"$"},"thumbnail":"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQd3E9ufoxiaoVOoPo-GQOHjQf6037OXzi3wOB2sN9QjqQvAGTH"}],"name":"Sunglasses","image":"https://linque.s3.us-east-2.amazonaws.com/1694635273001.png"},"1":{"matches":[{"position":1,"title":"2xl Cherry Blossom Flower Button Shirt Sakura Floral Spring Xxl Pink","link":"https://www.ebay.com/itm/225273415229","source":"eBay","source_icon":"https://encrypted-tbn0.gstatic.com/favicon-tbn?q=tbn:ANd9GcT5NXsW5qpQoNKtvnEC0sNL88H54opWmBBYIh2gQ3U_SGUU-yc8xV_BfeECVq4HYfwroQsx3k4lpMvjDByZM4KvONyK63j7aI6RPQrDFwRa9lo","price":{"value":"$34.99*","extracted_value":34.99,"currency":"$"},"thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJhbUgDjO82bAr6KFLsSLChu9mNCk4_JH4QknCBqUYIJ5Hyzai"},{"position":2,"title":"Flower Power","link":"https://es.kaiparclothing.com/product-page/flower-power","source":"Kaipar Clothing","source_icon":"https://encrypted-tbn1.gstatic.com/favicon-tbn?q=tbn:ANd9GcTTPDd8yHG2Cg9GsaKoAREUFeTz60iXbFfkyqSozpl3pL46W9EVmK1CNSvNNdveKkmA96BQa2bFKi78oCPgMbVAXaCdi77QLDdGYxHm5bCRXArSHQ7xTXYhPgg","price":{"value":"$49.99*","extracted_value":49.99,"currency":"$"},"thumbnail":"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcREaCByErnKBpcyBRhIe3gnuF01hICpvdi9iqRn-Vlg2Nq4AEEZ"},{"position":3,"title":"Mens Shirt for Sale in Kyle, TX - OfferUp","link":"https://offerup.com/item/detail/1529119391","source":"OfferUp","source_icon":"https://encrypted-tbn1.gstatic.com/favicon-tbn?q=tbn:ANd9GcQOpn8VGWE4WTPZ8ydi0mIUqrcXCa_ZGdiYvmSvv1ZTfocziUicxQd6cA902k4n4Iltki0oLHp-19WnwtXmnl0VkrXpSxjkv8AOsbdoHE_4yg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzXm78ik_c5t23gou_TQzEKglCiVj_pJFRbYBs1HdaPmekGTkt"},{"position":4,"title":"Xacus Male Shirt Midnight blue Size 16 Cotton","link":"https://www.yoox.com/us/10199091CO/item","source":"YOOX","source_icon":"https://encrypted-tbn2.gstatic.com/favicon-tbn?q=tbn:ANd9GcSpVo1Fw7ZSTAUmNACTRj_IBocjwFonDlzg5uMTsX-cIN4aZu4izX_0BUxOXkw_-zigYnu_PMkeBYtBzRUKgsKQzY52PmAg36A-TGeX-u3G9fU","price":{"value":"$88.00*","extracted_value":88,"currency":"$"},"thumbnail":"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQzf_jROF60tM67KbkIca3Qy2kJ8SJtCCO44XgD4_qga4vvUbAi"}],"name":"Top","image":"https://linque.s3.us-east-2.amazonaws.com/1694635273017.png"}}`
    }
   ]
   await queryInterface.bulkInsert(options, validImages, {})

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(options, {
      id: [1]
    }, {})
  }
};
