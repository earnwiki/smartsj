import debounce from "lodash/debounce";

export default function ($forms, url, inputsQueryToValidate) {
    let _sendUserData = null;
    const postSendUserData = debounce(function () {
        $.post(url, _sendUserData)
    }, 3000);

    setInterval(function () {
        $forms.each(async(index, form) => {
            form = $(form);
            const inputs = form.find(inputsQueryToValidate);
            if (!inputs.length) {
                return;
            }
            for (let i = 0; i < inputs.length; i++) {
                if (!inputs[i].checkValidity() || inputs[i].value === '') {
                    return;
                }
            }
            let data = form.serializeArray();
            data.push({name: "order_url", value: window.location.href});
            data = $.param(data)
            if (_sendUserData !== data) {
                _sendUserData = data;
                postSendUserData();
            }
        })
    }, 2000);
}
