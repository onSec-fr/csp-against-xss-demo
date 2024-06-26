// Setup the application
const PAGES = `${__dirname}/pages`;
const port = 3000;

// Load CSP middleware
const { expressCspHeader, NONCE } = require('express-csp-header');

// Load Express
const express = require("express");
const app = express();

// Enable EJS templates
app.set('view engine', 'ejs');

// Serve JS files from the 'js' folder
app.use("/js", express.static("js"));

// Setup a default route
app.get("/", (req, res) => {
    res.send("Welcome to this CSP demo. Try one of the demo endpoints.");
});

// Setup the data for the page
const data = [
    `John`, 
    `Annie<img src="none" onerror="console.warn('evil 1')">`, 
    `Philippe<script>console.warn('evil 2')</script>`
];


/****************
 * Demo: Basics *
 ****************/

// Define the CSP policy for this endpoint
const csp_basics = {
    directives: {
        'script-src': ["'self'"]
    }
}

// Serve the endpoint with CSP enabled
app.get("/basics", expressCspHeader(csp_basics), (req, res) => {
    // Render the EJS page with the data
    res.render(`${PAGES}/list-names`, { data: data });
});



/****************
 * Demo: Hashes *
 ****************/

// Define the CSP policy for this endpoint
const csp_hashes = {
    directives: {
        'script-src': ["'self'", "'sha256-hR9T49uyHNM6Gl14iFigC1D52XD5NRR9kaaBx4gYLrc='"]
    }
}

// Serve the endpoint with CSP enabled
app.get("/hashes", expressCspHeader(csp_hashes), (req, res) => {
    // Render the EJS page with the data
    res.render(`${PAGES}/list-names-with-count`, { data: data });
});




/****************
 * Demo: Nonces *
 ****************/

// Define the CSP policy for this endpoint
const csp_nonces = {
    directives: {
        'script-src': [NONCE] // NONCE refers to a freshly calculated nonce
    }
}

// Serve the endpoint with CSP enabled
app.get("/nonces", expressCspHeader(csp_nonces), (req, res) => {
    // Render the EJS page with the data
    // The middleware exposes the calculated nonce on req.nonce
    res.render(`${PAGES}/list-names-with-count-nonces`, { data: data, nonce: req.nonce });
});


/**************************
 * Demo: XSS
 *************************/

// Serve the xss endpoint without CSP
app.get("/xss", (req, res) => {
    res.sendFile(`${PAGES}/xss.html`);
});

// Serve the xss endpoint with fully patched CSP
const csp_full = {
    directives: {
        'script-src': [
            "'self'", 
            "https://cdn.jsdelivr.net", 
            "'sha256-sJLd4PYo4s+MAefGQBAz5MPUGAPfv94fjxJBqfrunUA='", 
            "https://platform.twitter.com"
        ]
    }
}

// Serve the endpoint with CSP enabled
app.get("/xss_patch", expressCspHeader(csp_full), (req, res) => {
    res.sendFile(`${PAGES}/xss.html`);
});

/**************************
 * Demo: Twitter - Step 0 *
 *************************/

// Serve the endpoint without CSP
app.get("/twitter-step0", (req, res) => {
    res.sendFile(`${PAGES}/example-twitter.html`);
});



/**************************
 * Demo: Twitter - Step 1 *
 **************************/

// Define the CSP policy for this endpoint
const csp_twitter_step1 = {
    directives: {
        'script-src': ["'self'"]
    }
}

// Serve the endpoint with CSP enabled
app.get("/twitter-step1", expressCspHeader(csp_twitter_step1), (req, res) => {
    res.sendFile(`${PAGES}/example-twitter.html`);
});




/**************************
 * Demo: Twitter - Step 2 *
 **************************/

// Define the CSP policy for this endpoint
const csp_twitter_step2 = {
    directives: {
        'script-src': ["'self'", "https://cdn.jsdelivr.net"]
    }
}

// Serve the endpoint with CSP enabled
app.get("/twitter-step2", expressCspHeader(csp_twitter_step2), (req, res) => {
    res.sendFile(`${PAGES}/example-twitter.html`);
});




/**************************
 * Demo: Twitter - Step 3 *
 **************************/

// Define the CSP policy for this endpoint
const csp_twitter_step3 = {
    directives: {
        'script-src': [
            "'self'", 
            "https://cdn.jsdelivr.net", 
            "'sha256-sJLd4PYo4s+MAefGQBAz5MPUGAPfv94fjxJBqfrunUA='"
        ]
    }
}

// Serve the endpoint with CSP enabled
app.get("/twitter-step3", expressCspHeader(csp_twitter_step3), (req, res) => {
    res.sendFile(`${PAGES}/example-twitter.html`);
});



/**************************
 * Demo: Twitter - Step 4 *
 **************************/

// Define the CSP policy for this endpoint
const csp_twitter_step4 = {
    directives: {
        'script-src': [
            "'self'", 
            "https://cdn.jsdelivr.net", 
            "'sha256-sJLd4PYo4s+MAefGQBAz5MPUGAPfv94fjxJBqfrunUA='", 
            "https://platform.twitter.com"
        ]
    }
}

// Serve the endpoint with CSP enabled
app.get("/twitter-step4", expressCspHeader(csp_twitter_step4), (req, res) => {
    res.sendFile(`${PAGES}/example-twitter.html`);
});



/**************************
 * Demo: Twitter - Step 5 *
 **************************/

// Define the CSP policy for this endpoint
const csp_twitter_step5 = {
    directives: {
        'script-src': [
            "'self'", 
            "https://cdn.jsdelivr.net", 
            "'sha256-sJLd4PYo4s+MAefGQBAz5MPUGAPfv94fjxJBqfrunUA='", 
            "https://platform.twitter.com",
            "https://cdn.syndication.twimg.com"
        ]
    }
}

// Serve the endpoint with CSP enabled
app.get("/twitter-step5", expressCspHeader(csp_twitter_step5), (req, res) => {
    res.sendFile(`${PAGES}/example-twitter.html`);
});



/************************
 * Demo: Strict-Dynamic *
 ************************/

// Define the CSP policy for this endpoint
const csp_strictdynamic = {
    directives: {
        'script-src': [NONCE, "'strict-dynamic'"]
    }
}

// Serve the endpoint with CSP enabled
app.get("/strict-dynamic", expressCspHeader(csp_strictdynamic), (req, res) => {
    // Render the EJS page with the nonce
    res.render(`${PAGES}/example-twitter`, { nonce: req.nonce });
});



/***********************
 * Demo: Universal CSP *
 ***********************/

// Define the CSP policy for this endpoint
const csp_universal = {
    directives: {
        'script-src': [
            NONCE, "'strict-dynamic'", 
            "'unsafe-inline'", "http:", "https:",
            "'unsafe-eval'"
        ],
        'object-src': ["'none'"],
        'base-uri': ["'self'"]
    }
}

// Serve the endpoint with CSP enabled
app.get("/universal-csp", expressCspHeader(csp_universal), (req, res) => {
    // Render the EJS page with the nonce
    res.render(`${PAGES}/example-twitter`, { nonce: req.nonce });
});


// Start the app
app.listen(port, () => {
  console.log(`CSP demo available at http://localhost:${port}`);
});
