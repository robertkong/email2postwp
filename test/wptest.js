var WPSettings = {};

try {
    WPSettings = require('../wpsettings');
}
catch (e) {

    console.warn("wpsetting not found!");
}

/**
 * Environment variables used to configure the bot:
 *
 *  BOT_API_KEY : the authentication token to allow the bot to connect to your slack organization. You can get your
 *      token at the following url: https://<yourorganization>.slack.com/services/new/bot (Mandatory)
 *  BOT_DB_PATH: the path of the SQLite database used by the bot
 *  BOT_NAME: the username you want to give to the bot within your organisation.
 */
 var endpoint = process.env.EMAIL2POSTWP_WPENDPOINT || WPSettings.endpoint;
 var wpusername = process.env.EMAIL2POSTWP_WPUSERNAME || WPSettings.username;
 var wppassword = process.env.EMAIL2POSTWP_WPPASSWORD || WPSettings.password;


 var WP = require( 'wpapi' );

// You must authenticate to be able to POST (create) a post
var wp = new WP({
    endpoint: endpoint,
    // This assumes you are using basic auth, as described further below
    username: wpusername,
    password: wppassword
});

// console.log(wpusername + "/" + wppassword);

wp.posts().create({
    // "title" and "content" are the only required properties
    title: 'Your Post Title',
    content: 'Your post content',
    // Post will be created as a draft by default if a specific "status"
    // is not specified
    status: 'draft'
}).then(function( response ) {
    // "response" will hold all properties of your newly-created post,
    // including the unique `id` the post was assigned on creation
    console.log( response.id );
});
