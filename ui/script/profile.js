'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* eslint-disable no-undef, no-unused-vars */
var currentParcel = {},
    parcelList = [],
    directionsDisplay = void 0,
    delivered = 0,
    transitting = 0,
    map = void 0;

var errorMessage = document.getElementsByClassName('error'),
    deliveryCount = document.getElementById('delivery-count'),
    transittingCount = document.getElementById('transitting-count'),
    loaderDiv = document.getElementById('loader'),
    parcelRoute = 'https://andela-vlf.herokuapp.com/api/v1/parcels',
    userParcels = 'https://andela-vlf.herokuapp.com/api/v1/users/',
    orderList = document.getElementById('orders'),


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


// fetch all orders made by users
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
    loaderDiv.classList.add('hidden');
    if (data.status === 401) {
      showToast('toast-red', 'Session expired redirecting to homepage', 'index.html');
    } else if (data.data.length < 1) {
      showToast('toast-red', 'No Order available at the moment');
    } else {
      selectedPage = 1;
      var parcelOrders = data.data;

      var _parcelOrders = _slicedToArray(parcelOrders, 1);

      currentParcel = _parcelOrders[0];

      totalList = parcelOrders;
      var orderHeader = fillHeader(),
          paginate = pagination(),
          size = parcelList.length;
      var orderDetails = '',
          index = 0;
      orderList.innerHTML += orderHeader;
      parcelList.map(function (order) {
        var index1 = order.tolocation.indexOf('lat');
        var orderTo = order.tolocation.substring(0, index1);
        var index2 = order.fromlocation.indexOf('lat');
        var orderFrom = order.fromlocation.substring(0, index2);

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

      parcelOrders.forEach(function (order) {
        if (order.status === 'delivered') {
          delivered += 1;
        }
        if (order.status === 'transitting') {
          transitting += 1;
        }
      });
      deliveryCount.innerText = '' + delivered;
      transittingCount.innerText = '' + transitting;
    }
  });
};

// onload methods for ui animation and signup and login modal events
window.onload = function () {
  checkState();
  configureModals();
  getAllOrders();
};

logoutBtn.addEventListener('click', logout);