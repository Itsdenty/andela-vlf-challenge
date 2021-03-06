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

      totalList = parcelOrders;

      // load map ui
      initialize();
      calculateDistance();

      // populate ui
      selectedPage = 1;
      var orderHeader = fillHeader(),
          paginate = pagination();
      var orderDetails = '',
          index = 0;
      orderList.innerHTML += orderHeader;
      return parcelList.map(function (order) {
        var index1 = order.tolocation.indexOf('lat'),
            orderTo = order.tolocation.substring(0, index1),
            index2 = order.fromlocation.indexOf('lat'),
            orderFrom = order.fromlocation.substring(0, index2);

        // load table rows
        if (index === 0) {
          orderDetails = fillFirstRow(order, index, orderFrom, orderTo);
        } else {
          orderDetails = fillOtherRow(order, index, orderFrom, orderTo);
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

      // update status table data
      document.getElementById('status' + selectedId).innerHTML = '' + status;
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

      // update location table data
      document.getElementById('location-id').innerHTML = '' + currentLocation;
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