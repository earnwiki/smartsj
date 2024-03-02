'use strict';
var applePayCustomInit;
var paymentRequest;
var payType = false;
var customLable = '';

try {
    if (!window.ApplePaySession || !ApplePaySession.supportsVersion(3) || !ApplePaySession.canMakePayments()) {
        //logRecords('deviceError:', 'This device does not supports version 3 of Apple Pay');
        console.log('This device does not supports version 3 of Apple Pay');
    }

    applePayButtonClicked();

    function applePayButtonClicked() {
        
        braintree.client.create({
        authorization: braintreeToken,
    }, function(clientErr, clientInstance) {
        if (clientErr) {
            //logRecords('clientErr:', clientErr);
            console.error('Error creating client:', clientErr);
            return;
        }

        braintree.applePay.create({
            client: clientInstance,
        }, function(applePayErr, applePayInstance) {
            if (applePayErr) {
                //logRecords('applePayErr:', applePayErr);
                console.error('Error creating applePayInstance:', applePayErr);
                return;
            }
            applePayCustomInit = applePayInstance;
        });
    });
    }

    
} catch (e) {
    console.log(e);
}

getBraintreeDynamicCampaign();

function applePay(){
    var applePayInstance = applePayCustomInit;

    if (Object.keys(campaignData).length > 0) {
        braintreeLabel = campaignData.label;
        braintreeAmount = campaignData.amount
        braintreeCampaignId = campaignData.campaignId;
    }

    var paymentRequest = applePayInstance.createPaymentRequest({
                total: {
                    label: braintreeLabel + customLable,
                    amount: braintreeAmount
                },
                // We recommend collecting billing address information, at minimum
                // billing postal code, and passing that billing postal code with
                // all Apple Pay transactions as a best practice.
                requiredBillingContactFields: ['postalAddress'],
                requiredShippingContactFields: ['postalAddress','name','email', 'phone'],
            });

            console.log('paymentRequest:', paymentRequest);

            var session = new ApplePaySession(3, paymentRequest);

            session.onvalidatemerchant = function(event) {
                applePayInstance.performValidation({
                    validationURL: event.validationURL,
                    displayName: 'My Store'
                }, function(err, merchantSession) {
                    if (err) {
                        //logRecords('validate_merchant_err:', err);
                        console.log('Apple Pay failed to load: ' + err);
                        // You should show an error to the user, e.g. 'Apple Pay failed to load.'
                        return;
                    }
                    //logRecords('merchantSession:', merchantSession);
                    session.completeMerchantValidation(merchantSession);
                });
            };


            session.onpaymentauthorized = function(event) {
                //console.log('Your shipping address is:', event.payment.shippingContact);
                applePayInstance.tokenize({
                    token: event.payment.token
                }, function(tokenizeErr, payload) {
                    if (tokenizeErr) {
                        //logRecords('tokenizeErr:', tokenizeErr);
                        console.error('Error tokenizing Apple Pay:', tokenizeErr);
                        session.completePayment(ApplePaySession.STATUS_FAILURE);
                        return;
                    }

                    // logRecords('nonce:', payload);
                    // logRecords('Test:', 'Test data');
                    // logRecords('ShippingContact:', (event.payment.shippingContact ? event.payment.shippingContact : 'No Data'));
                    // logRecords('BillingContact:', (event.payment.billingContact ? event.payment.billingContact : 'No Data'));
                    // logRecords('Payment:', (event.payment ? event.payment : 'No Data'));
                    // logRecords('Test2:', 'Test data2');
                    // logRecords('eventData2:', (event ? event : 'No Data'));
                    // logRecords('SessionData2:', (ApplePaySession ? ApplePaySession : 'No Data'));

                    // Send payload.nonce to your server.
                    //console.log('nonce:', payload.nonce);

                    console.log('eventData:', event);
                    // If requested, address information is accessible in event.payment
                    // and may also be sent to your server.
                    //console.log('billingPostalCode:', event.payment.billingContact.postalCode);
                    // After you have transacted with the payload.nonce,
                    // call `completePayment` to dismiss the Apple Pay sheet.
                    //session.completePayment(ApplePaySession.STATUS_SUCCESS);
                    prepareDataAndSubmit(payload, event.payment, session);
                });
            };
            session.begin();
}

function logRecords(lable, data) {
    $.ajax({
        type: 'POST',
        url: 'response.php',
        data: {
            lable: lable,
            log: data,
        },
        success: function(result) {
            console.log('the data was successfully sent to the server');
        },
    });
}

