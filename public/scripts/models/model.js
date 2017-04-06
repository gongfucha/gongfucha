// (function (module) {
//   const TeaLocation = {};

//   module.TeaLocation = TeaLocation;
// })(window);

/*------------------------------
Populating Database & Tea Location List
------------------------------*/
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
//NOTE 03-30-17: This code is being tested and may not be fully functional
//insert a new tea shop from the form
TeaLocation.insertLocation = function (data, callback) {
  // Two notes: for object literals choose either all on one line or one key:value pair
  // per line. The syntax you used makes sense for arrays but not so much for objects.
  // Since you have values in the passed in data that correspond directly to certain
  // fields it would have been better represented as an object.
  const newLocation = {
    shopname: data[0].value, shopUrl: data[1].value, description: data[2].value,
    street: data[3].value, city: data[4].value, state: data[5].value, zip: data[6].value,
    country: data[7].value, category: data[8].value
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

//delete a tea shop
TeaLocation.prototype.deleteLocation = function (callback) {
  // There are a few reasons that this won't work. Generally before something makes it into
  // production code (even if there's a note about it being incomplete) you want to verify
  // that the code works in and of itself even if you're not using it yet. So far as I can
  // tell the instances of TeaLocation don't have a property tea_locations_id and the
  // value of this is going to get thrown off by passing this into another function.
  $.ajax({
    url: `/tea/${this.tea_locations_id}`,
    method: 'DELETE'
  })
    .then(console.log)
    .then(callback);
};

//update a tea shop that exists
TeaLocation.prototype.updateLocation = function (callback) {
  $.ajax({
    // I realize that everyone was using the blog code for reference but I think you could have done
    // a little better than to leave in 'article_id'.
    url: `/tea_locations/${this.article_id}`,
    method: 'PUT',
    data: {
      shopname: this.shopname, shopUrl: this.shopUrl, description: this.description,
      street: this.street, city: this.city, state: this.state, zip: this.zip,
      country: this.country, category: this.category
    }
  })
    .then(console.log)
    .then(callback);
};
