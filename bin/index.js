var MailListener = require("mail-listener2");

var ImapSettings;

try {
    ImapSettings = require('./imapsettings');
}
catch (e) {

    console.warn("imapsetting not found!");
}

/**
 * Environment variables used to configure the bot:
 *
 *  EMAIL2POSTWP_HOST: imap mail host
 *  EMAIL2POSTWP_USERNAME: imap username.
 *  EMAIL2POSTWP_PASSWORD: imap password.
 */
 var imapsettings = {};
 imapsettings.host = process.env.EMAIL2POSTWP_HOST || ImapSettings.host;
 imapsettings.username = process.env.EMAIL2POSTWP_USERNAME || ImapSettings.username;
 imapsettings.password = process.env.EMAIL2POSTWP_PASSWORD || ImapSettings.password;


 var WPSettings = {};

 try {
     WPSettings = require('./wpsettings');
 }
 catch (e) {

     console.warn("wpsetting not found!");
 }

 /**
  * Environment variables used to configure the bot:
  *
  *  EMAIL2POSTWP_WPENDPOINT: wordpress rest api endpoint
  *  EMAIL2POSTWP_WPUSERNAME: wordpress basic auth username.
  *  EMAIL2POSTWP_WPPASSWORD: wordpress basic auth password.
  */
  var wpsettings = {};
  wpsettings.endpoint = process.env.EMAIL2POSTWP_WPENDPOINT || WPSettings.endpoint;
  wpsettings.username = process.env.EMAIL2POSTWP_WPUSERNAME || WPSettings.username;
  wpsettings.password = process.env.EMAIL2POSTWP_WPPASSWORD || WPSettings.password;
  wpsettings.post_status = process.env.EMAIL2POSTWP_WPPOST_STATUS || WPSettings.post_status;
  wpsettings.post_category_ids = process.env.EMAIL2POSTWP_WPPOST_CATEGORY_IDS || WPSettings.post_category_ids;
  wpsettings.allowed_emails = process.env.EMAIL2POSTWP_WPALLOWED_EMAILS || WPSettings.allowed_emails;

var Email2PostWP = require("../lib/email2postwp");
var email2postwp = new Email2PostWP(
  imapsettings,
  wpsettings
);

email2postwp.start(); // start listening
