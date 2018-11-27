/* eslint-disable no-undef, no-unused-vars */
let currentModal = '',
  loaderStatus = 0,
  autocomplete = {},
  toGeocode = '',
  fromGeocode = '',
  changeGeocode = '',
  autocomplete2 = {},
  autocomplete3 = {},
  currentParcel = {},
  parcelList = [],
  currentIndex = 0,
  selectedId = 0,
  directionsDisplay,
  map;

const errorMessage = document.getElementsByClassName('error'),
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
  showToast = (toastClass, data, redirectUrl) => {
    toast.classList.remove('hidden');
    toast.classList.add(toastClass);
    toast.innerHTML = `<p>${data.substr(0, 50)}</p>`;
    const flashError = setTimeout(() => {
      toast.classList.add('hidden');
      toast.classList.remove(toastClass);
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    }, 5000);
  },

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
        if (data.status === 401) {
          showToast('toast-red', 'Session expired redirecting to homepage', 'index.html');
        } else if (data.data.length < 1) {
          showToast('toast-red', 'No Order available at the moment');
        } else {
          const parcelOrders = data.data;
          [currentParcel] = parcelOrders;
          parcelList = parcelOrders;
          initialize();
          calculateDistance();
          const orderHeader = `
                                <tr>
                                  <th>From</th>
                                  <th>To</th>
                                  <th>Weight</th>
                                  <th>Status</th>
                                  <th>Actions</th>
                                </tr>`;
          let orderDetails = '',
            index = 0;
          orderList.innerHTML += orderHeader;
          return parcelOrders.map((order) => {
            let orderFrom = order.fromlocation.split(',');
            orderFrom = `${orderFrom[1]}, ${orderFrom[2]}`;
            let orderTo = order.tolocation.split(',');
            orderTo = `${orderTo[1]}, ${orderTo[2]}`;
            if (index === 0) {
              orderDetails += `
              <tr class="highlight parcel-row" data-index="${index}">
                <td class="select-parcel" data-index="${index}"> ${orderFrom}</td>
                <td class="select-parcel" data-index="${index}"> ${orderTo}</td>
                <td class="select-parcel" data-index="${index}"> ${order.weight} ${order.weightmetric}</td>
                <td class="select-parcel" data-index="${index}"> ${order.status}</td>
                <td><select name="orderAction" class="my-actions">
                  <option value="">Select Action</option>
                  <option value="cancel${order.id}">Cancel</option>
                  <option value="destination${order.id}">Change Destination</option>
                </select></td>
              </tr>`;
            } else {
              orderDetails += `
              <tr class="parcel-row" data-index="${index}">
                <td class="select-parcel" data-index="${index}"> ${orderTo}</td>
                <td class="select-parcel" data-index="${index}"> ${orderFrom}</td>
                <td class="select-parcel" data-index="${index}"> ${order.weight} ${order.weightmetric}</td>
                <td class="select-parcel" data-index="${index}"> ${order.status}</td>
                <td><select name="orderAction" class="my-actions">
                  <option value="">Select Action</option>
                  <option value="cancel${order.id}">Cancel</option>
                  <option value="destination${order.id}">Change Destination</option>
                </select></td>
              </tr>`;
            }
            orderList.innerHTML += orderDetails;
            orderDetails = '';
            index += 1;
            return '';
          });
        }
      });
  },

// onload methods for ui animation and signup and login modal events
window.onload = () => {
  getAllOrders();
};
