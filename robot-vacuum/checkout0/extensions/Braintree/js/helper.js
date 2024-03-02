"use strict";
var braintreeQueryParam;
var braintreeQueryParameters;
var campaignData = {};
var serialize = function(obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
};
var getBraintreeDynamicCampaign = function() {
    var campaignsAll = {};
    var campaignPattern = /^campaigns\[[0-9]\]\[id]/i;
    var qtyPattern = /^campaigns\[[0-9]\]\[quantity]/i;
    var price = /^campaigns\[[0-9]\]\[price]/i;
    var inputsAll = document.getElementsByTagName('input');
    if (inputsAll.length > 0) {
        var i = 1;
        for (var j = 0; j < inputsAll.length; j++) {
            var snglInput = inputsAll[j];
            var nameAttr = snglInput.getAttribute('name');
            if (campaignPattern.test(nameAttr)) {
                if (!snglInput.hasAttribute('disabled')) {
                    campaignsAll['dynamic-campaign-id-' + i] = snglInput.value;
                    var quantityName = nameAttr.replace('id', 'quantity');
                    var quantityPrice = nameAttr.replace('id', 'price');
                    if (typeof document.getElementsByName(quantityName)[0] !== "undefined" && document.getElementsByName(quantityName)[0] !== null) {
                        campaignsAll['dynamic-campaign-quantity-' + i] = document.getElementsByName(quantityName)[0].value;
                        document.getElementsByName(quantityName)[0].setAttribute('onchange', "getBraintreeDynamicCampaign()");
                    } else {
                        campaignsAll['dynamic-campaign-quantity-' + i] = 0;
                    }
                    
                    if (typeof document.getElementsByName(quantityPrice)[0] !== "undefined" && document.getElementsByName(quantityPrice)[0] !== null) {
                        campaignsAll['dynamic-campaign-price-' + i] = document.getElementsByName(quantityPrice)[0].value;
                        document.getElementsByName(quantityPrice)[0].setAttribute('onchange', "getBraintreeDynamicCampaign()");
                    }
                    i += 1;
                }
                snglInput.setAttribute('onchange', "getBraintreeDynamicCampaign()");
            }
        }
        braintreeQueryParam = serialize(campaignsAll);
        braintreeQueryParameters = (typeof braintreeQueryParam !== "undefined" && braintreeQueryParam !== null) ? braintreeQueryParam : "";
        // stripeQueryParameters = parseQueryString(stripeQueryParameters);
        getCampaignDetail(braintreeQueryParameters);
    }
};

function parseQueryString(qs) {
    const items = qs.split('&');
    return items.reduce((data, item) => {
        const [key, value] = item.split('=');
        if (data[key] !== undefined) {
            if (!Array.isArray(data[key])) {
                data[key] = [data[key]]
            }
            data[key].push(value)
        } else {
            data[key] = value
        }
        return data
    }, {})
}

function getCampaignDetail(campaigns){

    fetch(app_config.offer_path + AJAX_PATH + 'extensions/braintree/get-campaign-details'+(campaigns ? '?'+campaigns : ''), {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            
      }).then(response => response.text())
        .then(function(data){
            var response = JSON.parse(data);
            campaignData = response;
            console.log(campaignData)
        });

}
