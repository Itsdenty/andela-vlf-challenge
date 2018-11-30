'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* eslint-disable no-undef, no-unused-vars */
var status = 0,
    currentModal = '',
    loaderStatus = 0;

var errorMessage = document.getElementsByClassName('error'),
    signupBtn = document.getElementById('submit-signup'),
    loginBtn = document.getElementById('submit-login'),
    checkUsOutBtn = document.getElementById('check-out'),
    loginForm = document.getElementById('loginForm'),
    signupForm = document.getElementById('signupForm'),
    navBar = document.getElementById('check-it'),
    toast = document.getElementById('toast'),
    loginRoute = 'https://andela-vlf.herokuapp.com/api/v1/auth/login',
    signupRoute = 'https://andela-vlf.herokuapp.com/api/v1/auth/signup',


// algorithm function for homepage animated text
animateText = function animateText() {
  switch (status) {
    case '0':
      document.getElementById('text-anim').innerText = 'We deliver packages promptly';
      status = 1;
      break;
    case '1':
      document.getElementById('text-anim').innerText = 'You can check parcel status at any time';
      status = 2;
      break;
    case '2':
      document.getElementById('text-anim').innerText = 'Our service is cheap and reliable';
      status = 3;
      break;
    case '3':
      document.getElementById('text-anim').innerText = 'A package delivery solution you can trust';
      status = 0;
      break;
    default:
      document.getElementById('text-anim').innerText = 'A package delivery solution you can trust';
      status = 0;
  }
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
startAnimation = function startAnimation() {
  var startAnim = setInterval(animateText, 3000);
  var classname = document.getElementsByClassName('trigger');
  Array.from(classname).forEach(function (element) {
    element.addEventListener('click', toggleModal);
  });
  var dismissname = document.getElementsByClassName('dismiss');
  Array.from(dismissname).forEach(function (element) {
    element.addEventListener('click', dismissModal);
  });
},


// check password function for validating password
checkPassword = function checkPassword() {
  if (signupForm.confirmPassword.value && signupForm.password.value !== signupForm.confirmPassword.value) {
    errorMessage[0].classList.add('display-error');
    errorMessage[0].innerHTML = 'password does not match';
    signupBtn.disabled = true;
  }

  if (signupForm.confirmPassword.value === signupForm.password.value) {
    errorMessage[0].innerHTML = '';
    errorMessage[0].remove('display-error');
    signupBtn.disabled = false;
  }
},
    checkIt = function checkIt() {
  var user = JSON.parse(localStorage.getItem('user')),
      token = 'Bearer ' + localStorage.getItem('token');
  if (!token || !user) {
    navBar.innerHTML = '\n                          <li class="to-left"><a>SENDIT</a></li> \n                          <li class="to-right trigger point-it" data-modal="login">Login</li>\n                          <li class="to-right trigger point-it" data-modal="signup">Signup</li>\n                          <li class="to-right">Home</li>\n                        ';
  } else {
    navBar.innerHTML = '\n                          <li class="to-left"><a>SENDIT</a></li> \n                          <li class="to-right point-it" id="logout">Logout</li>\n                          <li class="to-right">Home</li>\n                        ';
  }
},
    checkState = function checkState() {
  var user = JSON.parse(localStorage.getItem('user')),
      token = 'Bearer ' + localStorage.getItem('token');
  if (!token || !user) {
    showToast('toast-red', 'Please login/signup to access this page');
    return;
  }
  if (user.isadmin) {
    window.location.href = 'admin.html';
    return;
  }
  window.location.href = 'parcel.html';
},


// create account method for signup
createAccount = function createAccount(evt) {
  evt.preventDefault();
  var headers = new Headers({
    'content-type': 'application/json'
  }),
      userDetails = {
    firstName: signupForm.firstName.value,
    lastName: signupForm.lastName.value,
    otherNames: signupForm.otherNames.value,
    username: signupForm.username.value,
    isAdmin: signupForm.isAdmin.value,
    email: signupForm.email.value,
    password: signupForm.password.value
  },
      startLoader = setInterval(loader, 500, 'submit-signup');

  fetch(signupRoute, {
    method: 'POST',
    body: JSON.stringify({ user: userDetails }),
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
      signupBtn.innerText = 'Signup';
      return;
    }
    signupBtn.innerText = 'Signup';
    dismissModal();
    currentModal = '';
    showToast('toast-green', 'registration successful', 'parcel.html');
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }).catch(function (error) {
    return alert(error.message);
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
    loginBtn.innerText = 'Login';
    dismissModal();
    currentModal = '';
    showToast('toast-green', 'login successful', 'parcel.html');
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }).catch(function (error) {
    return alert(error.message);
  });
};

// onload methods for ui animation and signup and login modal events
window.onload = function () {
  checkIt();
  startAnimation();
};

// add event listeners
signupForm.confirmPassword.addEventListener('input', checkPassword);
signupForm.password.addEventListener('input', checkPassword);
signupForm.addEventListener('submit', createAccount);
loginForm.addEventListener('submit', loginUser);
checkUsOutBtn.addEventListener('click', checkState);