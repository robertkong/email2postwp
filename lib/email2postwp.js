(function() {
    'use strict';

    var EMAIL_SUBJECT_RE_FWD_PATTERN = /([\[\(] *)?(RE|FWD?) *([-:;)\]][ :;\])-]*|$)|\]+ *$/igm;

    var MailListener = require("mail-listener2");

    var WP = require('wpapi');

    var erp = require('emailreplyparser').EmailReplyParser.read;

    var Email2PostWP = function Constructor(imapsettings, wpsettings) {
        var mailListener = new MailListener({
            username: imapsettings.username,
            password: imapsettings.password,
            host: imapsettings.host,
            port: 993, // imap port
            tls: true,
            tlsOptions: {
                rejectUnauthorized: false
            },
            mailbox: "INBOX", // mailbox to monitor
            // searchFilter: ["UNSEEN", "FLAGGED"], // the search filter being used after an IDLE notification has been retrieved
            markSeen: true, // all fetched email willbe marked as seen and not fetched next time
            fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
            mailParserOptions: {
                streamAttachments: true
            }, // options to be passed to mailParser lib.
            attachments: true, // download attachments as they are encountered to the project directory
            attachmentOptions: {
                directory: "attachments/"
            } // specify a download directory for attachments
        });

        // console.log(wpsettings.endpoint + "/" + wpsettings.username + "/" + wpsettings.password);

        // You must authenticate to be able to POST (create) a post
        var wp = new WP({
            endpoint: wpsettings.endpoint,
            // This assumes you are using basic auth, as described further below
            username: wpsettings.username,
            password: wpsettings.password
        });
        this.wp = wp;

        this.postStatus = wpsettings.post_status;
        this.postCategories = [];
        if (wpsettings.post_category_ids) {
            this.postCategories = wpsettings.post_category_ids.split(",");
        }

        this.allowedEmails = [];
        if (wpsettings.allowed_emails) {
            this.allowedEmails = wpsettings.allowed_emails.split(",");
            console.log(this.allowedEmails);
        }

        // stop listening
        //mailListener.stop();

        mailListener.on("server:connected", function() {
            console.log("imapConnected");
        });

        mailListener.on("server:disconnected", function() {
            console.log("imapDisconnected");
        });

        mailListener.on("error", function(err) {
            console.log(err);
        });

        mailListener.on("mail", this.__processEmail.bind(this));

        mailListener.on("attachment", function(attachment) {
            console.log(attachment.path);
        });

        this.mailListener = mailListener;
    };

    Email2PostWP.prototype.__processEmail = function(mail, seqno, attributes) {
        // do something with mail object including attachments
        console.log("emailParsed", mail);

        var me = this;
        var parsedEmail = me.__parseEmail(mail);
        var fromEmail = parsedEmail.fromEmail;
        var subject = parsedEmail.subject;
        var content = parsedEmail.content;

        setTimeout(function() {
            if (me.__isValidFromEmail(fromEmail)) {
                me.wp.posts().create({
                    // "title" and "content" are the only required properties
                    title: subject,
                    content: content,
                    categories: me.postCategories,
                    // Post will be created as a draft by default if a specific "status"
                    // is not specified
                    status: me.postStatus
                }).then(function(response) {
                    // "response" will hold all properties of your newly-created post,
                    // including the unique `id` the post was assigned on creation
                    console.log(response.id);
                });
            } else {
                console.warn("Rejected email from: " + fromEmail);
            }
        }, 50);
    };

    Email2PostWP.prototype.__parseEmail = function(mail) {

        var patt = /(\s)*(On\s(\n|.)*wrote:)(\s)*/m;
        var content;
        // Try to use html to keep formatting
        if (mail.html) {
            // Only working on email forwarded for yahoo.
            content = mail.html.replace(patt, '');

            // Trying to strip extra blank spaces before email body
            var forwardBeginIndex = mail.html.search(patt);
            if (forwardBeginIndex > 0) {
                content = "<html><body>" + content.substr(forwardBeginIndex);
            }
        }
        else {
            var parsed = erp(mail.text);
            console.log(parsed);

            // Stripping forwarding/replying header
            content = parsed.fragments[0].content.replace(patt, '');

            // Trying to put back line breaks
            content.replace(/(?:\r\n|\r|\n)/g, '<br />');
        }

        var subject = mail.subject.replace(EMAIL_SUBJECT_RE_FWD_PATTERN, '');

        var fromEmail = mail.from[0].address;

        var parsedEmail = {
            subject: subject,
            content: content,
            fromEmail: fromEmail
        };

        console.log("Email Parsed", parsedEmail);

        return parsedEmail;

    };

    Email2PostWP.prototype.__isValidFromEmail = function(email) {
        return this.allowedEmails.length === 0 || this.allowedEmails.indexOf(email) >= 0;
    };

    Email2PostWP.prototype.start = function() {
        this.mailListener.start();
    };

    // it's possible to access imap object from node-imap library for performing additional actions. E.x.
    // mailListener.imap.move(:msguids, :mailboxes, function(){});
    module.exports = Email2PostWP;
})();
