import PayPal from '../component/PayPal';

export const PAYPAL_EXPRESS_CREDIT = 'paypal_express_bml';
export const PAYPAL_EXPRESS = 'paypal_express';

class CheckoutPaymentsPlugin {
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

    aroundPaymentRenderMap = (originalMember, instance) => {
        return {
            ...originalMember,
            [PAYPAL_EXPRESS_CREDIT]: instance.renderNotSupported.bind(instance)
        }
    }

    aroundRenderContent = (args, callback, instance) => {
        return (
            <div>
                { callback.apply(instance, args) }
                { this.renderPayPal.apply(instance) }
            </div>
        )
    }

    aroundComponentDidUpdate = (args, callback = () => {}, instance) => {
        const [ prevProps ] = args;
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
    }
}

const {
    aroundPaymentRenderMap,
    aroundRenderContent,
    aroundComponentDidUpdate
} = new CheckoutPaymentsPlugin();

const config = {
    'Component/CheckoutPayments/Component': {
        'member-function': {
            'renderContent': [
                {
                    position: 100,
                    implementation: aroundRenderContent
                }
            ],
            'componentDidUpdate': [
                {
                    position: 100,
                    implementation: aroundComponentDidUpdate
                }
            ]
        },
        'member-property': {
            'paymentRenderMap': [
                {
                    position: 100,
                    implementation: aroundPaymentRenderMap
                }
            ]
        }
    }
};

export default config;
