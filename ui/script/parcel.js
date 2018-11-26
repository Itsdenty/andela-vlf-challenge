'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* eslint-disable no-undef, no-unused-vars */
var currentModal = '',
    loaderStatus = 0,
    autocomplete = {},
    toGeocode = '',
    fromGeocode = '',
    autocomplete2 = {},
    currentParcel = {};

var errorMessage = document.getElementsByClassName('error'),
    parcelBtn = document.getElementById('submit-parcel'),
    parcelForm = document.getElementById('signupForm'),
    toast = document.getElementById('toast'),
    parcelRoute = 'https://andela-vlf.herokuapp.com/api/v1/parcels',
    orderList = document.getElementById('orders'),


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
    showToast('toast-green', data.data.message);
    parcelBtn.innerText = 'Create Parcel';
    dismissModal();
    currentModal = '';
    // window.location.href = '/profile.html';
  }).catch(function (error) {
    return alert(error.message);
  });
},
    getAllOrders = function getAllOrders() {
  var token = 'Bearer ' + localStorage.getItem('token');
  if (!token) {
    showToast('toast-red', 'Please login to access this page', 'index.html');
  }
  var startLoader = setInterval(loader, 500, 'loader');
  fetch(parcelRoute, {
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
          orderDetails += '\n              <tr class="highlight">\n                <td> ' + orderTo + '</td>\n                <td> ' + orderFrom + '</td>\n                <td> ' + order.weight + ' ' + order.weightmetric + '</td>\n                <td> ' + order.status + '</td>\n                <td><select name="orderAction">\n                  <option value="">Select Action</option>\n                  <option value="cancel">Cancel</option>\n                  <option value="status">Change Status</option>\n                </select></td>\n              </tr>';
        } else {
          orderDetails += '\n              <tr>\n                <td> ' + orderTo + '</td>\n                <td> ' + orderFrom + '</td>\n                <td> ' + order.weight + ' ' + order.weightmetric + '</td>\n                <td> ' + order.status + '</td>\n                <td><select name="orderAction">\n                  <option value="">Select Action</option>\n                  <option value="cancel">Cancel</option>\n                  <option value="status">Change Status</option>\n                </select></td>\n              </tr>';
        }
        orderList.innerHTML += orderDetails;
        orderDetails = '';
        index += 1;
        return '';
      });
    }
  });
},

// create account method for signup
loginUser = function loginUser(evt) {
  evt.preventDefault();
  var headers = new Headers({
    'content-type': 'application/json'
  }),
      loginDetails = {
    email: loginForm.email.value,
    password: loginForm.password.value
  },
      startLoader = setInterval(loader, 500, 'submit-login');
  console.log(loginDetails);
  fetch(loginRoute, {
    method: 'POST',
    body: JSON.stringify({ login: loginDetails }),
    headers: headers
  }).then(function (res) {
    return Promise.all([res.json(), res]);
  }).then(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        data = _ref4[0],
        res = _ref4[1];

    if (!res.ok) {
      clearInterval(startLoader);
      showToast('toast-red', data.error);
      loginBtn.innerText = 'Login';
      return;
    }
    showToast('toast-green', 'login successful');
    loginBtn.innerText = 'Login';
    dismissModal();
    currentModal = '';
    // window.location.href = '/profile.html';
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
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
};
// onload methods for ui animation and signup and login modal events
window.onload = function () {
  configureModals();
  initAutocomplete();
  getAllOrders();
};

// add event listeners
createParcelForm.addEventListener('submit', createParcel);