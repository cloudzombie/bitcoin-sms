var data = {
    navLinks: {
        signedIn: [
            { title: 'Home', href: '/', cssClass: 'navbar__link--home' },
            { title: 'Pricing', href: '/pricing', cssClass: 'navbar__link--pricing' },
            { title: 'Docs', href: '/docs', cssClass: 'navbar__link--docs' },
            { title: 'Dashboard', href: '/dashboard', cssClass: 'navbar__link--dashboard' },
            { title: 'Logout', href: '/logout', cssClass: 'navbar__link--logout' }
        ],

        signedOut: [
            { title: 'Home', href: '/', cssClass: 'navbar__link--home' },
            { title: 'Pricing', href: '/pricing', cssClass: 'navbar__link--pricing' },
            { title: 'Docs', href: '/docs', cssClass: 'navbar__link--docs' },
            { title: 'Dashboard', href: '/dashboard', cssClass: 'navbar__link--dashboard' },
            { title: 'Login', href: '/login', cssClass: 'navbar__link--login' },
            { title: 'Register', href: '/register', cssClass: 'navbar__link--register' }
        ]
    }
};

module.exports = data;
