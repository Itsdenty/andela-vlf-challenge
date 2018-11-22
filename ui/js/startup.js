/* eslint-disable no-undef, no-unused-vars */
let status = 0,
  currentModal = '';

const animateText = () => {
    if (status === '0') {
      document.getElementById('text-anim').innerText = 'We deliver packages promptly';
      status = 1;
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
  toggleModal = (e) => {
    const elem = e.target.getAttribute('data-modal');
    if (currentModal && currentModal !== elem) {
      document.getElementById(currentModal).classList.add('hidden');
      document.getElementById(elem).classList.remove('hidden');
    } else {
      document.getElementById(elem).classList.toggle('hidden');
    }
    currentModal = elem;
  },
  dismissModal = () => {
    if (currentModal) {
      document.getElementById(currentModal).classList.add('hidden');
      currentModal = null;
    }
  },
  startAnimation = () => {
    const startAnim = setInterval(animateText, 3000);
    const classname = document.getElementsByClassName('trigger');
    Array.from(classname).forEach((element) => {
      element.addEventListener('click', toggleModal);
    });
    const dismissname = document.getElementsByClassName('dismiss');
    Array.from(dismissname).forEach((element) => {
      element.addEventListener('click', dismissModal);
    });
  };
window.onload = () => {
  startAnimation();
  const classname = document.getElementsByClassName('trigger');
  Array.from(classname).forEach((element) => {
    element.addEventListener('click', toggleModal);
  });
  const dismissname = document.getElementsByClassName('dismiss');
  Array.from(dismissname).forEach((element) => {
    element.addEventListener('click', dismissModal);
  });
};
