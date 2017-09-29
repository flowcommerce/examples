const assert = require('assert-diff');
const conversions = require('../../lib/conversions');

describe('conversions', function() {
    it('should convert dynamo JSON', function() {
        const dynamoItem = JSON.parse(`{
                "organizationId": {
                    "S": "gilt"
                },
                "number": {
                    "S": "7791017"
                },
                "price_details": {
                    "M": {
                        "local": {
                            "M": {
                                "margins": {
                                    "S": "{\\"key\\":\\"margins\\",\\"components\\":[{\\"key\\":\\"currency_margin\\",\\"amount\\":0,\\"label\\":\\"£0.00\\",\\"name\\":\\"Currency margin\\"},{\\"key\\":\\"percent_item_margin\\",\\"amount\\":0,\\"label\\":\\"£0.00\\",\\"name\\":\\"Percent item margin\\"},{\\"key\\":\\"fixed_item_margin\\",\\"amount\\":0,\\"label\\":\\"£0.00\\",\\"name\\":\\"Fixed item margin\\"}],\\"amount\\":0,\\"label\\":\\"£0.00\\",\\"name\\":\\"Margins\\"}"
                                },
                                "total": {
                                    "S": "{\\"amount\\":113.99,\\"currency\\":\\"GBP\\",\\"label\\":\\"£113.99\\"}"
                                },
                                "item_price": {
                                    "S": "{\\"key\\":\\"item_price\\",\\"components\\":[{\\"key\\":\\"base_price\\",\\"amount\\":84.62,\\"label\\":\\"£84.62\\",\\"name\\":\\"Base item price\\"},{\\"key\\":\\"discount\\",\\"amount\\":0,\\"label\\":\\"£0.00\\",\\"name\\":\\"Discount\\"}],\\"amount\\":84.62,\\"label\\":\\"£84.62\\",\\"name\\":\\"Item price\\"}"
                                },
                                "price": {
                                    "S": "{\\"amount\\":113.99,\\"currency\\":\\"GBP\\",\\"label\\":\\"£113.99\\"}"
                                },
                                "vat": {
                                    "S": "{\\"key\\":\\"vat\\",\\"components\\":[{\\"key\\":\\"vat_item_price\\",\\"amount\\":16.92,\\"label\\":\\"£16.92\\",\\"name\\":\\"VAT on item price\\"},{\\"key\\":\\"vat_added_margin\\",\\"amount\\":0,\\"label\\":\\"£0.00\\",\\"name\\":\\"VAT on added margin\\"},{\\"key\\":\\"vat_rounding\\",\\"amount\\":0.04,\\"label\\":\\"£0.04\\",\\"name\\":\\"VAT on rounding\\"},{\\"key\\":\\"vat_duties_item_price\\",\\"amount\\":2.03,\\"label\\":\\"£2.03\\",\\"name\\":\\"VAT on duties on item price\\"},{\\"key\\":\\"vat_duties_added_margin\\",\\"amount\\":0,\\"label\\":\\"£0.00\\",\\"name\\":\\"VAT on duties on added margin\\"},{\\"key\\":\\"vat_duties_rounding\\",\\"amount\\":0,\\"label\\":\\"£0.00\\",\\"name\\":\\"VAT on duties on rounding\\"},{\\"key\\":\\"vat_deminimis\\",\\"amount\\":0,\\"label\\":\\"£0.00\\",\\"name\\":\\"VAT de minimis adjustment\\"}],\\"amount\\":18.99,\\"label\\":\\"£18.99\\",\\"name\\":\\"VAT\\"}"
                                },
                                "duty": {
                                    "S": "{\\"key\\":\\"duty\\",\\"components\\":[{\\"key\\":\\"duties_item_price\\",\\"amount\\":10.15,\\"label\\":\\"£10.15\\",\\"name\\":\\"Duties on item price\\"},{\\"key\\":\\"duties_added_margin\\",\\"amount\\":0,\\"label\\":\\"£0.00\\",\\"name\\":\\"Duties on added margin\\"},{\\"key\\":\\"duties_rounding\\",\\"amount\\":0.02,\\"label\\":\\"£0.02\\",\\"name\\":\\"Duties on rounding\\"},{\\"key\\":\\"duties_deminimis\\",\\"amount\\":0,\\"label\\":\\"£0.00\\",\\"name\\":\\"Duties de minimis adjustment\\"}],\\"amount\\":10.17,\\"label\\":\\"£10.17\\",\\"name\\":\\"Duties\\"}"
                                },
                                "rounding": {
                                    "S": "{\\"key\\":\\"rounding\\",\\"components\\":[],\\"amount\\":0.21,\\"label\\":\\"£0.21\\",\\"name\\":\\"Rounding\\"}"
                                },
                                "currency": {
                                    "S": "\\"GBP\\""
                                }
                            }
                        },
                        "base": {
                            "M": {
                                "margins": {
                                    "S": "{\\"key\\":\\"margins\\",\\"components\\":[{\\"key\\":\\"currency_margin\\",\\"amount\\":0,\\"label\\":\\"$0.00\\",\\"name\\":\\"Currency margin\\"},{\\"key\\":\\"percent_item_margin\\",\\"amount\\":0,\\"label\\":\\"$0.00\\",\\"name\\":\\"Percent item margin\\"},{\\"key\\":\\"fixed_item_margin\\",\\"amount\\":0,\\"label\\":\\"$0.00\\",\\"name\\":\\"Fixed item margin\\"}],\\"amount\\":0,\\"label\\":\\"$0.00\\",\\"name\\":\\"Margins\\"}"
                                },
                                "total": {
                                    "S": "{\\"amount\\":146.82,\\"currency\\":\\"USD\\",\\"label\\":\\"$146.82\\"}"
                                },
                                "item_price": {
                                    "S": "{\\"key\\":\\"item_price\\",\\"components\\":[{\\"key\\":\\"base_price\\",\\"amount\\":109,\\"label\\":\\"$109.00\\",\\"name\\":\\"Base item price\\"},{\\"key\\":\\"discount\\",\\"amount\\":0,\\"label\\":\\"$0.00\\",\\"name\\":\\"Discount\\"}],\\"amount\\":109,\\"label\\":\\"$109.00\\",\\"name\\":\\"Item price\\"}"
                                },
                                "price": {
                                    "S": "{\\"amount\\":146.82,\\"currency\\":\\"USD\\",\\"label\\":\\"$146.82\\"}"
                                },
                                "vat": {
                                    "S": "{\\"key\\":\\"vat\\",\\"components\\":[{\\"key\\":\\"vat_item_price\\",\\"amount\\":21.79,\\"label\\":\\"$21.79\\",\\"name\\":\\"VAT on item price\\"},{\\"key\\":\\"vat_added_margin\\",\\"amount\\":0,\\"label\\":\\"$0.00\\",\\"name\\":\\"VAT on added margin\\"},{\\"key\\":\\"vat_rounding\\",\\"amount\\":0.05,\\"label\\":\\"$0.05\\",\\"name\\":\\"VAT on rounding\\"},{\\"key\\":\\"vat_duties_item_price\\",\\"amount\\":2.61,\\"label\\":\\"$2.61\\",\\"name\\":\\"VAT on duties on item price\\"},{\\"key\\":\\"vat_duties_added_margin\\",\\"amount\\":0,\\"label\\":\\"$0.00\\",\\"name\\":\\"VAT on duties on added margin\\"},{\\"key\\":\\"vat_duties_rounding\\",\\"amount\\":0,\\"label\\":\\"$0.00\\",\\"name\\":\\"VAT on duties on rounding\\"},{\\"key\\":\\"vat_deminimis\\",\\"amount\\":0,\\"label\\":\\"$0.00\\",\\"name\\":\\"VAT de minimis adjustment\\"}],\\"amount\\":24.45,\\"label\\":\\"$24.45\\",\\"name\\":\\"VAT\\"}"
                                },
                                "duty": {
                                    "S": "{\\"key\\":\\"duty\\",\\"components\\":[{\\"key\\":\\"duties_item_price\\",\\"amount\\":13.07,\\"label\\":\\"$13.07\\",\\"name\\":\\"Duties on item price\\"},{\\"key\\":\\"duties_added_margin\\",\\"amount\\":0,\\"label\\":\\"$0.00\\",\\"name\\":\\"Duties on added margin\\"},{\\"key\\":\\"duties_rounding\\",\\"amount\\":0.03,\\"label\\":\\"$0.03\\",\\"name\\":\\"Duties on rounding\\"},{\\"key\\":\\"duties_deminimis\\",\\"amount\\":0,\\"label\\":\\"$0.00\\",\\"name\\":\\"Duties de minimis adjustment\\"}],\\"amount\\":13.1,\\"label\\":\\"$13.10\\",\\"name\\":\\"Duties\\"}"
                                },
                                "rounding": {
                                    "S": "{\\"key\\":\\"rounding\\",\\"components\\":[],\\"amount\\":0.27,\\"label\\":\\"$0.27\\",\\"name\\":\\"Rounding\\"}"
                                },
                                "currency": {
                                    "S": "\\"USD\\""
                                }
                            }
                        }
                    }
                },
                "organizationId:subcatalogId:number": {
                    "S": "gilt:sca-12cf102129c343d998c2b07f08408e58:7791017"
                },
                "localized_item": {
                    "M": {
                        "number": {
                            "S": "7791017"
                        },
                        "images": {
                            "S": "[]"
                        },
                        "price": {
                            "N": "109"
                        },
                        "name": {
                            "S": "THERMAL HENELY DRESS"
                        },
                        "description": {
                            "NULL": true
                        },
                        "currency": {
                            "S": "USD"
                        },
                        "attributes": {
                            "S": "{\\"is_international\\":\\"true\\",\\"gilt_style_number\\":\\"wcth6320cu\\",\\"product_category_key\\":\\"apparel_womens_dresses_day_short\\",\\"base_price\\":\\"0.0\\",\\"product_category_key_4\\":\\"apparel_womens_dresses_day_short\\",\\"size\\":\\"0\\",\\"division_name\\":\\"Women\\",\\"buy_types\\":\\"cutting\\",\\"brand_id\\":\\"5622489\\",\\"is_brand_international\\":\\"true\\",\\"public_url\\":\\"http://www.gilt.com/sale/men/public/product/1203413862\\",\\"upc\\":\\"1000077910171\\",\\"is_ormd\\":\\"false\\",\\"msrp_price\\":\\"225.0\\",\\"product_look_id\\":\\"1203413862\\",\\"product_category_key_2\\":\\"apparel_womens_dresses\\",\\"sale_price\\":\\"109.0\\",\\"origin\\":\\"admin\\",\\"brand_name\\":\\"James Perse\\",\\"product_category_shipping_class\\":\\"Standard\\",\\"division_key\\":\\"all / gilt / women\\",\\"product_id\\":\\"1203413861\\",\\"product_category_key_1\\":\\"apparel_womens\\",\\"vendor_bar_code\\":\\"190020558336\\",\\"vendor_style_number\\":\\"wcth6320cu\\",\\"material\\":\\"51% COTTON / 49% MODAL\\",\\"product_category_key_3\\":\\"apparel_womens_dresses_day\\",\\"product_category_name\\":\\"Day short\\",\\"velocity\\":\\"50\\",\\"nrf_code\\":\\"1\\",\\"vendor_color\\":\\"black\\",\\"product_category_key_0\\":\\"apparel\\",\\"gilt_color\\":\\"black\\",\\"is_product_international\\":\\"true\\"}"
                        },
                        "id": {
                            "S": "sci-0054e23c8c1a4d3a93709413aed18860"
                        },
                        "categories": {
                            "S": "[\\"Apparel\\",\\"Women apparel\\",\\"Dresses\\",\\"Day\\",\\"Day short\\"]"
                        },
                        "locale": {
                            "S": "en_US"
                        },
                        "local": {
                            "S": "{\\"experience\\":{\\"id\\":\\"exp-212d49b4c1384f6f96a6dcb3ff4bf98b\\",\\"key\\":\\"united-kingdom\\",\\"name\\":\\"United Kingdom\\",\\"country\\":\\"GBR\\",\\"currency\\":\\"GBP\\",\\"language\\":\\"en\\"},\\"prices\\":[{\\"currency\\":\\"GBP\\",\\"amount\\":113.99,\\"label\\":\\"£113.99\\",\\"base\\":{\\"amount\\":146.82,\\"currency\\":\\"USD\\",\\"label\\":\\"$146.82\\"},\\"includes\\":{\\"key\\":\\"vat_and_duty\\",\\"label\\":\\"Includes VAT and duty\\"},\\"key\\":\\"localized_item_price\\"}],\\"rates\\":[],\\"spot_rates\\":[],\\"status\\":\\"included\\",\\"attributes\\":{\\"is_international\\":\\"true\\",\\"gilt_style_number\\":\\"wcth6320cu\\",\\"product_category_key\\":\\"apparel_womens_dresses_day_short\\",\\"base_price\\":\\"0.0\\",\\"product_category_key_4\\":\\"apparel_womens_dresses_day_short\\",\\"size\\":\\"0\\",\\"division_name\\":\\"Women\\",\\"buy_types\\":\\"cutting\\",\\"brand_id\\":\\"5622489\\",\\"is_brand_international\\":\\"true\\",\\"public_url\\":\\"http://www.gilt.com/sale/men/public/product/1203413862\\",\\"upc\\":\\"1000077910171\\",\\"is_ormd\\":\\"false\\",\\"msrp_price\\":\\"234.99\\",\\"product_look_id\\":\\"1203413862\\",\\"product_category_key_2\\":\\"apparel_womens_dresses\\",\\"sale_price\\":\\"113.99\\",\\"origin\\":\\"admin\\",\\"brand_name\\":\\"James Perse\\",\\"product_category_shipping_class\\":\\"Standard\\",\\"division_key\\":\\"all / gilt / women\\",\\"product_id\\":\\"1203413861\\",\\"product_category_key_1\\":\\"apparel_womens\\",\\"vendor_bar_code\\":\\"190020558336\\",\\"vendor_style_number\\":\\"wcth6320cu\\",\\"material\\":\\"51% COTTON / 49% MODAL\\",\\"product_category_key_3\\":\\"apparel_womens_dresses_day\\",\\"product_category_name\\":\\"Day short\\",\\"velocity\\":\\"50\\",\\"nrf_code\\":\\"1\\",\\"vendor_color\\":\\"black\\",\\"product_category_key_0\\":\\"apparel\\",\\"gilt_color\\":\\"black\\",\\"is_product_international\\":\\"true\\"},\\"price_attributes\\":{\\"base_price\\":{\\"currency\\":\\"GBP\\",\\"amount\\":0,\\"label\\":\\"£0.00\\",\\"base\\":{\\"amount\\":0,\\"currency\\":\\"USD\\",\\"label\\":\\"$0.00\\"}},\\"msrp_price\\":{\\"currency\\":\\"GBP\\",\\"amount\\":234.99,\\"label\\":\\"£234.99\\",\\"base\\":{\\"amount\\":302.7,\\"currency\\":\\"USD\\",\\"label\\":\\"$302.70\\"}},\\"sale_price\\":{\\"currency\\":\\"GBP\\",\\"amount\\":113.99,\\"label\\":\\"£113.99\\",\\"base\\":{\\"amount\\":146.82,\\"currency\\":\\"USD\\",\\"label\\":\\"$146.82\\"}}}}"
                        },
                        "dimensions": {
                            "S": "{}"
                        }
                    }
                },
                "subcatalogId": {
                    "S": "sca-12cf102129c343d998c2b07f08408e58"
                },
                "status": {
                    "S": "included"
                }
            }`);

            const expected = JSON.parse(`{
                "id": "sci-0054e23c8c1a4d3a93709413aed18860",
                "experience": {
                  "id": "exp-212d49b4c1384f6f96a6dcb3ff4bf98b",
                  "key": "united-kingdom",
                  "name": "United Kingdom",
                  "country": "GBR",
                  "currency": "GBP",
                  "language": "en"
                },
                "item": {
                  "id": "sci-0054e23c8c1a4d3a93709413aed18860",
                  "number": "7791017"
                },
                "pricing": {
                  "price": {
                    "currency": "GBP",
                    "amount": 113.99,
                    "label": "£113.99",
                    "base": {
                      "amount": 146.82,
                      "currency": "USD",
                      "label": "$146.82"
                    },
                    "includes": {
                      "key": "vat_and_duty",
                      "label": "Includes VAT and duty"
                    },
                    "key": "localized_item_price"
                  },
                  "attributes": {
                    "base_price": {
                      "currency": "GBP",
                      "amount": 0,
                      "label": "£0.00",
                      "base": {
                        "amount": 0,
                        "currency": "USD",
                        "label": "$0.00"
                      }
                    },
                    "msrp_price": {
                      "currency": "GBP",
                      "amount": 234.99,
                      "label": "£234.99",
                      "base": {
                        "amount": 302.7,
                        "currency": "USD",
                        "label": "$302.70"
                      }
                    },
                    "sale_price": {
                      "currency": "GBP",
                      "amount": 113.99,
                      "label": "£113.99",
                      "base": {
                        "amount": 146.82,
                        "currency": "USD",
                        "label": "$146.82"
                      }
                    }
                  }
                },
                "status": "included"
              }`);

            const result = conversions.dynamoToLocalItem(dynamoItem);

            assert.options.strict = true;
            assert.deepEqual(expected, result);
    });
});