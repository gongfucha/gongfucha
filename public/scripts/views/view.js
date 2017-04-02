'use strict';

(function (module) {
  const view = {};

  module.view = view;
})(window);

// Nav script
var hamburgerMenu = function() {
  $('#hamburger').on('click', function() {
    var $nav = $('nav');
    $nav.toggle('slow');
    $('#hamburger').toggleClass('rotate');
  });
};

//Search animation
var searchAnimation = function() {
  $('#search-settings-nav').on('click', function() {
    $('#search-settings').slideToggle('fast');
  })
};

/*------------------------------
Filters (Tea Locations)
------------------------------*/
//This function grabs the data attributes from our tea list and populates the search filters.
view.populateFilters = function () {
  $('article').each(function () {
    if (!$(this).hasClass('template')) {
      var val = $(this).attr('data-category');
      var optionBox = `<div class="select-box" data-category="${val}">${val}</div>`;
      if (!document.querySelector(`div[data-category="${val}"]`)) {
        $('#category-filter').append(optionBox);
      }
      val = $(this).attr('data-city');
      var optionBox = `<div class="select-box" data-city="${val}">${val}</div>`;
      if (!document.querySelector(`div[data-city="${val}"]`)) {
        $('#city-filter').append(optionBox);
      }
    }
  })
};

//Event listener and handler for Category
view.tags = [];

view.toggleButton = function () {
  $('.filter').on('click', "div", function (e) {
    e.target.classList.toggle("tagged");
    var idx = view.tags.indexOf(e.target.textContent);
      if (idx === -1) {
        view.tags.push(e.target.textContent);
        view.handleCategoryFilter();
      } else {
        view.tags.splice(idx, 1);
        view.handleCategoryFilter();
      }
  });
};

view.handleCategoryFilter = function() {
  $('article').hide();
  if (!view.tags.length) {
    $('article').fadeIn();
    $('article.template').hide();
  } else if (view.tags) {
    view.tags.map(function(i) {
      $(`article[data-category="${(i)}"]`).fadeIn();
      $(`article[data-city="${(i)}"]`).fadeIn();
      googleMap.showResultMarkers();
    });
  } else {
    $('article').fadeIn();
    $('article.template').hide();
  }
};

/*------------------------------
Taking information from new form
------------------------------*/
// Pull from object and JSON.
$("#new-tea-location").submit(function(event) {
  event.preventDefault();
  let newLocation;
  newLocation = $(this).serializeArray() 
  $('#new-tea-location').empty();
  //append new TeaLocation to database
  
  TeaLocation.insertLocation(newLocation, view.initIndexPage);
});

hamburgerMenu();
searchAnimation();
view.initIndexPage = function () {
  TeaLocation.all.forEach(a => $('#tea-sidebar').append(a.toHtml()));
  //solves timing issue for Maps API
  var initUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCS7efQ1L1Es_cFLNYRgXoOZ65bxGf3j2A&callback=googleMap.initMap';
  var body = document.getElementsByTagName('body')[0];
  var js = document.createElement('script');
  js.type = 'text/javascript';
  js.src = initUrl;
  body.appendChild(js);
  //End code needed for Maps API

  view.populateFilters();
  view.toggleButton();
  $('.hide').hide();
  $('.readmore').click(function(e){
    e.preventDefault();
    $(this).parent().find('.hide').slideToggle('slow');
    $(this).text($(this).text() == 'Read less...' ? 'Read more...' : 'Read less...');
  })
};

TeaLocation.fetchAll(view.initIndexPage);
