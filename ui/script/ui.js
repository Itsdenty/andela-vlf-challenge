'use strict';

/* eslint-disable no-undef, no-unused-vars */
var currentModal = '',
    loaderStatus = 0;

var errorMessage = document.getElementsByClassName('error'),
    toast = document.getElementById('toast'),
    loaderDiv = document.getElementById('loader'),
    logoutBtn = document.getElementById('logout'),


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