import PayPal from '../app/component/PayPal';

export const PAYPAL_EXPRESS_CREDIT = 'paypal_express_bml';
export const PAYPAL_EXPRESS = 'paypal_express';

export class PayPalPlugin extends ExtensibleClass {
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

    /**
     * Args are available for functions which are class members
     * Plugin member that references plugin's other members should be bound to it by using arrow functions
     * @param {Array} args
     * @param {Function} callback
     * @param {Object} instance
     */
    aroundRenderContent = (args, callback, instance) => {
        return (
            <div>
                { callback(args) }
                { this.renderPayPal.call(instance) }
            </div>
        );
    }

    /**
     * Args are not available for class properties which are not functions
     * @param {Object} originalMember
     * @param {Object} instance
     */
    paymentRenderMap(originalMember, instance) {
        return {
            ...originalMember,
            [PAYPAL_EXPRESS_CREDIT]: instance.renderNotSupported.bind(instance)
        };
    }

    /**
     * The componentDidUpdate function is not present in the original class.
     * It is trying to be retrieved by React during the component's lifecycle
     * This call is intercepted by plugin and provided implementation is executed.
     */
    componentDidUpdate(args, callback = () => {}, instance) {
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

        return callback.apply(instance, args);
    }

    /**
     * Disable order completion button if unsupported payment method selected.
     */
    controlOrderButton(args, callback, instance) {
        callback.apply(instance, args);
        const { code } = args[0];
        if (code === PAYPAL_EXPRESS_CREDIT) {
            const { props: { setOrderButtonEnableStatus } } = instance;
            setOrderButtonEnableStatus.call(instance, false);
        }
    }
}

const {
    aroundRenderContent,
    componentDidUpdate,
    paymentRenderMap,
    controlOrderButton
} = new (middleware(PayPalPlugin, 'Plugin/ScandiPWA/Paypal'))();

const config = {
    'Component/CheckoutPayments/Component': {
        // Target type: instance or class
        'instance': {
            // Handler type: get (for both instance and class) or construct (for class only)
            'get': {
                'renderContent': [
                    {
                        position: 100,
                        implementation: aroundRenderContent
                    }
                ],
                'componentDidUpdate': [
                    {
                        position: 100,
                        implementation: componentDidUpdate
                    }
                ]
            }
        },
        'class': {
            'construct': {
                'paymentRenderMap': [
                    {
                        position: 100,
                        implementation: paymentRenderMap
                    }
                ]
            }
        }
    },
    'Component/CheckoutPayments/Container': {
        'instance': {
            'get': {
                'selectPaymentMethod': [
                    {
                        position: 100,
                        implementation: controlOrderButton
                    }
                ]
            }
        }
    }
};

export default config;