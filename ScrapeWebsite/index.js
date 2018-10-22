const extractor = require('unfluff');
var axios = require('axios');

module.exports = async function (context, req) {
    if (req.body && req.body.url) {
        await axios.get(req.body.url).then(function (response) {
            console.log(response.data);
            data = extractor(response.data);
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }).catch(function (err) {
            context.res = {
                status: 400,
                body: err,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        });
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a URL into the body"
        };
    }
};