'use strict';

(function(module) {
  const googleMap = {};
  googleMap.markers = [];
  googleMap.open = '';
  let map;

  googleMap.initMap = function () {
    //initialize map and center it
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 2,
      center: {lat: 24.447663, lng: -176.115160},
      scrollwheel: false
    });

    googleMap.locations = TeaLocation.all;
    //loop through googleMap.locations array and populate map with markers
    for (let i = 0; i < googleMap.locations.length; i++) {

      //send GET request to Places Details API for shop info
      $.get(`/maps?query=${googleMap.locations[i].shopname}`).done(function(response) {
        let marker;
        let infoWindow;
        //check if shop is open
        googleMap.isOpen(response);
        marker = googleMap.createMarker(response, map);
        infoWindow = googleMap.createInfoWindow(response, googleMap.locations[i]);
        //click handler to open info windows
        marker.addListener('click', function() {
          infoWindow.open(map, marker);
        });
        //add reference to marker to corresponding shop
        googleMap.locations[i].marker = marker;
        //markers array so we can clear existing markers from the map/repopulate them
        googleMap.markers.push(marker);
      });
    }
    //re-center map upon window resize
    google.maps.event.addDomListener(window, 'resize', function() {
      const center = map.getCenter();
      google.maps.event.trigger(map, 'resize');
      map.setCenter(center);
    });
    googleMap.map = map;
  }

  googleMap.createMarker = function(res, map) {
    return new google.maps.Marker({
      position: res.result.geometry.location,
      map: map,
    });
  }

  googleMap.createInfoWindow = function(res, shop) {
    return new google.maps.InfoWindow({
      content: `<p style="font-weight:bold;">${shop.shopname}</p>
                <p>${res.result.formatted_address}</p>
                ${googleMap.open}
                <p>${res.result.formatted_phone_number || ''}</p>
                <p><a href="${res.result.website}">${res.result.website || ''}</a></p>`,
      maxWidth: 120
    });
  }

  googleMap.removeMarker = function(marker) {
    marker.setMap(null);
  }

  googleMap.removeMarkers= function() {
    googleMap.markers.forEach(marker => {
      marker.setMap(null);
    });
  }

  googleMap.showMarkers = function() {
    googleMap.markers.forEach(marker => {
      marker.setMap(googleMap.map);
    });
  }

  googleMap.isOpen = function(shop) {
    if (shop.result.hasOwnProperty('opening_hours')) {
      //if hours are listed, set the info box as being OPEN NOW or CLOSED NOW
      if (shop.result.opening_hours.open_now) {
        googleMap.open = '<p style="color:#0f0;">Open now</p>';
      } else {
        googleMap.open = '<p style="color:#f00;">Closed now</p>';
      }
    } else {
      googleMap.open = '<p style="color:#f00;"></p>';
    }
  }

  googleMap.showResultMarkers = function() {
    googleMap.removeMarkers();
    $('.shopsection:visible').each((index, shop) => {
      let teaLocationId = parseInt($(shop).attr('data-tea-location-id'));
      let teaLocation = TeaLocation.all.find(tl => {
        return tl.tealocation_id === teaLocationId;
      });
      teaLocation.marker.setMap(googleMap.map);
    });
  }

  module.googleMap = googleMap;
})(window);