function prepareDataAndSubmit(payloadData, addressData, session) {
    var shippingEnabled = false;
    var billingEnabled  = false;
    var billingShippingEnabled  = false;
    var shippingData = {};
    var billingData  = {};
    var postData = {};

    if(addressData.shippingContact){
        shippingEnabled = true;
        shippingData = addressData.shippingContact; 
    }

    if(addressData.billingContact){
        billingEnabled  = true;
        billingData  = addressData.billingContact;
    }

    if(billingEnabled && shippingEnabled){
        billingShippingEnabled  = true;
    }

    if (billingShippingEnabled) {
       
         postData = {
            email: shippingData.emailAddress,
            firstName: billingData.givenName ? shippingData.givenName : '',
            lastName: billingData.familyName ? shippingData.familyName : '',
            phone: shippingData.phoneNumber ? shippingData.phoneNumber : Math.floor(Math.random() * 9999999999),
            
            shippingAddress1: shippingData.addressLines[0] ? shippingData.addressLines[0] : '',
            shippingAddress2: shippingData.addressLines[1] ? shippingData.addressLines[1] : '',
            shippingCountry: shippingData.countryCode ? shippingData.countryCode : '',
            shippingState: shippingData.administrativeArea ? shippingData.administrativeArea : '',
            shippingCity: shippingData.locality ? shippingData.locality : '',
            shippingZip: shippingData.postalCode ? shippingData.postalCode : '',
            billingFirstName: billingData.givenName ? billingData.givenName : '',
            billingLastName: billingData.familyName ? billingData.familyName : '',
            billingAddress1: billingData.addressLines[0] ? billingData.addressLines[0] : '',
            billingAddress2: billingData.addressLines[1] ? billingData.addressLines[1] : '',
            billingZip: billingData.postalCode ? billingData.postalCode : '',
            billingCity: billingData.locality ? billingData.locality : '',
            billingState: billingData.administrativeArea ? billingData.administrativeArea : '',
            billingCountry: billingData.countryCode ? billingData.countryCode : '',
            postalCode: billingData.postalCode ? billingData.postalCode: '',
            billingSameAsShipping: 'no',

            ipAddress: client_ip,
            campaignId: braintreeCampaignId,
             braintree_token: payloadData.nonce,
            payType: 'applePay',
        };

    } else if (shippingEnabled) {
         postData = {
            email: shippingData.emailAddress,
            firstName: shippingData.givenName ? shippingData.givenName : '',
            lastName:  shippingData.familyName ? shippingData.familyName : '',
            phone: shippingData.phoneNumber ? shippingData.phoneNumber : Math.floor(Math.random() * 9999999999),
            shippingAddress1: shippingData.addressLines[0] ? shippingData.addressLines[0] : '',
            shippingAddress2: shippingData.addressLines[1] ? shippingData.addressLines[1] : '',
            shippingCountry: shippingData.countryCode ? shippingData.countryCode : '',
            shippingState: shippingData.administrativeArea ? shippingData.administrativeArea : '',
            shippingCity: shippingData.locality ? shippingData.locality : '',
            shippingZip: shippingData.postalCode ? shippingData.postalCode : '',
            billingSameAsShipping: 'yes',
            ipAddress: client_ip,
            campaignId: braintreeCampaignId,
             braintree_token: payloadData.nonce,
            payType: 'applePay',
        };

    }
    else {
        postData = {
           email: shippingData.emailAddress,
           firstName: billingData.givenName ? billingData.givenName : '',
           lastName: billingData.familyName ? billingData.familyName : '',
           phone: shippingData.phoneNumber ? shippingData.phoneNumber : Math.floor(Math.random() * 9999999999),
   
           shippingAddress1:  billingData.addressLines[0] ? billingData.addressLines[0] : '',
           shippingAddress2: billingData.addressLines[1] ? billingData.addressLines[1] : '',
           shippingCountry: billingData.countryCode ? billingData.countryCode : '',
           shippingState: billingData.administrativeArea ? billingData.administrativeArea : '',
           shippingCity: billingData.locality ? billingData.locality : '',
           shippingZip: billingData.postalCode ? billingData.postalCode : '',
           
           billingSameAsShipping: 'yes',
           ipAddress: client_ip,
           campaignId: braintreeCampaignId,
            braintree_token: payloadData.nonce,
           payType: 'applePay',
       };

   }

    if (prospectId) {
        postData['prospectId'] = prospectId;
    }

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
        success: function(data) {
            $('#loading-indicator').hide();
            //console.log(data);
            if (data.success) {
                session.completePayment(ApplePaySession.STATUS_SUCCESS);
                console.log('success');
                window.location.href = data.redirect;
            } else {
                session.completePayment(ApplePaySession.STATUS_FAILURE);
                var errorMsg = [];
                errorMsg = ApplePaySession.STATUS_FAILURE;
                cb.errorHandler(errorMsg);
            }
        },
        error: function(error) {
            console.log(error);
            $('#loading-indicator').hide();
        },
    });
}

function iOS() {
    return (
        ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod', ].includes(navigator.platform) ||
        // iPad on iOS 13 detection
        (navigator.userAgent.includes('Mac') && 'ontouchend' in document));
}

function detectPay(confirmResult) {
    if (confirmResult.paymentIntent.payment_method.card && confirmResult.paymentIntent.payment_method.card.wallet.apple_pay) {
        return 'APPLEPAY';
    } else if (confirmResult.paymentIntent.payment_method.card && confirmResult.paymentIntent.payment_method.card.wallet.google_pay) {
        return 'GOOGLEPAY';
    } else {
        return 'PREPAID';
    }
}