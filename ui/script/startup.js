'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* eslint-disable no-undef, no-unused-vars */
var status = 0,
    currentModal = '',
    loaderStatus = 0;

var errorMessage = document.getElementsByClassName('error'),
    signupBtn = document.getElementById('submit-signup'),
    signupForm = document.getElementById('signupForm'),
    toast = document.getElementById('toast'),
    route = 'https://andela-vlf.herokuapp.com/api/v1/auth/signup',
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
    showToast = function showToast(toastClass, data) {
  toast.classList.remove('hidden');
  toast.classList.add(toastClass);
  toast.innerHTML = '<p>' + data.substr(0, 50) + '</p>';
  var flashError = setTimeout(function () {
    toast.classList.add('hidden');
  }, 5000);
},
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
    dismissModal = function dismissModal() {
  if (currentModal) {
    document.getElementById(currentModal).classList.add('hidden');
    currentModal = null;
  }
},
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
    createAccount = function createAccount(evt) {
  evt.preventDefault();
  var headers = new Headers({
    'content-type': 'application/json'
  });
  var userDetails = {
    firstName: signupForm.firstName.value,
    lastName: signupForm.lastName.value,
    otherNames: signupForm.otherNames.value,
    username: signupForm.username.value,
    isAdmin: signupForm.isAdmin.value,
    email: signupForm.email.value,
    password: signupForm.password.value
  };
  var startLoader = setInterval(loader, 500, 'submit-signup');
  fetch(route, {
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
    showToast('toast-green', 'registration successful');
    signupBtn.innerText = 'Signup';
    dismissModal();
    currentModal = '';
    // window.location.href = '/profile.html';
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }).catch(function (error) {
    return alert(error.message);
  });
};

window.onload = function () {
  startAnimation();
  var classname = document.getElementsByClassName('trigger');
  Array.from(classname).forEach(function (element) {
    element.addEventListener('click', toggleModal);
  });
  var dismissname = document.getElementsByClassName('dismiss');
  Array.from(dismissname).forEach(function (element) {
    element.addEventListener('click', dismissModal);
  });
};

signupForm.confirmPassword.addEventListener('input', checkPassword);
signupForm.password.addEventListener('input', checkPassword);
signupForm.addEventListener('submit', createAccount);