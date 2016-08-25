<!-- email2postwp -->

# email2postwp

This is a simple module that retrieves new emails from an IMAP server and creates posts in a WordPress site.

## Prerequisite

A working IMAP email address and a WordPress with WP Rest API enabled with basic authentication.

## Installation

As simple as installing any other global node package. Be sure to have npm and node installed and launch:

```bash
$ npm install -g email2postwp
```

## Configuration

The email2postwp is configurable through environment variables. There are several variables available:

| Environment variable | Description |
|----------------------|-------------|
|  EMAIL2POSTWP_HOST|imap mail host.
|  EMAIL2POSTWP_USERNAME|imap username.
|  EMAIL2POSTWP_PASSWORD|imap password.
|  EMAIL2POSTWP_WPENDPOINT|wordpress rest api endpoint.
|  EMAIL2POSTWP_WPUSERNAME|wordpress basic auth username.
|  EMAIL2POSTWP_WPPASSWORD|wordpress basic auth password.
|  EMAIL2POSTWP_WPPOST_STATUS|new post status (default is draft).
|  EMAIL2POSTWP_WPPOST_CATEGORY_IDS|new post category ids (default is none).
|  EMAIL2POSTWP_WPALLOWED_EMAILS|the list of sender emails that post will be created (default is _all_).



## Launching from source

If you downloaded the source code of the bot you can run it using NPM with:

```bash
$ npm start
```

Don't forget to configure the environment variables before doing so. Alternatively you can also create a file called `imapsettings.js` in the root folder and put your token there (you can use the `imappsettings.js.example` file as a reference) and a file called `wpsettings.js` in the root folder and put your token there (you can use the `wpsettings.js.example` file as a reference).
