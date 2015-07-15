(function (window) {
    'use strict';

    var heroSVGContainer = document.querySelector('.hero__svg-container'),
        heroLogoCircle,
        heroLogoWifiSignal;


    function init () {

        //heroLogoCircle = createUsingSVG('/assets/svg/bitcoin-hero-image.svg#bkg-circle');
        //heroLogoWifiSignal = createUsingSVG('/assets/svg/bitcoin-hero-image.svg#signal');
        //
        //heroLogoCircle.classList.add('hero-svg__circle');
        //heroLogoWifiSignal.classList.add('hero-svg__signal');
        //
        //heroSVGContainer.appendChild(heroLogoCircle);
        //heroSVGContainer.appendChild(heroLogoWifiSignal);


    }


    window.addEventListener('load', function () {

        init();

    }, false)

}(window));
