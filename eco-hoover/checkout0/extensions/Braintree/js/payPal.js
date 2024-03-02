var flag = 0

try {

    function createButton() {
        document.querySelector(".payPal-Braintree").innerHTML = ''
        document.querySelector(".payPal-Braintree").innerHTML = `<div id="paypal-container"></div>`;
        $("#loading-indicator").hide();



    }
    function create_braintree_nonce(token) {

        createButton()
        if (token.length) {

            braintree.setup(token, "paypal", {
                container: 'paypal-container', // Paypal container id
                singleUse: false,
                locale: 'en_us',
                enableShippingAddress: true,

                onPaymentMethodReceived: function (braintree_obj) {
                    // Process the nonce with this callback functions
                    // console.log(braintree_obj)
                    process_braintree_nonce(braintree_obj);
                }
            });
        }


    }

    function process_braintree_nonce(braintree_obj) {
        if (flag == 0) {
            //console.log(braintree_obj, campaignData)
            const addressData = braintree_obj.details.shippingAddress
            const personalData = braintree_obj.details

            var postData = {};

            postData = {
                email: personalData.email,
                firstName: personalData.firstName,
                lastName: personalData.lastName,
                phone: personalData.phone ? personalData.phone : Math.floor(Math.random() * 9999999999),

                shippingAddress1: addressData.streetAddress ? addressData.streetAddress : '',

                shippingCountry: addressData.countryCodeAlpha2 ? addressData.countryCodeAlpha2 : '',
                shippingState: addressData.region ? addressData.region : '',
                shippingCity: addressData.locality ? addressData.locality : '',
                shippingZip: addressData.postalCode ? addressData.postalCode : '',
                billingSameAsShipping: 'yes',
                ipAddress: client_ip,
                campaignId: campaignData.campaignId,
                braintree_nonce: braintree_obj.nonce,
                payType: 'paypal',
            };

            //console.log(postData);

            /*Post data to CRM*/
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
                    console.log(data);
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

        flag++
    }

} catch (e) {
    console.log(e);
}