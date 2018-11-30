'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* eslint-disable no-undef, no-unused-vars, no-plusplus */
var currentModal = '',
    currentParcel = {},
    pageSize = 0,
    selectedPage = 0,
    parcelCount = 0,
    parcelList = [],
    lowerBoundary = 0,
    upperBoundary = 0,
    totalList = [],
    loaderStatus = 0;

var errorMessage = document.getElementsByClassName('error'),
    toast = document.getElementById('toast'),
    loaderDiv = document.getElementById('loader'),
    logoutBtn = document.getElementById('logout'),
    orderList = document.getElementById('orders'),
    fillOtherRow = function fillOtherRow(order, index, orderFrom, orderTo) {
  return '\n    <tr class="parcel-row" data-index="' + index + '">\n      <td class="select-parcel" data-index="' + index + '"> ' + orderFrom + '</td>\n      <td class="select-parcel" data-index="' + index + '"> ' + orderTo + '</td>\n      <td class="select-parcel" data-index="' + index + '"> ' + order.weight + ' ' + order.weightmetric + '</td>\n      <td class="select-parcel" data-index="' + index + '" id="status' + order.id + '"> ' + order.status + '</td>\n      <td><select name="orderAction" class="my-actions">\n        <option value="">Select Action</option>\n        <option value="status' + order.id + '">Change Status</option>\n        <option value="location' + order.id + '">Change Current Location</option>\n      </select></td>\n    </tr>';
},
    fillFirstRow = function fillFirstRow(order, index, orderFrom, orderTo) {
  return '\n    <tr class="highlight parcel-row" data-index="' + index + '">\n      <td class="select-parcel" data-index="' + index + '"> ' + orderFrom + '</td>\n      <td class="select-parcel" data-index="' + index + '" id="destination' + order.id + '"> ' + orderTo + '</td>\n      <td class="select-parcel" data-index="' + index + '"> ' + order.weight + ' ' + order.weightmetric + '</td>\n      <td class="select-parcel" data-index="' + index + '" id="status' + order.id + '"> ' + order.status + '</td>\n      <td><select name="orderAction" class="my-actions">\n        <option value="">Select Action</option>\n        <option value="cancel' + order.id + '">Cancel</option>\n        <option value="destination' + order.id + '">Change Destination</option>\n      </select></td>\n    </tr>';
},
    fillHeader = function fillHeader() {
  return '\n                      <tr>\n                        <th>From</th>\n                        <th>To</th>\n                        <th>Weight</th>\n                        <th>Status</th>\n                        <th>Actions</th>\n                      </tr>';
},


// select page
selectPage = function selectPage(e) {
  var page = e.target.innerText;
  page = parseInt(page, 10);
  if (page) {
    selectedPage = page;
    lowerBoundary = selectedPage * 5 - 4;
    upperBoundary = selectedPage * 5;
    parcelList = [];
    // console.log(totalList.indexOf(lowerBoundary - 1), 'test', lowerBoundary, upperBoundary);
    for (var i = lowerBoundary; i <= upperBoundary; i++) {
      var parcel = totalList[i - 1];
      if (parcel && parcel.id) {
        parcelList.push(parcel);
      }
    }
    selectedPage = page;
    var orderDetails = '',
        index = 0;
    var orderHeader = fillHeader();
    orderList.innerHTML = '';
    orderList.innerHTML += orderHeader;
    parcelList.map(function (order) {
      var index1 = order.tolocation.indexOf('lat'),
          orderTo = order.tolocation.substring(0, index1),
          index2 = order.fromlocation.indexOf('lat'),
          orderFrom = order.fromlocation.substring(0, index2);

      if (index === 0) {
        orderDetails += fillFirstRow(order, index, orderFrom, orderTo);
      } else {
        orderDetails += fillOtherRow(order, index, orderFrom, orderTo);
      }

      orderList.innerHTML += orderDetails;
      orderDetails = '';
      index += 1;
      return '';
    });
    var _parcelList = parcelList;

    var _parcelList2 = _slicedToArray(_parcelList, 1);

    currentParcel = _parcelList2[0];
  } else {
    pagination();
  }
  initialize();
  calculateDistance();
},


// create pagination text
pagination = function pagination() {
  parcelCount = totalList.length;
  pageSize = Math.ceil(parcelCount / 5);
  var spilled = parcelCount % 5,
      currentPage = selectedPage,
      pageCount = pageSize;
  var delta = 2,
      range = [];
  for (var i = Math.max(2, currentPage - delta); i <= Math.min(pageCount - 1, currentPage + delta); i++) {
    range.push(i);
  }
  if (currentPage - delta > 2) {
    range.unshift('...');
  }
  if (currentPage + delta < pageCount - 1) {
    range.push('...');
  }
  range.unshift(1);
  range.push(pageCount);
  var page = document.getElementById('pagination');
  range.forEach(function (rng) {
    page.innerHTML += '<li><a href="#" class="pagination">' + rng + '</a></li>';
  });
  lowerBoundary = currentPage * 5 - 4;
  upperBoundary = currentPage * 5;
  for (var _i = lowerBoundary; _i <= upperBoundary; _i++) {
    var parcel = totalList[_i - 1];
    if (parcel && parcel.id) {
      parcelList.push(parcel);
    }
  }
  var pageName = document.getElementsByClassName('pagination');
  Array.from(pageName).forEach(function (element) {
    element.addEventListener('click', selectPage);
  });
  var _parcelList3 = parcelList;

  var _parcelList4 = _slicedToArray(_parcelList3, 1);

  currentParcel = _parcelList4[0];

  console.log(totalList, parcelList, 'list', currentPage, upperBoundary, lowerBoundary);
},

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


// function to logout user
logout = function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  showToast('toast-green', 'Logged out successfully', 'index.html');
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
  logoutBtn.addEventListener('click', logout);
};

// onload methods for ui animation and signup and login modal events
// window.onload = () => {
//   configureModals();
// };