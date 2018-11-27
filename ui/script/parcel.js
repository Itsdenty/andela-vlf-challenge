'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* eslint-disable no-undef, no-unused-vars */
var currentModal = '',
    loaderStatus = 0,
    autocomplete = {},
    toGeocode = '',
    fromGeocode = '',
    changeGeocode = '',
    autocomplete2 = {},
    autocomplete3 = {},
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
    toast = document.getElementById('toast'),
    loaderDiv = document.getElementById('loader'),
    parcelRoute = 'https://andela-vlf.herokuapp.com/api/v1/parcels',
    userParcels = 'https://andela-vlf.herokuapp.com/api/v1/users/',
    orderList = document.getElementById('orders'),
    directionsService = new google.maps.DirectionsService(),
    service = new google.maps.DistanceMatrixService(),
    dismissParcelBtn = document.getElementById('dismiss-cancel-order'),
    confirmParcelBtn = document.getElementById('confirm-cancel-order'),
    changeDestinationBtn = document.getElementById('submit-change-destination'),


// algorithm for loader animation
loader = function loader(id) {
  switch (loaderStatus) {
    case 0:
      document.getElementById(id).innerText = 'loading.';
      loaderStatus = 1;
      break;
    case 1:
      document.getElementById(id).innerText = 'loading..';
      loaderStatus = 2;
      break;
    case 2:
      document.getElementById(id).innerText = 'loading...';
      loaderStatus = 3;
      break;
    case 3:
      document.getElementById(id).innerText = 'loading....';
      loaderStatus = 0;
      break;
    default:
      document.getElementById(id).innerText = 'loading.....';
      loaderStatus = 0;
  }
},


