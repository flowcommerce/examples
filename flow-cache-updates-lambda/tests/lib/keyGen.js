const assert = require('assert');
const keygen = require('../../lib/keygen');


describe('keygen functions', function () {
    describe('localizedItem', function () {
        it('should return the correct key', function () {
            const fixture = {
                'id': 'sci-8dec2156469549c9af2b8900aabc9b6b',
                'experience': {
                    'id': 'exp-f1ea2b9d16aa49669d9e975ade9e04d3',
                    'key': 'france',
                    'name': 'France',
                    'country': 'FRA',
                    'currency': 'EUR',
                    'language': 'fr'
                },
                'item': {
                    'id': 'sci-8dec2156469549c9af2b8900aabc9b6b',
                    'number': '6258502'
                },
                'pricing': {
                    'price': {
                        'currency': 'EUR',
                        'amount': 125.88,
                        'label': '125,88 €',
                        'base': {
                            'amount': 143.16,
                            'currency': 'USD',
                            'label': '$143.16'
                        },
                        'includes': {
                            'key': 'vat',
                            'label': 'Includes VAT'
                        }
                    },
                    'attributes': {}
                },
                'status': 'included'
            };

            const actual = keygen.localizedItem(fixture);
            const expected = 'country-FRA:6258502';

            assert.equal(actual, expected);
        });
    });
});