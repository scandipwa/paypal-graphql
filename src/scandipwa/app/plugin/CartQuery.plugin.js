const addBaseFields = (args, callback) => {
    return [
        ...callback(...args),
        'base_grand_total',
        'base_currency_code'
    ];
};

export default {
    'Query/Cart': {
        'member-function': {
            _getCartTotalsFields: addBaseFields
        }
    }
};
