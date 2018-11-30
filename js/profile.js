/* eslint-disable no-undef, no-unused-vars */
let currentParcel = {},
  parcelList = [],
  directionsDisplay,
  delivered = 0,
  transitting = 0,
  map;

const errorMessage = document.getElementsByClassName('error'),
  deliveryCount = document.getElementById('delivery-count'),
  transittingCount = document.getElementById('transitting-count'),
  loaderDiv = document.getElementById('loader'),
  parcelRoute = 'https://andela-vlf.herokuapp.com/api/v1/parcels',
  userParcels = 'https://andela-vlf.herokuapp.com/api/v1/users/',
  orderList = document.getElementById('orders'),

  // check user state and redirect to admin page if an admin
  checkState = () => {
    const user = JSON.parse(localStorage.getItem('user')),
      token = `Bearer ${localStorage.getItem('token')}`;
    if (!token || !user) {
      showToast('toast-red', 'Please login/signup to access this page');
    } else if (user.isadmin) {
      window.location.href = 'admin.html';
    }
  },

  // fetch all orders made by users
  getAllOrders = () => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    if (!token) {
      showToast('toast-red', 'Please login to access this page', 'index.html');
    }
    loaderDiv.classList.remove('hidden');
    fetch(parcelRoute, {
      headers: {
        'Content-Type': 'application/json',
        authorization: token
      },
    })
      .then(res => res.json())
      .then((data, res) => {
        loaderDiv.classList.add('hidden');
        if (data.status === 401) {
          showToast('toast-red', 'Session expired redirecting to homepage', 'index.html');
        } else if (data.data.length < 1) {
          showToast('toast-red', 'No Order available at the moment');
        } else {
          selectedPage = 1;
          const parcelOrders = data.data;
          [currentParcel] = parcelOrders;
          totalList = parcelOrders;
          const orderHeader = fillHeader(),
            paginate = pagination(),
            size = parcelList.length;
          let orderDetails = '',
            index = 0;
          orderList.innerHTML += orderHeader;
          parcelList.map((order) => {
            const index1 = order.tolocation.indexOf('lat');
            const orderTo = order.tolocation.substring(0, index1);
            const index2 = order.fromlocation.indexOf('lat');
            const orderFrom = order.fromlocation.substring(0, index2);

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

          parcelOrders.forEach((order) => {
            if (order.status === 'delivered') {
              delivered += 1;
            }
            if (order.status === 'transitting') {
              transitting += 1;
            }
          });
          deliveryCount.innerText = `${delivered}`;
          transittingCount.innerText = `${transitting}`;
        }
      });
  };

// onload methods for ui animation and signup and login modal events
window.onload = () => {
  checkState();
  configureModals();
  getAllOrders();
};

logoutBtn.addEventListener('click', logout);
