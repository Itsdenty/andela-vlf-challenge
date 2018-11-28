/* eslint-disable no-undef, no-unused-vars */
let currentModal = '',
  loaderStatus = 0,
  autocomplete = {},
  currentGeocode = '',
  currentParcel = {},
  parcelList = [],
  currentIndex = 0,
  selectedId = 0,
  directionsDisplay,
  map;

const errorMessage = document.getElementsByClassName('error'),
  changeStatusBtn = document.getElementById('submit-status'),
  parcelForm = document.getElementById('signupForm'),
  changeStatusForm = document.getElementById('status-form'),
  changeLocationForm = document.getElementById('location-form'),
  distDiv = document.getElementById('dist'),
  toast = document.getElementById('toast'),
  loaderDiv = document.getElementById('loader'),
  parcelRoute = 'https://andela-vlf.herokuapp.com/api/v1/parcels',
  orderList = document.getElementById('orders'),
  directionsService = new google.maps.DirectionsService(),
  service = new google.maps.DistanceMatrixService(),
  changeLocationBtn = document.getElementById('submit-change-location'),

  // algorithm for loader animation
  loader = (id) => {
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
  calculateDistance = () => {
    const index = currentParcel.tolocation.indexOf('lat');
    const toLocation = currentParcel.tolocation.substring(0, index);
    const index2 = currentParcel.fromlocation.indexOf('lat');
    const fromLocation = currentParcel.fromlocation.substring(0, index2);
    let orderFrom = currentParcel.fromlocation.split(',');
    orderFrom = `${orderFrom[1]}, ${orderFrom[2]}`;
    let orderTo = currentParcel.tolocation.split(',');
    orderTo = `${orderTo[1]}, ${orderTo[2]}`;
    const callback = (response, status) => {
      if (status === 'OK') {
        const [orig] = response.destinationAddresses,
          [dest] = response.originAddresses,
          dist = response.rows[0].elements[0].distance.text,
          duration = response.rows[0].elements[0].duration.text;
        distDiv.innerHTML = `
                              <table>
                              <tr>
                                <th>Data</th>
                                <th>Value</th>
                                <th>Data</th>
                                <th>Value</th>
                              </tr>
                              <tr>
                                <td><b>Order Location</b></td>
                                <td>${fromLocation}</td>
                                <td><b>Delivery Location</b></td>
                                <td>${toLocation}</td>
                              </tr>
                              <tr>
                              <td><b>Current Location</b></td>
                              <td>${currentParcel.currentlocation || 'not available'}</td>
                              <td><b>Delivery Price</b></td>
                              <td>${(parseInt(dist, 10) * 10) + 200} naira</td>
                              </tr>
                              <tr>
                              <td><b>Delivery Distance</b></td>
                              <td>${dist} naira</td>
                              <td><b>Estimated Duration</b></td>
                              <td>${duration}</td>
                              </tr>
                            </table>
                              `;
      } else {
        showToast('toast-red', `Error: ${status}`);
      }
    };
    service.getDistanceMatrix(
      {
        origins: [orderFrom],
        destinations: [orderTo],
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: false,
        avoidTolls: false
      },
      callback
    );
  },
  calcRoute = () => {
    let orderFrom = currentParcel.fromlocation.split(',');
    orderFrom = `${orderFrom[1]}, ${orderFrom[2]}`;
    let orderTo = currentParcel.tolocation.split(',');
    orderTo = `${orderTo[1]}, ${orderTo[2]}`;
    const request = {
      origin: orderFrom,
      destination: orderTo,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        directionsDisplay.setMap(map);
        // calculateDistance();
      } else {
        showToast('toast-red', `Directions Request from ${start.toUrlValue(6)} to  ${end.toUrlValue(6)} failed: ${status}`);
      }
    });
  },

  initialize = () => {
    directionsDisplay = new google.maps.DirectionsRenderer();
    const fromMarker = currentParcel.tolocation.split(','),
      fromLng = parseFloat(fromMarker[fromMarker.length - 1].substr(6)),
      fromLat = parseFloat(fromMarker[fromMarker.length - 2].substr(5)),
      center = new google.maps.LatLng(fromLat, fromLng),
      mapOptions = {
        zoom: 7,
        center
      };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    directionsDisplay.setMap(map);
    calcRoute();
    loaderDiv.classList.add('hidden');
  },
  // function for toggling login and signup modal
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

  // function for dismissing modal
  dismissModal = () => {
    if (currentModal) {
      document.getElementById(currentModal).classList.add('hidden');
      currentModal = null;
    }
  },

  // function for page animation and modal script
  configureModals = () => {
    const classname = document.getElementsByClassName('trigger');
    Array.from(classname).forEach((element) => {
      element.addEventListener('click', toggleModal);
    });
    const dismissname = document.getElementsByClassName('dismiss');
    Array.from(dismissname).forEach((element) => {
      element.addEventListener('click', dismissModal);
    });

    const processSelection = (selected) => {
      if (selected.includes('status')) {
        currentModal = 'change-status';
        document.getElementById(currentModal).classList.remove('hidden');
        const statusId = selected.split('').pop();
        selectedId = statusId;
      } else if (selected.includes('location')) {
        currentModal = 'change-location';
        document.getElementById(currentModal).classList.remove('hidden');
        const locationId = selected.split('').pop();
        selectedId = locationId;
      }
    };

    document.addEventListener('click', (e) => {
      if (e.target && e.target.classList.contains('select-parcel')) {
        const parcelIndex = e.target.getAttribute('data-index');
        currentParcel = parcelList[parcelIndex];
        document.getElementsByClassName('parcel-row')[currentIndex].classList.remove('highlight');
        document.getElementsByClassName('parcel-row')[parcelIndex].classList.add('highlight');
        currentIndex = parcelIndex;
        initialize();
        calculateDistance();
      }
      if (e.target && e.target.classList.contains('my-actions')) {
        const selected = e.target.value;
        processSelection(selected);
      }
    });
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
                  <option value="status${order.id}">Change Status</option>
                  <option value="location${order.id}">Change Current Location</option>
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

  // cancelPArce method for cancelling order
  changeStatus = (evt) => {
    evt.preventDefault();
    const token = `Bearer ${localStorage.getItem('token')}`,
      statusRoute = `${parcelRoute}/${selectedId}/status`,
      headers = new Headers({
        'content-type': 'application/json',
        authorization: token
      }),
      status = `${changeStatusForm.status.value}`,
      startLoader = setInterval(loader, 500, 'submit-status');
    fetch(statusRoute, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      headers,
    })
      .then(res => res.json())
      .then((data, res) => {
        if (data.status === 401) {
          clearInterval(startLoader);
          showToast('toast-red', 'Session expired redirecting to homepage', 'index.html');
        } else if (data.status === 500) {
          clearInterval(startLoader);
          showToast('toast-red', data.error);
          changeStatusBtn.innerText = 'Submit';
        } else {
          clearInterval(startLoader);
          showToast('toast-green', 'successfully cancelled');
          changeStatusBtn.innerText = 'Submit';
          dismissModal();
          currentModal = '';
        }
      })
      .catch(error => showToast('toast-red', error.message));
  },

  // create account method for signup
  changeLocation = (evt) => {
    evt.preventDefault();
    const token = `Bearer ${localStorage.getItem('token')}`,
      currentRoute = `${parcelRoute}/${selectedId}/currentLocation`,
      currentLocation = `${changeLocationForm.changeLocation.value}`,
      headers = new Headers({
        'content-type': 'application/json',
        authorization: token
      }),

      startLoader = setInterval(loader, 500, 'submit-change-location');
    fetch(currentRoute, {
      method: 'PATCH',
      body: JSON.stringify({ currentLocation }),
      headers,
    })
      .then(res => res.json())
      .then((data, res) => {
        if (data.status === 401) {
          clearInterval(startLoader);
          showToast('toast-red', 'Session expired redirecting to homepage', 'index.html');
        } else if (data.status === 500) {
          clearInterval(startLoader);
          showToast('toast-red', data.error);
          changeLocationBtn.innerText = 'Submit';
        } else {
          clearInterval(startLoader);
          showToast('toast-green', 'successfully changed location');
          changeLocationBtn.innerText = 'Submit';
          dismissModal();
          currentModal = '';
        }
      })
      .catch(error => showToast('toast-red', error.message));
  },

  fillInCurrentLocation = () => {
    // Get the place details from the autocomplete object.
    const place = autocomplete2.getPlace();
    currentGeocode = `lat:${place.geometry.location.lat()}, long:${place.geometry.location.lng()}`;
  },

  initAutocomplete = () => {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */(document.getElementById('changeLocation')),
      { types: ['geocode'] }
    );

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', fillInCurrentLocation);
  };

// onload methods for ui animation and signup and login modal events
window.onload = () => {
  configureModals();
  initAutocomplete();
  getAllOrders();
};

// add event listeners
changeStatusForm.addEventListener('submit', changeStatus);
changeLocationForm.addEventListener('submit', changeLocation);
