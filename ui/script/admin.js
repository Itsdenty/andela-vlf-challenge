'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* eslint-disable no-undef, no-unused-vars */
var currentModal = '',
    currentParcel = {},
    parcelList = [];

var errorMessage = document.getElementsByClassName('error'),
    changeStatusBtn = document.getElementById('submit-status'),
    parcelForm = document.getElementById('signupForm'),
    changeStatusForm = document.getElementById('status-form'),
    changeLocationForm = document.getElementById('location-form'),
    distDiv = document.getElementById('dist'),
    toast = document.getElementById('toast'),
    loaderDiv = document.getElementById('loader'),
    parcelRoute = 'https://andela-vlf.herokuapp.com/api/v1/parcels',
    orderList = document.getElementById('orders'),
    directionsService = new google.maps.DirectionsService(),
    service = new google.maps.DistanceMatrixService(),
    changeLocationBtn = document.getElementById('submit-change-location'),


// check user state and redirect to admin page if an admin
checkState = function checkState() {
  var user = JSON.parse(localStorage.getItem('user')),
      token = 'Bearer ' + localStorage.getItem('token');
  if (!token || !user) {
    showToast('toast-red', 'Please login/signup to access this page');
  } else if (!user.isadmin) {
    window.location.href = 'parcel.html';
  }
},


// retrieve all user orders
getAllOrders = function getAllOrders() {
  var token = 'Bearer ' + localStorage.getItem('token');
  if (!token) {
    showToast('toast-red', 'Please login to access this page', 'index.html');
  }
  loaderDiv.classList.remove('hidden');
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

      parcelList = parcelOrders;
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
          orderDetails += '\n              <tr class="parcel-row" data-index="' + index + '">\n                <td class="select-parcel" data-index="' + index + '"> ' + orderTo + '</td>\n                <td class="select-parcel" data-index="' + index + '"> ' + orderFrom + '</td>\n                <td class="select-parcel" data-index="' + index + '"> ' + order.weight + ' ' + order.weightmetric + '</td>\n                <td class="select-parcel" data-index="' + index + '"> ' + order.status + '</td>\n                <td><select name="orderAction" class="my-actions">\n                  <option value="">Select Action</option>\n                  <option value="status' + order.id + '">Change Status</option>\n                  <option value="location' + order.id + '">Change Current Location</option>\n                </select></td>\n              </tr>';
        }
        orderList.innerHTML += orderDetails;
        orderDetails = '';
        index += 1;
        return '';
      });
    }
  });
},

// change parcel order status method
changeStatus = function changeStatus(evt) {
  evt.preventDefault();
  var token = 'Bearer ' + localStorage.getItem('token'),
      statusRoute = parcelRoute + '/' + selectedId + '/status',
      headers = new Headers({
    'content-type': 'application/json',
    authorization: token
  }),
      status = '' + changeStatusForm.status.value,
      startLoader = setInterval(loader, 500, 'submit-status');
  fetch(statusRoute, {
    method: 'PATCH',
    body: JSON.stringify({ status: status }),
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
      changeStatusBtn.innerText = 'Submit';
    } else {
      clearInterval(startLoader);
      showToast('toast-green', 'successfully cancelled');
      changeStatusBtn.innerText = 'Submit';
      dismissModal();
      currentModal = '';
    }
  }).catch(function (error) {
    return showToast('toast-red', error.message);
  });
},


// change parcel current location method
changeLocation = function changeLocation(evt) {
  evt.preventDefault();
  var token = 'Bearer ' + localStorage.getItem('token'),
      currentRoute = parcelRoute + '/' + selectedId + '/currentLocation',
      currentLocation = '' + changeLocationForm.changeLocation.value,
      headers = new Headers({
    'content-type': 'application/json',
    authorization: token
  }),
      startLoader = setInterval(loader, 500, 'submit-change-location');
  fetch(currentRoute, {
    method: 'PATCH',
    body: JSON.stringify({ currentLocation: currentLocation }),
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
      changeLocationBtn.innerText = 'Submit';
    } else {
      clearInterval(startLoader);
      showToast('toast-green', 'successfully changed location');
      changeLocationBtn.innerText = 'Submit';
      dismissModal();
      currentModal = '';
    }
  }).catch(function (error) {
    return showToast('toast-red', error.message);
  });
};

// onload methods for automatically firing relevant methods
window.onload = function () {
  configureModals();
  configureMaps();
  initAutocomplete();
  getAllOrders();
};

// add event listeners
changeStatusForm.addEventListener('submit', changeStatus);
changeLocationForm.addEventListener('submit', changeLocation);