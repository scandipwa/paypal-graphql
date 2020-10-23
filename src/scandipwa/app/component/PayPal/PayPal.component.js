/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import './PayPal.style';

import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Html from 'Component/Html';
import Loader from 'Component/Loader';
import { TotalsType } from 'Type/MiniCart';

import { PAYPAL_SCRIPT } from './PayPal.config';

/**
 * *Note*
 * This component currently can be rendered only once
 * Please try to have no more than 1 component per page and use isDisabled to hide it.
 * @namespace Scandipwa/PayPalGraphQl/Component/PayPal/Component
*/
export class PayPal extends PureComponent {
    static propTypes = {
        isDisabled: PropTypes.bool,
        paypal: PropTypes.any.isRequired,
        clientId: PropTypes.string.isRequired,
        cartTotals: TotalsType.isRequired,
        onError: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        onApprove: PropTypes.func.isRequired,
        createOrder: PropTypes.func.isRequired,
        environment: PropTypes.oneOf([
            'production',
            'sandbox'
        ]).isRequired
    };

    static defaultProps = {
        isDisabled: false
    };

    getClientId = () => {
        const {
            clientId,
            environment
        } = this.props;

        if (environment === 'sandbox') {
            return 'sb';
        }

        return clientId;
    }

    getPayPalScript = () => {
        const {
            cartTotals: { base_currency_code },
        } = this.props;

        const params = {
            currency: base_currency_code,
            // TODO implement action fetch from BE
            intent: 'authorize',
            'client-id': this.getClientId()
        };

        const paramsString = (Object.entries(params).map(([key, value]) => `${key}=${value}`)).join('&');

        return `<script id="${PAYPAL_SCRIPT}" src="https://www.paypal.com/sdk/js?${paramsString}"></script>`;
    };

    renderButtons() {
        const {
            paypal,
            onError,
            onCancel,
            onApprove,
            createOrder,
            environment
        } = this.props;

        if (!paypal) {
            return <Loader isLoading />;
        }

        const PayPalButton = paypal && paypal.Buttons.driver('react', { React, ReactDOM });

        return (
            <PayPalButton
              env={ environment }
              onError={ onError }
              onCancel={ onCancel }
              onApprove={ onApprove }
              createOrder={ createOrder }
              style={ {
                  layout: 'horizontal',
                  label: 'pay'
              } }
            />
        );
    }

    render() {
        const { isDisabled } = this.props;

        return (
            <div block="Checkout-StickyButtonWrapper">
                <div block="PayPal" mods={ { isDisabled } }>
                    <Html content={ this.getPayPalScript() } />
                    { this.renderButtons() }
                </div>
            </div>
        );
    }
}

export default PayPal;
