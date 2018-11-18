import mailgun from 'mailgun-js';

// Mailgun credentials
const mail = {},
  apiKey = process.env.MAILGUN_API_KEY,
  domain = 'coding-muse.me',
  from = 'vlf@coding-muse.me';

mail.notifyLocation = async (userData, newLocation) => {
  const mg = new mailgun({ apiKey, domain }),
    data = {
      from,
      to: userData.email,
      subject: 'Your parcel arrived somewhere',
      html: `Hello <b>${userData.username}</b>,  
              <br>This is to notify you that your parcel just arrived at <b>${newLocation}</b> 
              Be rest assured you will be notified as  soon as it gets delivered. 
              <br>Thanks for your patronage.`
    };

  // Invokes the method to send emails given the above data with the helper library
  try {
    const mailAttempt = await mg.messages().send(data);
    if (mailAttempt) {
      return 'mail successfully sent';
    }
  } catch (error) {
    return 'sending of mail failed';
  }
};

mail.notifyStatus = async (userData, newStatus) => {
  const mg = new mailgun({ apiKey, domain }),
    data = {
      from,
      to: userData.email,
      subject: 'Your parcel status has changed',
      html: `Hello <b>${userData.username}</b>,  
              <br>This is to notify you that your parcel status has changed to <b>${newStatus}</b>. 
              <br>Thanks for your patronage.`
    };

  // Invokes the method to send emails given the above data with the helper library
  try {
    const mailAttempt = await mg.messages().send(data);
    if (mailAttempt) {
      return 'mail successfully sent';
    }
  } catch (error) {
    return 'sending of mail failed';
  }
};

export default mail;
