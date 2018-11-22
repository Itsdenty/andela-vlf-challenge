'use strict';

/* eslint-disable no-undef, no-unused-vars */
var status = 0,
    currentModal = '';

var animateText = function animateText() {
  console.log('status fired', status);
  if (status === '0') {
    document.getElementById('text-anim').innerText = 'We deliver packages promptly';
    status = 1;
    console.log('new status', status);
  } else if (status === '1') {
    document.getElementById('text-anim').innerText = 'You can check parcel status at any time';
    status = 2;
  } else if (status === '2') {
    document.getElementById('text-anim').innerText = 'Our service is cheap and reliable';
    status = 3;
  } else {
    document.getElementById('text-anim').innerText = 'A package delivery solution you can trust';
    status = 0;
  }
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