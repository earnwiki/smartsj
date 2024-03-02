import { Alpine } from '../../vendor/livewire/livewire/dist/livewire.esm';
import 'url-search-params-polyfill';
import 'intersection-observer';
import './polyfills/all';
import {default as Popper} from 'popper.js';
import $ from 'jquery';
import 'bootstrap';
import 'jquery-validation';
import {initPopup} from "./whoops";
import {default as animateScroll} from './functions/animate-scroll';
import {normalizeHeight, normalizeWidth} from './functions/normalize';
import {formsPreventDoubleSubmit, unsetFormStateSubmitted} from './functions/forms-prevent-double-submit';
import './functions/text-wrapper';
import {trackVisitedPages, redirectToMainPage} from './functions/track-visited-pages';
import {default as masonry} from './masonry';
import {default as sendUserData} from './functions/send-user-data';
import {default as countdown} from './functions/countdown';
import {default as inViewAnimation} from './functions/in-view-animation';
import {getCookie, setCookie} from './functions/cookie';
import intlTelInput from 'intl-tel-input';
import {rtlCheck} from './rtl-check';
import {deferIframe} from './deferIframe';
import {checkApplePaySupported} from "./checkapplepay";
import {default as upsellEstimatedTaxes} from "./functions/upsell-estimated-taxes";
import { TwillImage } from '../../vendor/area17/twill-image/resources/js/index';
import {default as Choices} from 'choices.js'
import {default as initGoogleAnalytics} from './functions/googleAnalytics'
import {default as parseProductValue} from './functions/product-value-parser'

document.addEventListener('DOMContentLoaded', function () {
    const twillImage = new TwillImage();
    document.addEventListener('page:updated', () => twillImage.reset());
})

if (typeof webView !== 'undefined' && webView.getSettings) {
    // Should enable browser storage for Chrome Mobile WebView?
    webView.getSettings().setDomStorageEnabled(true);
}

window.$ = window.jQuery = $;
window.Popper = Popper;
window.Choices = Choices;
window.initPopup = initPopup;
window.deferIframe = deferIframe;
window.sendUserData = sendUserData;
window.unsetFormStateSubmitted = unsetFormStateSubmitted;
window.initGoogleAnalytics = initGoogleAnalytics;
window.parseProductValue = parseProductValue;

let token = document.head.querySelector('meta[name="csrf-token"]');
let headers = {};
if (token) {
    headers['X-CSRF-TOKEN'] = token.content;
}
$.ajaxSetup({headers});

$(animateScroll);
$(normalizeHeight);
$(normalizeWidth);
window.normalizeHeight = normalizeHeight;
window.normalizeWidth = normalizeWidth;
window.redirectToMainPage = redirectToMainPage;
window.setCookie = setCookie;
window.getCookie = getCookie;
$(masonry);
$(trackVisitedPages);
$(countdown);
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});
$(formsPreventDoubleSubmit);
$(function () {
    window.itiInstances = [];
    function initTelInputs()
    {
        let country = null;
        if (Alpine.store('cartDeliveryDetails')) {
            country = Alpine.store('cartDeliveryDetails').country;
        }
        if (!country) {
            country = $('input[data-country]').data('country')
        }

        const config = {
            hiddenInput: 'phone_number',
            initialCountry: country === 'XX' ? 'US' : (country || 'auto'),
            autoPlaceholder: 'polite',
            separateDialCode: true,
            utilsScript: '/build/utils.js', // added to vite.config
        };

        $('[name="phone_number"][data-country]').each((index, originalInput) => {
            window.itiInstances.push(intlTelInput(originalInput, config));
            originalInput.name = '_phone_number';
            $(originalInput).on('change focusout', {
                instance: window.itiInstances[window.itiInstances.length - 1]
            }, function (event) {
                let number = `+${event.data.instance.getSelectedCountryData()?.dialCode}${event.target.value}`;

                // This "if" prevents getNumber() to return null because utils script is loaded only on window.load event and while it's not loaded it returns null
                if (window.intlTelInputUtils) {
                    number = event.data.instance.getNumber();
                }

                $('input[name="phone_number"]').val(number);
                window.itiInstances.forEach(instance => {
                    instance.setNumber(number);
                })
            });
        });
    }

    function resetTelInput()
    {
        const country = $('#phone_number').data('country');

        for (let inst of window.itiInstances) {
            inst.setCountry("");
            inst.setCountry(country);
        }
    }

    initTelInputs();
    window.resetTelInput = resetTelInput;
    window.initTelInputs = initTelInputs;
});

$(rtlCheck);
$(checkApplePaySupported);
$(inViewAnimation);
$(upsellEstimatedTaxes);
