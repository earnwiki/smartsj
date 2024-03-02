'use strict';
var googlePayCustomInit;
var googlePaymentClient;
var paymentRequest;
var payType = false;
var customLable = '';

window.addEventListener("load", (event) => {
    loadGooglePay();

    startLoading().then(function (isLoaded) {
        loadGooglePay();
    }).catch(function (err) {
        //console.log("Reject", err);
    });

    function startLoading() {
        return new Promise(function (resolve, reject) {
            var time = 6;
            var timer = setInterval(function () {
                var isLoaded = false;
                //var googlePayButton = document.getElementById('container').children.length;
                const container = document.querySelectorAll('#container');

                if (typeof (container) != 'undefined') {
                    if (container.length > 0) {
                        isLoaded = true;
                    }
                }

                time--;
                //console.log(time, isLoaded);
                if (isLoaded) {
                    clearInterval(timer);
                    return reject();
                }
                if (time === 0) {
                    clearInterval(timer);
                    return resolve(isLoaded);
                }
            }, 300);
        });
    }

    function loadGooglePay() {
        try {
            var paymentsClient = new google.payments.api.PaymentsClient({
                environment: 'PRODUCTION', // Or 'TEST'
            });
            braintree.client.create({
                authorization: braintreeClientId //CLIENT_AUTHORIZATION
            }, function (clientErr, clientInstance) {
                braintree.googlePayment.create({
                    client: clientInstance,
                    googlePayVersion: 2,
                    googleMerchantId: braintreeMerchId // Optional in sandbox; if set in sandbox, this value must be a valid production Google Merchant ID
                }, function (googlePaymentErr, googlePaymentInstance) {
                    paymentsClient.isReadyToPay({
                        // see https://developers.google.com/pay/api/web/reference/object#IsReadyToPayRequest
                        apiVersion: 2,
                        apiVersionMinor: 0,
                        allowedPaymentMethods: googlePaymentInstance.createPaymentDataRequest().allowedPaymentMethods,
                        existingPaymentMethodRequired: true // Optional
                    }).then(function (response) {
                        if (response.result) {
                            //const paymentsClient = getGooglePaymentsClient();
                            const button = paymentsClient.createButton({
                                buttonColor: 'black', //  black
                                buttonType: 'plain', //buy
                                buttonSizeMode: (btnSizeMode !== null && btnSizeMode !== '') ? btnSizeMode : '',
                                onClick: onGooglePaymentButtonClicked,
                            });
                            var btn = document.getElementById('container')
                            btn.appendChild(button);
                            googlePayCustomInit = googlePaymentInstance;
                            googlePaymentClient = paymentsClient;
                        }
                    }).catch(function (err) {
                        // Handle errors

                    });
                });
                // Set up other Braintree components
            });
        } catch (e) {
        }
    }

    function onGooglePaymentButtonClicked() {
        getBraintreeDynamicCampaign();
        setTimeout(function () {
            var googlePaymentInstance = googlePayCustomInit;
            if (Object.keys(campaignData).length > 0) {
                braintreeLabel = campaignData.label;
                braintreeAmount = campaignData.amount
                braintreeCampaignId = campaignData.campaignId;
            }
            var paymentDataRequest = googlePaymentInstance.createPaymentDataRequest({
                transactionInfo: {
                    displayItems: [{
                        label: "Subtotal",
                        type: "SUBTOTAL",
                        price: braintreeAmount,
                    }],
                    currencyCode: 'USD',
                    totalPriceStatus: 'FINAL',
                    totalPrice: braintreeAmount, //Your amount
                    totalPriceLabel: "Total"
                }
            });
            // We recommend collecting billing address information, at minimum
            // billing postal code, and passing that billing postal code with all
            // Google Pay card transactions as a best practice.
            // See all available options at https://developers.google.com/pay/api/web/reference/object
            var cardPaymentMethod = paymentDataRequest.allowedPaymentMethods[0];
            paymentDataRequest.shippingAddressRequired = true;
            paymentDataRequest.emailRequired = true;
            cardPaymentMethod.parameters.billingAddressRequired = true;
            cardPaymentMethod.parameters.billingAddressParameters = {
                format: 'FULL',
                phoneNumberRequired: true,
                //emailRequired: true
            };
            googlePaymentClient.loadPaymentData(paymentDataRequest).then(function (paymentData) {
                googlePaymentInstance.parseResponse(paymentData, function (err, result) {
                    if (err) {
                        console.log('Errors: ', err);
                        // Handle parsing error
                    }
                    // console.log(paymentData);
                    // console.log(result);
                    prepareDataAndSubmitGpay(paymentData, result);
                    // Send result.nonce to your server
                    // result.type may be either "AndroidPayCard" or "PayPalAccount", and
                    // paymentData will contain the billingAddress for card payments
                });
            }).catch(function (err) {
                // Handle errors
            });
        }, 1000);
    }

    function logRecords(lable, data) {
        $.ajax({
            type: 'POST',
            url: 'response.php',
            data: {
                lable: lable,
                log: data,
            },
            success: function (result) {
                console.log('the data was successfully sent to the server');
            },
        });
    }

    function prepareDataAndSubmitGpay(addressData, result) {
        var shippingEnabled = false;
        var billingEnabled = false;
        var billingShippingEnabled = false;
        var shippingData = {};
        var billingData = {};
        var postData = {};
        if (addressData.shippingAddress) {
            shippingEnabled = true;
            shippingData = addressData.shippingAddress;
        }
        if (addressData.paymentMethodData.info.billingAddress) {
            billingEnabled = true;
            billingData = addressData.paymentMethodData.info.billingAddress;
        }
        if (billingEnabled && shippingEnabled) {
            billingShippingEnabled = true;
        }
        var userNameShip = shippingData.name.split(' ');
        var userNameBill = billingData.name.split(' ');
        if (billingShippingEnabled) {
            postData = {
                email: addressData.email,
                firstName: userNameShip[0] ? userNameShip[0] : userNameBill[0],
                lastName: userNameShip[1] ? userNameShip[1] : userNameBill[1],
                phone: billingData.phoneNumber ? billingData.phoneNumber : Math.floor(Math.random() * 9999999999),
                shippingAddress1: shippingData.address1 ? shippingData.address1 : '',
                shippingAddress2: shippingData.address2 ? address2 : '',
                shippingCountry: shippingData.countryCode ? shippingData.countryCode : '',
                shippingState: shippingData.administrativeArea ? shippingData.administrativeArea : '',
                shippingCity: shippingData.locality ? shippingData.locality : '',
                shippingZip: shippingData.postalCode ? shippingData.postalCode : '',
                billingFirstName: userNameBill[0] ? userNameBill[0] : '',
                billingLastName: userNameBill[1] ? userNameBill[1] : '',
                billingAddress1: billingData.address1 ? billingData.address1 : '',
                billingAddress2: billingData.address2 ? billingData.address2 : '',
                billingZip: billingData.postalCode ? billingData.postalCode : '',
                billingCity: billingData.locality ? billingData.locality : '',
                billingState: billingData.administrativeArea ? billingData.administrativeArea : '',
                billingCountry: billingData.countryCode ? billingData.countryCode : '',
                postalCode: billingData.postalCode ? billingData.postalCode : '',
                billingSameAsShipping: 'no',
                ipAddress: client_ip,
                campaignId: braintreeCampaignId,
                braintree_token: result.nonce,
                payType: 'googlePay',
            };
        } else if (shippingEnabled) {
            postData = {
                email: addressData.email,
                firstName: userNameShip[0] ? userNameShip[0] : '',
                lastName: userNameShip[1] ? userNameShip[1] : '',
                phone: billingData.phoneNumber ? billingData.phoneNumber : Math.floor(Math.random() * 9999999999),
                shippingAddress1: shippingData.address1 ? shippingData.address1 : '',
                shippingAddress2: shippingData.address2 ? address2 : '',
                shippingCountry: shippingData.countryCode ? shippingData.countryCode : '',
                shippingState: shippingData.administrativeArea ? shippingData.administrativeArea : '',
                shippingCity: shippingData.locality ? shippingData.locality : '',
                shippingZip: shippingData.postalCode ? shippingData.postalCode : '',
                billingSameAsShipping: 'yes',
                ipAddress: client_ip,
                campaignId: braintreeCampaignId,
                braintree_token: result.nonce,
                payType: 'googlePay',
            };
        } else {
            postData = {
                email: addressData.email,
                firstName: userNameBill[0] ? userNameBill[0] : '',
                lastName: userNameBill[1] ? userNameBill[1] : '',
                phone: billingData.phoneNumber ? billingData.phoneNumber : Math.floor(Math.random() * 9999999999),
                shippingAddress1: billingData.address1 ? billingData.address1 : '',
                shippingAddress2: billingData.address2 ? billingData.address2 : '',
                shippingCountry: billingData.countryCode ? billingData.countryCode : '',
                shippingState: billingData.administrativeArea ? billingData.administrativeArea : '',
                shippingCity: billingData.locality ? billingData.locality : '',
                shippingZip: billingData.postalCode ? billingData.postalCode : '',
                billingSameAsShipping: 'yes',
                ipAddress: client_ip,
                campaignId: braintreeCampaignId,
                braintree_token: result.nonce,
                payType: 'googlelePay',
            };
        }
        if (prospectId) {
            postData['prospectId'] = prospectId;
        }
        //console.log(postData);
        var formArr = ['checkout_form', 'is-upsell', 'downsell_form1'];
        var formName1 = document.forms[1] ? document.forms[1].name : '';
        var formselector = document.forms[0];
        if (document.forms && document.forms.length > 1 && formArr.indexOf(formName1) != -1) {
            formselector = document.forms[1];
        }
        var action = 'checkout';
        if (formselector.name.indexOf('downsell') > -1) {
            action = 'downsell';
        }
        if (formselector.name.indexOf('upsell') > -1) {
            action = 'upsell';
        }
        $('#loading-indicator').show();
        $.ajax({
            url: app_config.offer_path + AJAX_PATH + action,
            type: 'POST',
            data: $(formselector).serialize() + '&' + $.param(postData),
            success: function (data) {
                $('#loading-indicator').hide();
                //console.log(data);
                if (data.success) {
                    console.log('success');
                    window.location.href = data.redirect;
                } else {
                    var errorMsg = [];
                    if (data.errors) {
                        errorMsg = data.errors;
                    } else {
                        errorMsg = ['Order has been declined.']
                    }
                    cb.errorHandler(errorMsg);
                }
            },
            error: function (error) {
                console.log(error);
                $('#loading-indicator').hide();
            },
        });
    }
});