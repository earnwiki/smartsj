import {getCookie, setCookie} from './functions/cookie';

export function isApplePaySupported()
{
    return window.ApplePaySession && window.ApplePaySession.canMakePayments();
}

export function checkApplePaySupported()
{
    if (getCookie('apple_pay_supported') === undefined) {
        setCookie('apple_pay_supported', isApplePaySupported() ? '1' : '0', 30);
    }
}
