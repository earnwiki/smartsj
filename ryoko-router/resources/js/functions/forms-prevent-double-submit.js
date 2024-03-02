import $ from "jquery";

const css = `
button.prevent-double-submit-loading {
    position: relative;
}
button.prevent-double-submit-loading:after {
    position: absolute;
    z-index: 10;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: block;
    content: " ";
    background: url(/theme/images/spinner-1s-200px.svg) no-repeat center;
    background-size: contain;
    background-color: rgba(255,255,255,.5);
    border-radius: inherit;
}
`;

export function formsPreventDoubleSubmit() {
    let stylesInjected = false;

    $('form.prevent-double-submit').on('submit', function (e) {
        injectStyles();
        const $form = $(this);
        if (!$form.data('submitted')) {
            setFormStateSubmitted($form, $(e.originalEvent && e.originalEvent.submitter || $form.find('button')));
            return;
        }
        e.preventDefault();
    });

    function setFormStateSubmitted($form, $submitter) {
        $form.data('submitted', Date.now());
        // can't add property disabled as it prevents form from sending submitted button value
        $submitter.addClass('disabled').addClass('prevent-double-submit-loading');
        setTimeout(() => unsetFormStateSubmitted($form, $submitter), 30000);// same timeout as in our backend
    }

    function injectStyles() {
        if (stylesInjected) {
            return;
        }
        stylesInjected = true;
        const head = document.head || document.getElementsByTagName('head')[0];
        const style = document.createElement('style');
        head.appendChild(style);
        style.appendChild(document.createTextNode(css));
    }
}

export function unsetFormStateSubmitted($form, $submitter) {
    $form.data('submitted', false);
    $submitter.removeClass('disabled').removeClass('prevent-double-submit-loading');
}
