import PayPal from '../component/PayPal';
import { PAYPAL_EXPRESS, PAYPAL_EXPRESS_CREDIT } from '../component/PayPal/PayPal.config';

export class CheckoutPaymentsPlugin {
    renderPayPal() {
        const {
            selectedPaymentCode,
            setLoading,
            setDetailsStep
        } = this.props;

        return (
            <PayPal
              setLoading={ setLoading }
              setDetailsStep={ setDetailsStep }
              selectedPaymentCode={ selectedPaymentCode }
            />
        );
    }

    aroundPaymentRenderMap = (originalMember, instance) => ({
        ...originalMember,
        [PAYPAL_EXPRESS_CREDIT]: instance.renderNotSupported.bind(instance)
    });

    aroundRenderContent = (args, callback, instance) => (
            <div>
                { callback.apply(instance, args) }
                { this.renderPayPal.apply(instance) }
            </div>
    );

    aroundComponentDidUpdate = (args, callback = () => {}, instance) => {
        const [prevProps] = args;
        const { selectedPaymentCode, setOrderButtonVisibility } = instance.props;
        const { selectedPaymentCode: prevSelectedPaymentCode } = prevProps;

        if (selectedPaymentCode !== prevSelectedPaymentCode) {
            if (selectedPaymentCode === PAYPAL_EXPRESS) {
                setOrderButtonVisibility(false);
            }

            if (prevSelectedPaymentCode === PAYPAL_EXPRESS) {
                setOrderButtonVisibility(true);
            }
        }

        callback.apply(instance, args);
    };
}

const {
    aroundPaymentRenderMap,
    aroundRenderContent,
    aroundComponentDidUpdate
} = new CheckoutPaymentsPlugin();

export const config = {
    'Component/CheckoutPayments/Component': {
        'member-function': {
            renderContent: aroundRenderContent,
            componentDidUpdate: aroundComponentDidUpdate
        },
        'member-property': {
            paymentRenderMap: aroundPaymentRenderMap
        }
    }
};

export default config;
