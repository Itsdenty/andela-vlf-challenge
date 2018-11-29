'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* eslint-disable no-undef, no-unused-vars */
var currentModal = '',
    autocomplete = {},
    toGeocode = '',
    fromGeocode = '',
    changeGeocode = '',
    autocomplete2 = {},
    autocomplete3 = {},
    autocomplete4 = {},
    currentParcel = {},
    parcelList = [],
    currentIndex = 0,
    selectedId = 0,
    directionsDisplay = void 0,
    map = void 0;

var errorMessage = document.getElementsByClassName('error'),
    parcelBtn = document.getElementById('submit-parcel'),
    parcelForm = document.getElementById('signupForm'),
    changeDestinationForm = document.getElementById('destination-form'),
    distDiv = document.getElementById('dist'),
    parcelRoute = 'https://andela-vlf.herokuapp.com/api/v1/parcels',
    userParcels = 'https://andela-vlf.herokuapp.com/api/v1/users/',
    orderList = document.getElementById('orders'),
    directionsService = new google.maps.DirectionsService(),
    service = new google.maps.DistanceMatrixService(),
    dismissParcelBtn = document.getElementById('dismiss-cancel-order'),
    confirmParcelBtn = document.getElementById('confirm-cancel-order'),
    changeDestinationBtn = document.getElementById('submit-change-destination'),
    calculateDistance = function calculateDistance() {
  var index = currentParcel.tolocation.indexOf('lat');
  var toLocation = currentParcel.tolocation.substring(0, index);
  var index2 = currentParcel.fromlocation.indexOf('lat');
  var fromLocation = currentParcel.fromlocation.substring(0, index2);
  var orderFrom = currentParcel.fromlocation.split(',');
  orderFrom = orderFrom[1] + ', ' + orderFrom[2];
  var orderTo = currentParcel.tolocation.split(',');
  orderTo = orderTo[1] + ', ' + orderTo[2];
  var callback = function callback(response, status) {
    if (status === 'OK') {
      var _response$destination = _slicedToArray(response.destinationAddresses, 1),
          orig = _response$destination[0],
          _response$originAddre = _slicedToArray(response.originAddresses, 1),
          dest = _response$originAddre[0],
          dist = response.rows[0].elements[0].distance.text,
          duration = response.rows[0].elements[0].duration.text;

      distDiv.innerHTML = '\n                              <table>\n                              <tr>\n                                <th>Data</th>\n                                <th>Value</th>\n                                <th>Data</th>\n                                <th>Value</th>\n                              </tr>\n                              <tr>\n                                <td><b>Order Location</b></td>\n                                <td>' + fromLocation + '</td>\n                                <td><b>Delivery Location</b></td>\n                                <td id="destination-id">' + toLocation + '</td>\n                              </tr>\n                              <tr>\n                              <td><b>Current Location</b></td>\n                              <td id="location-id">' + (currentParcel.currentlocation || 'not available') + '</td>\n                              <td><b>Delivery Price</b></td>\n                              <td>' + (parseInt(dist, 10) * 10 + 200) + ' naira</td>\n                              </tr>\n                              <tr>\n                              <td><b>Delivery Distance</b></td>\n                              <td>' + dist + ' naira</td>\n                              <td><b>Estimated Duration</b></td>\n                              <td>' + duration + '</td>\n                              </tr>\n                            </table>\n                              ';
    } else {
      showToast('toast-red', 'Error: ' + status);
    }
  };

  service.getDistanceMatrix({
    origins: [orderFrom],
    destinations: [orderTo],
    travelMode: google.maps.TravelMode.DRIVING,
    avoidHighways: false,
    avoidTolls: false
  }, callback);
},
    calcRoute = function calcRoute() {
  var index = currentParcel.tolocation.indexOf('lat');
  var toLocation = currentParcel.tolocation.substring(0, index);
  var index2 = currentParcel.fromlocation.indexOf('lat');
  var fromLocation = currentParcel.fromlocation.substring(0, index2);
  // let orderFrom = currentParcel.fromlocation.split(',');
  // orderFrom = `${orderFrom[1]}, ${orderFrom[2]}`;
  // let orderTo = currentParcel.tolocation.split(',');
  // orderTo = `${orderTo[1]}, ${orderTo[2]}`;
  var request = {
    origin: fromLocation,
    destination: toLocation,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function (response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      directionsDisplay.setMap(map);
      // calculateDistance();
    } else {
      showToast('toast-red', 'Directions Request from ' + start.toUrlValue(6) + ' to  ' + end.toUrlValue(6) + ' failed: ' + status);
    }
  });
},
    initialize = function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var fromMarker = currentParcel.tolocation.split(','),
      fromLng = parseFloat(fromMarker[fromMarker.length - 1].substr(6)),
      fromLat = parseFloat(fromMarker[fromMarker.length - 2].substr(5)),
      center = new google.maps.LatLng(fromLat, fromLng),
      mapOptions = {
    zoom: 7,
    center: center
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  directionsDisplay.setMap(map);
  calcRoute();
  loaderDiv.classList.add('hidden');
},


