const tracktor = {
    iframe: null,
    uuid: null,
    init: function (src, uuid) {
        return new Promise(function (resolve, reject) {
            if (tracktor.iframe && tracktor.uuid) {
                resolve();
                return;
            }
            if (!validateUUID(uuid)) {
                reject("Invalid UUID");
                return;
            }

            createIframe(src).then(function (iframe) {
                tracktor.iframe = iframe;
                tracktor.uuid = uuid;
                resolve();
            }).catch(function (error) {
                console.error(error);
                console.error("Failed to load Tracktor iframe. Using Fallback");
                tracktor.initFallback(uuid).catch(function (error) {
                    console.error(error);
                    reject(error);
                });
            })
        });
    },
    initFallback: function (uuid) {
        return new Promise(function (resolve, reject) {
            createIframe(getFallbackDomain()).then(function (iframe) {
                tracktor.iframe = iframe;
                tracktor.uuid = uuid;
                resolve();
            }).catch(function (error) {
                console.error(error);
                reject('Failed to load Tracktor fallback');
            })
        })
    },
    addInputListeners: function () {
        const emailInput = document.querySelector('input[name="email"]');
        if (emailInput) {
            emailInput.addEventListener('change', function () {
                if (!validateEmail(emailInput.value)) {
                    return;
                }
                tracktor.recordEmail(emailInput.value).catch((error) => console.error(error));
            });
        }

        const phoneListenInput = document.querySelector('input[name="_phone_number"]');
        const phoneValueInput = document.querySelector('input[name="phone_number"]');

        if (phoneListenInput && phoneValueInput) {
            phoneListenInput.addEventListener('change', function () {
                if (!validatePhoneNumber(phoneValueInput.value)) {
                    return;
                }
                tracktor.recordPhone(phoneValueInput.value).catch((error) => console.error(error));
            });
        }
    },
    recordVisit: function (data, segments) {
        let requestData = {
            uuid: this.uuid,
            data: data,
            url: window.location.href,
        };
        if (segments) {
            requestData.segments = segments;
        }
        return postMessage(this.uuid, 'recordVisit', requestData, this.iframe);
    },
    recordEmail: function (email) {
        return postMessage(this.uuid, 'recordEmail', {uuid: this.uuid, email}, this.iframe);
    },
    recordPhone: function (phone) {
        return postMessage(this.uuid, 'recordPhone', {uuid: this.uuid, phone}, this.iframe);
    },
};

async function postMessage(uuid, name, data, iframe)
{
    if (!iframe) {
        throw "Cannot record data, need to call initTracktor(src) first";
    }
    const message = {
        type: name,
        detail: data,
    };
    iframe.contentWindow.postMessage(message, "*");
}

function validateUUID(uuid)
{
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return validateRegex(regex, uuid);
}

function validateEmail(email)
{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return validateRegex(regex, email);
}

function validatePhoneNumber(phoneNumber)
{
    const regex = /^\+?\d{8,}$/;
    return validateRegex(regex, phoneNumber);
}

function validateRegex(regex, value)
{
    return regex.test(value);
}

function createIframe(src)
{
    return new Promise(function (resolve, reject) {
        let iframe = document.createElement('iframe');
        iframe.width = "1";
        iframe.height = "1";
        iframe.style.border = "0";
        iframe.onload = () => resolve(iframe);
        iframe.onerror = reject;
        iframe.src = src;
        document.body.appendChild(iframe);
    })
}

function getMainDomain()
{
    const hostname = window.location.hostname;
    const parts = hostname.split('.');

    const knownTwoDotTlds = ['.co.uk', '.com.au', '.co.jp', '.co.in', '.com.br', '.com.mx'];

    let startIndex = 0;

    while (startIndex < parts.length) {
        const potentialTld = '.' + parts.slice(startIndex).join('.');
        if (knownTwoDotTlds.includes(potentialTld)) {
            return parts.slice(startIndex - 1).join('.');
        }
        startIndex++;
    }

    return parts.slice(parts.length - 2).join('.');
}

function getFallbackDomain()
{
    return window.location.protocol + "//tracktor." + getMainDomain();
}

window.tracktor = tracktor;
