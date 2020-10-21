const addPaypalFields = (args, callback, instance) => ([
    ...callback(...args),
    'paypal_sandbox_flag',
    'paypal_client_id'
]);

export default {
    'Query/Config': {
        'member-function': {
            _getStoreConfigFields: addPaypalFields
        }
    }
}
