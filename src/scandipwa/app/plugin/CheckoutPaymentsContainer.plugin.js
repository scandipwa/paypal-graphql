import { PAYPAL_EXPRESS_CREDIT } from './CheckoutPayments.plugin'

class CheckoutPaymentsContainerPlugin {
    aroundSelectPaymentMethod = (args, callback, instance) => {
        const { setOrderButtonEnableStatus } = instance.props;
        const [ something ] = args;
        const { code } = something;

        callback.apply(instance, args);

        if (code === PAYPAL_EXPRESS_CREDIT) {
            setOrderButtonEnableStatus(false);
        }
    }
}

const {
    aroundSelectPaymentMethod
} = new CheckoutPaymentsContainerPlugin();

const config = {
    'Component/CheckoutPayments/Container': {
        'instance': {
            'get': {
                'selectPaymentMethod': [
                    {
                        position: 100,
                        implementation: aroundSelectPaymentMethod
                    }
                ]
            }
        }
    }
};

export default config;
