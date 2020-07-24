### PayPal extension for ScandiPWA

> **Note 1:** PayPal credit payment method is not yet supported.

> **Note 2:** You are required to enter one additional field `API Client ID` in PayPal configuration. Obtainable in account configuration.

Paypal is implemented via the "magic button", which looks like this:

![image](https://user-images.githubusercontent.com/29531824/69438428-af206480-0d4d-11ea-9450-b9152088e5e2.png)

To configure:
- Signup here: https://www.paypal.com/signin/client?flow=provisionUser&country.x=US&locale.x=en_US
- Login here: https://www.paypal.com/signin?intent=developer&returnUri=https%3A%2F%2Fdeveloper.paypal.com%2Fdeveloper%2Fapplications
- Go to `REST API apps`, create new one
- From `SANDBOX API CREDENTIALS` copy the `Client ID` use it fill `API Client ID`
- In the sidebar go to `SANDBOX > Accounts`
- Hover on triple dots on the right side of the business account, select `View / Edit account`
- Go to `API Credentials` and fill data from there to Magento 2 admin

