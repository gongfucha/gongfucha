'use strict';

(function(module) {
    const homeController = {}
    homeController.render = function() {
        $('.tab-content').show();
    }
    module.homeController = homeController;
})(window);

(function(module) {
    const aboutController = {}
    aboutController.render = function() {
        window.location.href = '#about';
        $('.tab-content').hide();
        $('#about').fadeIn();
    }
    module.aboutController = aboutController;
})(window);

(function(module) {
    const placesController = {}
    placesController.render = function() {
        window.location.href = '#places';
        $('.tab-content').hide();
        $('#places').fadeIn();
    }
    module.placesController = placesController;
})(window);

(function(module) {
    const submitController = {}
    submitController.render = function() {
        window.location.href = '#submit';
        $('.tab-content').hide();
        $('#submit').fadeIn();

        //below functions should read from the form
        //look in view.js for create form and ajax call to DB
        $('#new-tea-location').on('submit', 'input, textarea', view.create);
    }
    module.submitController = submitController;
})(window);

// Initialize all routes
page('/', homeController.render);
page('/about', aboutController.render);
page('/places', placesController.render);
page('/submit', submitController.render);

// Activate page.js
page();

//For arrow clicker
$("#arrow").click(function() {
    $('html, body').animate({
        scrollTop: $("#tea-lo").offset().top
    }, 1000);
});
