import { PAYPAL_EXPRESS_CREDIT } from '../component/PayPal/PayPal.config';

export class CheckoutPaymentsContainerPlugin {
    aroundSelectPaymentMethod = (args, callback, instance) => {
        const { setOrderButtonEnableStatus } = instance.props;
        const [something] = args;
        const { code } = something;

        callback.apply(instance, args);

        if (code === PAYPAL_EXPRESS_CREDIT) {
            setOrderButtonEnableStatus(false);
        }
    };
}

const {
    aroundSelectPaymentMethod
} = new CheckoutPaymentsContainerPlugin();

export const config = {
    'Component/CheckoutPayments/Container': {
        'member-function': {
            selectPaymentMethod: aroundSelectPaymentMethod
        }
    }
};

export default config;
