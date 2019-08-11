const axios = require('axios');

exports.sendPushNotification = (
  payload,
  recipient,
// eslint-disable-next-line arrow-body-style
) => {
    // console.log(payload, recipient);

    return axios({
        method: 'post',
        url: 'https://fcm.googleapis.com/fcm/send',
        headers: {
            Authorization:
                // 'key=AAAAV_nLgy4:APA91bGVV8r_EHZhqWZ92j0ig_jm7TOLInLschmuqas8ZGO4oodHd3-19XwNNbhnx9g_P__Un3hR0HaaKg9qvIm1Qw2G75oM8c0ooxS8ok5cTD-f9Fqy7vr8hyW20dYeJsytpL0JtVVe',
                'key=AIzaSyBOSa12y6_96F3LMO1rtZNkR31XIEeb008',
            'Content-Type': 'application/json'
        },
        data: {
            ...payload,
            to: recipient
        }
    });
};

// export const test = 0;
