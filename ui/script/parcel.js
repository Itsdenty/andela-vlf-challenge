'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* eslint-disable no-undef, no-unused-vars, no-plusplus */
var currentModal = '';

var errorMessage = document.getElementsByClassName('error'),
    parcelBtn = document.getElementById('submit-parcel'),
    parcelForm = document.getElementById('signupForm'),
    changeDestinationForm = document.getElementById('destination-form'),
    parcelRoute = 'https://andela-vlf.herokuapp.com/api/v1/parcels',
    userParcels = 'https://andela-vlf.herokuapp.com/api/v1/users/',
    dismissParcelBtn = document.getElementById('dismiss-cancel-order'),
    confirmParcelBtn = document.getElementById('confirm-cancel-order'),
    changeDestinationBtn = document.getElementById('submit-change-destination'),


// check user state and redirect to admin page if an admin
checkState = function checkState() {
  var user = JSON.parse(localStorage.getItem('user')),
      token = 'Bearer ' + localStorage.getItem('token');
  if (!token || !user) {
    showToast('toast-red', 'Please login/signup to access this page');
  } else if (user.isadmin) {
    window.location.href = 'admin.html';
  }
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
    var order = parcelDetails,
        index = parcelList.length - 1;
    order.id = data.data.id;
    order.fromlocation = order.fromLocation;
    order.tolocation = order.toLocation;
    order.status = 'placed';
    var index1 = order.tolocation.indexOf('lat'),
        orderTo = order.tolocation.substring(0, index1),
        index2 = order.fromlocation.indexOf('lat'),
        orderFrom = order.fromlocation.substring(0, index2),
        orderDetails = fillOtherRow(order, index, orderFrom, orderTo);
    orderList.innerHTML += orderDetails;
    parcelList.push(orderDetails);
    currentModal = '';
    // window.location.href = '/profile.html';
  }).catch(function (error) {
    return showToast('toast-red', error.message);
  });
},


// fetch orders only made by logged in user
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
      loaderDiv.classList.add('hidden');
    } else {
      var parcelOrders = data.data;

      var _parcelOrders = _slicedToArray(parcelOrders, 1);

      currentParcel = _parcelOrders[0];

      totalList = parcelOrders;
      console.log(totalList, 'list');
      initialize();
      calculateDistance();
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
        console.log(paginate);

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


// cancelParcel method for cancelling order
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
      document.getElementById('status' + selectedId).innerHTML = 'cancelled';
      currentModal = '';
    }
  }).catch(function (error) {
    return showToast('toast-red', error.message);
  });
},


// change parcel destination method
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
      var newTo = destination.split(',');
      newTo = newTo[1] + ', ' + newTo[2];

      document.getElementById('destination' + selectedId).innerHTML = newTo;
      document.getElementById('destination-id').innerHTML = newTo;
      currentModal = '';
    }
  }).catch(function (error) {
    return showToast('toast-red', error.message);
  });
};

// onload methods for ui animation and signup and login modal events
window.onload = function () {
  checkState();
  configureModals();
  configureMaps();
  initAutocomplete();
  getUserOrders();
};

// add event listeners
createParcelForm.addEventListener('submit', createParcel);
changeDestinationForm.addEventListener('submit', changeDestination);
confirmParcelBtn.addEventListener('click', cancelParcel);
dismissParcelBtn.addEventListener('click', dismissModal);