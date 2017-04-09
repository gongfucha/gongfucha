(function (module) {
  /*--- Populating Database & Tea Location List ---*/
  function TeaLocation(data) {
    Object.keys(data).forEach(ele => (this[ele] = data[ele]));
  }

  //Declare array for sorted tea locations (default sorting)
  TeaLocation.all = [];

  // Function sorts and populates TeaLocation.all array
  TeaLocation.loadAll = rawData => {
    TeaLocation.all = rawData.map(ele => new TeaLocation(ele));
  };

  // Fetches initial database contents from postgres and populates index.html
  TeaLocation.fetchAll = callback => {
    $.get('/tea')
      .then(
      results => {
        TeaLocation.loadAll(results);
        callback();
      }
      ).catch(console.error);
  }

  TeaLocation.prototype.toHtml = function () {
    var source = $('#tealocation-template').html();
    var template = Handlebars.compile(source);
    return template(this);
  };

  /*------------------------------
  Manipulating Tea Location Database
  ------------------------------*/
  //insert a new tea shop from the form
  TeaLocation.insertLocation = function (data, callback) {
    const newLocation = {
      shopname: data[0].value,
      shopUrl: data[1].value,
      description: data[2].value,
      street: data[3].value,
      city: data[4].value,
      state: data[5].value,
      zip: data[6].value,
      country: data[7].value,
      category: data[8].value,
      'g-recaptcha-response': data[9].value
    }
    $.ajax({
      url: '/tea',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(newLocation)
    })
      .then(
      results => {
        TeaLocation.loadAll(results);
        callback();
      }
      ).catch(console.error);
  };

  module.TeaLocation = TeaLocation;
})(window);