//  function for displaying toaster
showToast = function showToast(toastClass, data, redirectUrl) {
  toast.classList.remove('hidden');
  toast.classList.add(toastClass);
  toast.innerHTML = '<p>' + data.substr(0, 50) + '</p>';
  var flashError = setTimeout(function () {
    toast.classList.add('hidden');
    toast.classList.remove(toastClass);
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, 5000);
},
    calculateDistance = function calculateDistance() {
  var index = currentParcel.tolocation.indexOf('lat');
  var toLocation = currentParcel.tolocation.substring(0, index);
  console.log(currentParcel.tolocation, 'destination');
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

      distDiv.innerHTML = '\n                              <table>\n                              <tr>\n                                <th>Data</th>\n                                <th>Value</th>\n                                <th>Data</th>\n                                <th>Value</th>\n                              </tr>\n                              <tr>\n                                <td><b>Order Location</b></td>\n                                <td>' + fromLocation + '</td>\n                                <td><b>Delivery Location</b></td>\n                                <td>' + toLocation + '</td>\n                              </tr>\n                              <tr>\n                              <td><b>Current Location</b></td>\n                              <td>' + (currentParcel.currentStatus || 'not available') + '</td>\n                              <td><b>Delivery Price</b></td>\n                              <td>' + (parseInt(dist, 10) * 10 + 200) + '</td>\n                              </tr>\n                              <tr>\n                              <td><b>Delivery Distance</b></td>\n                              <td>' + dist + ' naira</td>\n                              <td><b>Estimated Duration</b></td>\n                              <td>' + duration + '</td>\n                              </tr>\n                            </table>\n                              ';
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
  var orderFrom = currentParcel.fromlocation.split(',');
  orderFrom = orderFrom[1] + ', ' + orderFrom[2];
  var orderTo = currentParcel.tolocation.split(',');
  orderTo = orderTo[1] + ', ' + orderTo[2];
  var request = {
    origin: orderFrom,
    destination: orderTo,
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

// function for toggling login and signup modal
toggleModal = function toggleModal(e) {
  var elem = e.target.getAttribute('data-modal');
  if (currentModal && currentModal !== elem) {
    document.getElementById(currentModal).classList.add('hidden');
    document.getElementById(elem).classList.remove('hidden');
  } else {
    document.getElementById(elem).classList.toggle('hidden');
  }
  currentModal = elem;
},


// function for dismissing modal
dismissModal = function dismissModal() {
  if (currentModal) {
    document.getElementById(currentModal).classList.add('hidden');
    currentModal = null;
  }
},


// function for page animation and modal script
configureModals = function configureModals() {
  var classname = document.getElementsByClassName('trigger');
  Array.from(classname).forEach(function (element) {
    element.addEventListener('click', toggleModal);
  });
  var dismissname = document.getElementsByClassName('dismiss');
  Array.from(dismissname).forEach(function (element) {
    element.addEventListener('click', dismissModal);
  });

  var processSelection = function processSelection(selected) {
    if (selected.includes('cancel')) {
      currentModal = 'cancel-parcel';
      document.getElementById(currentModal).classList.remove('hidden');
      var cancelId = selected.split('').pop();
      console.log(cancelId);
      selectedId = cancelId;
    } else if (selected.includes('destination')) {
      currentModal = 'change-destination';
      document.getElementById(currentModal).classList.remove('hidden');
      var destinationId = selected.split('').pop();
      selectedId = destinationId;
    }
  };

  document.addEventListener('click', function (e) {
    console.log('cool', e.target, e.target.classList.contains('select-parcel'));
    if (e.target && e.target.classList.contains('select-parcel')) {
      var parcelIndex = e.target.getAttribute('data-index');
      currentParcel = parcelList[parcelIndex];
      console.log(currentIndex, parcelIndex);
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


// create account method for signup
createParcel = function createParcel(evt) {
  evt.preventDefault();
  var user = JSON.parse(localStorage.getItem('user')),
      token = 'Bearer ' + localStorage.getItem('token'),
      headers = new Headers({
    'content-type': 'application/json',
    authorization: token
  }),
      parcelDetails = {
    fromLocation: createParcelForm.fromLocation.value + ', ' + fromGeocode,
    toLocation: createParcelForm.toLocation.value + ', ' + toGeocode,
    weight: createParcelForm.weight.value,
    weightmetric: createParcelForm.weightmetric.value,
    placedBy: user.id
  },
      startLoader = setInterval(loader, 500, 'submit-parcel');
  fetch(parcelRoute, {
    method: 'POST',
    body: JSON.stringify({ parcel: parcelDetails }),
    headers: headers
  }).then(function (res) {
    return Promise.all([res.json(), res]);
  }).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        data = _ref2[0],
        res = _ref2[1];

    if (!res.ok) {
      clearInterval(startLoader);
      showToast('toast-red', data.error);
      parcelBtn.innerText = 'Create Parcel';
      return;
    }
    clearInterval(startLoader);
    showToast('toast-green', data.data.message);
    parcelBtn.innerText = 'Create Parcel';
    dismissModal();
    currentModal = '';
    // window.location.href = '/profile.html';
  }).catch(function (error) {
    return alert(error.message);
  });
},
    getUserOrders = function getUserOrders() {
  var token = 'Bearer ' + localStorage.getItem('token'),
      user = JSON.parse(localStorage.getItem('user')),
      userRoute = '' + userParcels + user.id + '/parcels';
  if (!token) {
    showToast('toast-red', 'Please login to access this page', 'index.html');
  }
  loaderDiv.classList.remove('hidden');
  fetch(userRoute, {
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    }
  }).then(function (res) {
    return res.json();
  }).then(function (data, res) {
    if (data.status === 401) {
      showToast('toast-red', 'Session expired redirecting to homepage', 'index.html');
    } else if (data.data.length < 1) {
      showToast('toast-red', 'No Order available at the moment');
    } else {
      var parcelOrders = data.data;

      var _parcelOrders = _slicedToArray(parcelOrders, 1);

      currentParcel = _parcelOrders[0];

      parcelList = parcelOrders;
      console.log(parcelList);
      initialize();
      calculateDistance();
      var orderHeader = '\n                                <tr>\n                                  <th>From</th>\n                                  <th>To</th>\n                                  <th>Weight</th>\n                                  <th>Status</th>\n                                  <th>Actions</th>\n                                </tr>';
      var orderDetails = '',
          index = 0;
      orderList.innerHTML += orderHeader;
      return parcelOrders.map(function (order) {
        var orderFrom = order.fromlocation.split(',');
        orderFrom = orderFrom[1] + ', ' + orderFrom[2];
        var orderTo = order.tolocation.split(',');
        orderTo = orderTo[1] + ', ' + orderTo[2];
        if (index === 0) {
          orderDetails += '\n              <tr class="highlight parcel-row" data-index="' + index + '">\n                <td class="select-parcel" data-index="' + index + '"> ' + orderFrom + '</td>\n                <td class="select-parcel" data-index="' + index + '"> ' + orderTo + '</td>\n                <td class="select-parcel" data-index="' + index + '"> ' + order.weight + ' ' + order.weightmetric + '</td>\n                <td class="select-parcel" data-index="' + index + '"> ' + order.status + '</td>\n                <td><select name="orderAction" class="my-actions">\n                  <option value="">Select Action</option>\n                  <option value="cancel' + order.id + '">Cancel</option>\n                  <option value="destination' + order.id + '">Change Destination</option>\n                </select></td>\n              </tr>';
        } else {
          orderDetails += '\n              <tr class="parcel-row" data-index="' + index + '">\n                <td class="select-parcel" data-index="' + index + '"> ' + orderTo + '</td>\n                <td class="select-parcel" data-index="' + index + '"> ' + orderFrom + '</td>\n                <td class="select-parcel" data-index="' + index + '"> ' + order.weight + ' ' + order.weightmetric + '</td>\n                <td class="select-parcel" data-index="' + index + '"> ' + order.status + '</td>\n                <td><select name="orderAction" class="my-actions">\n                  <option value="">Select Action</option>\n                  <option value="cancel' + order.id + '">Cancel</option>\n                  <option value="destination' + order.id + '">Change Destination</option>\n                </select></td>\n              </tr>';
        }
        orderList.innerHTML += orderDetails;
        orderDetails = '';
        index += 1;
        return '';
      });
    }
  });
},


// cancelPArce method for cancelling order
cancelParcel = function cancelParcel(evt) {
  evt.preventDefault();
  var token = 'Bearer ' + localStorage.getItem('token'),
      cancelRoute = parcelRoute + '/' + selectedId + '/cancel',
      headers = new Headers({
    'content-type': 'application/json',
    authorization: token
  }),
      startLoader = setInterval(loader, 500, 'confirm-cancel-order');
  fetch(cancelRoute, {
    method: 'PATCH',
    headers: headers
  }).then(function (res) {
    return res.json();
  }).then(function (data, res) {
    if (data.status === 401) {
      clearInterval(startLoader);
      showToast('toast-red', 'Session expired redirecting to homepage', 'index.html');
    } else if (data.status === 500) {
      clearInterval(startLoader);
      showToast('toast-red', data.error);
    } else {
      clearInterval(startLoader);
      showToast('toast-green', 'successfully cancelled');
      confirmParcelBtn.innerText = 'Cancel';
      dismissModal();
      currentModal = '';
    }
  }).catch(function (error) {
    return alert(error.message);
  });
},


// create account method for signup
changeDestination = function changeDestination(evt) {
  evt.preventDefault();
  var token = 'Bearer ' + localStorage.getItem('token'),
      cancelRoute = parcelRoute + '/' + selectedId + '/destination',
      destination = changeDestinationForm.changeDestination.value + ', ' + changeGeocode,
      headers = new Headers({
    'content-type': 'application/json',
    authorization: token
  }),
      startLoader = setInterval(loader, 500, 'submit-change-destination');
  fetch(cancelRoute, {
    method: 'PATCH',
    body: JSON.stringify({ toLocation: destination }),
    headers: headers
  }).then(function (res) {
    return res.json();
  }).then(function (data, res) {
    if (data.status === 401) {
      clearInterval(startLoader);
      showToast('toast-red', 'Session expired redirecting to homepage', 'index.html');
    } else if (data.status === 500) {
      clearInterval(startLoader);
      showToast('toast-red', data.error);
    } else {
      clearInterval(startLoader);
      showToast('toast-green', 'successfully cancelled');
      confirmParcelBtn.innerText = 'Submit';
      dismissModal();
      currentModal = '';
    }
  }).catch(function (error) {
    return alert(error.message);
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
  console.log(changeGeocode, 'new geocode');
},
    initAutocomplete = function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
  /** @type {!HTMLInputElement} */document.getElementById('fromLocation'), { types: ['geocode'] });

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', fillInFromLocation);

  autocomplete2 = new google.maps.places.Autocomplete(
  /** @type {!HTMLInputElement} */document.getElementById('toLocation'), { types: ['geocode'] });

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete2.addListener('place_changed', fillInToLocation);

  autocomplete3 = new google.maps.places.Autocomplete(
  /** @type {!HTMLInputElement} */document.getElementById('changeDestination'), { types: ['geocode'] });

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete3.addListener('place_changed', fillInDestination);
};
// onload methods for ui animation and signup and login modal events
window.onload = function () {
  configureModals();
  initAutocomplete();
  getUserOrders();
};

// add event listeners
createParcelForm.addEventListener('submit', createParcel);
changeDestinationForm.addEventListener('submit', changeDestination);
confirmParcelBtn.addEventListener('click', cancelParcel);
dismissParcelBtn.addEventListener('click', dismissModal);