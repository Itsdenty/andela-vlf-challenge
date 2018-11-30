/* eslint-disable no-undef, no-unused-vars, no-plusplus */
let currentModal = '',
  currentParcel = {},
  pageSize = 0,
  selectedPage = 0,
  parcelCount = 0,
  parcelList = [],
  lowerBoundary = 0,
  upperBoundary = 0,
  totalList = [],
  loaderStatus = 0;

const errorMessage = document.getElementsByClassName('error'),
  toast = document.getElementById('toast'),
  loaderDiv = document.getElementById('loader'),
  logoutBtn = document.getElementById('logout'),
  orderList = document.getElementById('orders'),


  fillOtherRow = (order, index, orderFrom, orderTo) => `
    <tr class="parcel-row" data-index="${index}">
      <td class="select-parcel" data-index="${index}"> ${orderFrom}</td>
      <td class="select-parcel" data-index="${index}"> ${orderTo}</td>
      <td class="select-parcel" data-index="${index}"> ${order.weight} ${order.weightmetric}</td>
      <td class="select-parcel" data-index="${index}" id="status${order.id}"> ${order.status}</td>
      <td><select name="orderAction" class="my-actions">
        <option value="">Select Action</option>
        <option value="status${order.id}">Change Status</option>
        <option value="location${order.id}">Change Current Location</option>
      </select></td>
    </tr>`,

  fillFirstRow = (order, index, orderFrom, orderTo) => `
    <tr class="highlight parcel-row" data-index="${index}">
      <td class="select-parcel" data-index="${index}"> ${orderFrom}</td>
      <td class="select-parcel" data-index="${index}" id="destination${order.id}"> ${orderTo}</td>
      <td class="select-parcel" data-index="${index}"> ${order.weight} ${order.weightmetric}</td>
      <td class="select-parcel" data-index="${index}" id="status${order.id}"> ${order.status}</td>
      <td><select name="orderAction" class="my-actions">
        <option value="">Select Action</option>
        <option value="cancel${order.id}">Cancel</option>
        <option value="destination${order.id}">Change Destination</option>
      </select></td>
    </tr>`,

  fillHeader = () => `
                      <tr>
                        <th>From</th>
                        <th>To</th>
                        <th>Weight</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>`,

  // select page
  selectPage = (e) => {
    const page = e.target.innerText;
    selectedPage = parseInt(page, 10);
    lowerBoundary = (selectedPage * 5) - 4;
    upperBoundary = selectedPage * 5;
    console.log(page, lowerBoundary, upperBoundary);
    parcelList = [];
    // console.log(totalList.indexOf(lowerBoundary - 1), 'test', lowerBoundary, upperBoundary);
    for (let i = lowerBoundary; i <= upperBoundary; i++) {
      const parcel = totalList[i - 1];
      if (parcel && parcel.id) {
        parcelList.push(parcel);
      }
    }
    let orderDetails = '',
      index = 0;
    const orderHeader = fillHeader();
    orderList.innerHTML = '';
    orderList.innerHTML += orderHeader;
    parcelList.map((order) => {
      const index1 = order.tolocation.indexOf('lat'),
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
    [currentParcel] = parcelList;
    initialize();
    calculateDistance();
  },

  pagination = () => {
    parcelCount = totalList.length;
    pageSize = Math.ceil(parcelCount / 5);
    const spilled = parcelCount % 5,
      currentPage = selectedPage,
      pageCount = pageSize;
    const delta = 2,
      range = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(pageCount - 1,
      currentPage + delta); i++) {
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
    const page = document.getElementById('pagination');
    range.forEach((rng) => {
      page.innerHTML += `<li><a href="#" class="pagination">${rng}</a></li>`;
    });
    lowerBoundary = (currentPage * 5) - 4;
    upperBoundary = currentPage * 5;
    for (let i = lowerBoundary; i <= upperBoundary; i++) {
      const parcel = totalList[i - 1];
      if (parcel && parcel.id) {
        parcelList.push(parcel);
      }
    }
    const pageName = document.getElementsByClassName('pagination');
    Array.from(pageName).forEach((element) => {
      element.addEventListener('click', selectPage);
    });
  },
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

  // function to logout user
  logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showToast('toast-green', 'Logged out successfully', 'index.html');
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
    logoutBtn.addEventListener('click', logout);
  };

// onload methods for ui animation and signup and login modal events
// window.onload = () => {
//   configureModals();
// };
