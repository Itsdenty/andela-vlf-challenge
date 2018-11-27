'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* eslint-disable no-undef, no-unused-vars */
var currentParcel = {},
    parcelList = [],
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
      var parcelOrders = data.data;

      var _parcelOrders = _slicedToArray(parcelOrders, 1);

      currentParcel = _parcelOrders[0];

      parcelList = parcelOrders;

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
};

// onload methods for ui animation and signup and login modal events
window.onload = function () {
  getAllOrders();
};