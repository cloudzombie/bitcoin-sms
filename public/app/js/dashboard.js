(function (window) {

    var billingWidget = document.querySelector('.db-widget--billing'),
        billingForm = billingWidget.querySelector('#payment-form'),
        alertMsgElem = billingWidget.querySelector('.db-widget__alert'),
        fundsDisplayElem = billingWidget.querySelector('#added-funds--output'),
        currentBalanceElem = billingWidget.querySelector('.current-balance'),
        addFundsInput = billingWidget.querySelector('#added-funds'),
        stripePkInput = billingWidget.querySelector('#add-funds--stripe-pk'), // undisplayed elem with publishable key sent by server
        stripeTokenInput = billingWidget.querySelector('#add-funds--stripe-token'), // undisplayed hidden elem with token sent by server
        addFundsButton = billingWidget.querySelector('#add-funds-button'),

        paymentHandler = StripeCheckout.configure({
            key: stripePkInput.value,
            token: function (token) {
                // apply token to the form and then post back to the client
                stripeTokenInput.value = token;
                billingForm.submit();
            }
        });



    function sendFundsRequest(e) {
        var amount = addFundsInput.value * 100;
        paymentHandler.open({
                name: 'Bitcoin SMS',
                amount: amount,
                description: 'One time deposit',
                currency: 'usd'
            }
        );
        e.preventDefault();  // We'll be manually submitting the form back to our server on the payment handler's `token` callback function
    }


    function updateFundsDisplay(ev) {
        fundsDisplayElem.value = ev.target.value;
    }


    function init () {
        addFundsInput.addEventListener('input', updateFundsDisplay, false);
        addFundsButton.addEventListener('click', sendFundsRequest, false);
    }

    window.addEventListener('load', function () {
        init();
    }, false);


}(window));