// function for page animation and modal script
configureMaps = function configureMaps() {
  var processSelection = function processSelection(selected) {
    if (selected.includes('cancel')) {
      currentModal = 'cancel-parcel';
      document.getElementById(currentModal).classList.remove('hidden');
      var cancelId = selected.split('').pop();
      selectedId = cancelId;
    } else if (selected.includes('destination')) {
      currentModal = 'change-destination';
      document.getElementById(currentModal).classList.remove('hidden');
      var destinationId = selected.split('').pop();
      selectedId = destinationId;
    } else if (selected.includes('status')) {
      currentModal = 'change-status';
      document.getElementById(currentModal).classList.remove('hidden');
      var statusId = selected.split('').pop();
      selectedId = statusId;
    } else if (selected.includes('location')) {
      currentModal = 'change-location';
      document.getElementById(currentModal).classList.remove('hidden');
      var locationId = selected.split('').pop();
      selectedId = locationId;
    }
  };

  document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('select-parcel')) {
      var parcelIndex = e.target.getAttribute('data-index');
      currentParcel = parcelList[parcelIndex];
      document.getElementsByClassName('parcel-row')[currentIndex].classList.remove('highlight');
      document.getElementsByClassName('parcel-row')[parcelIndex].classList.add('highlight');
      currentIndex = parcelIndex;
      initialize();
      calculateDistance();
    }
    if (e.target && e.target.classList.contains('my-actions')) {
      var selected = e.target.value;
      processSelection(selected);
    }
  });
},
    fillInFromLocation = function fillInFromLocation() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();
  fromGeocode = 'lat:' + place.geometry.location.lat() + ', long:' + place.geometry.location.lng();
},
    fillInToLocation = function fillInToLocation() {
  // Get the place details from the autocomplete object.
  var place = autocomplete2.getPlace();
  toGeocode = 'lat:' + place.geometry.location.lat() + ', long:' + place.geometry.location.lng();
},
    fillInDestination = function fillInDestination() {
  // Get the place details from the autocomplete object.
  var place = autocomplete3.getPlace();
  changeGeocode = 'lat:' + place.geometry.location.lat() + ', long:' + place.geometry.location.lng();
},
    fillInCurrentLocation = function fillInCurrentLocation() {
  // Get the place details from the autocomplete object.
  var place = autocomplete3.getPlace();
  changeGeocode = 'lat:' + place.geometry.location.lat() + ', long:' + place.geometry.location.lng();
},
    initAutocomplete = function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  var orderLocation = document.getElementById('fromLocation');
  if (orderLocation) {
    autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */orderLocation, { types: ['geocode'] });

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', fillInFromLocation);
  }

  var destinationLocation = document.getElementById('toLocation');
  if (destinationLocation) {
    autocomplete2 = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */destinationLocation, { types: ['geocode'] });

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete2.addListener('place_changed', fillInToLocation);
  }

  var destination = document.getElementById('changeDestination');
  if (destination) {
    autocomplete3 = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */destination, { types: ['geocode'] });

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete3.addListener('place_changed', fillInDestination);
  }

  var currentLocation = document.getElementById('changeLocation');
  if (currentLocation) {
    autocomplete4 = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */currentLocation, { types: ['geocode'] });

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete4.addListener('place_changed', fillInCurrentLocation);
  }
};