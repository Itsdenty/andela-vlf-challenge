'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mailgunJs = require('mailgun-js');

var _mailgunJs2 = _interopRequireDefault(_mailgunJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Mailgun credentials
var mail = {},
    apiKey = process.env.MAILGUN_API_KEY,
    domain = 'coding-muse.me',
    from = 'vlf@coding-muse.me';

mail.notifyLocation = async function (userData, newLocation) {
  var mg = new _mailgunJs2.default({ apiKey: apiKey, domain: domain }),
      data = {
    from: from,
    to: userData.email,
    subject: 'Your parcel arrived somewhere',
    html: 'Hello <b>' + userData.username + '</b>,  \n              <br>This is to notify you that your parcel just arrived at <b>' + newLocation + '</b> \n              Be rest assured you will be notified as  soon as it gets delivered. \n              <br>Thanks for your patronage.'
  };

  // Invokes the method to send emails given the above data with the helper library
  try {
    var mailAttempt = await mg.messages().send(data);
    if (mailAttempt) {
      return 'mail successfully sent';
    }
  } catch (error) {
    return 'sending of mail failed';
  }
};

mail.notifyStatus = async function (userData, newStatus) {
  var mg = new _mailgunJs2.default({ apiKey: apiKey, domain: domain }),
      data = {
    from: from,
    to: userData.email,
    subject: 'Your parcel status has changed',
    html: 'Hello <b>' + userData.username + '</b>,  \n              <br>This is to notify you that your parcel status has changed to <b>' + newStatus + '</b>. \n              <br>Thanks for your patronage.'
  };

  // Invokes the method to send emails given the above data with the helper library
  try {
    var mailAttempt = await mg.messages().send(data);
    if (mailAttempt) {
      return 'mail successfully sent';
    }
  } catch (error) {
    return 'sending of mail failed';
  }
};

exports.default = mail;