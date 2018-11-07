const { optionsRequest } = require("../src/OptionsRequest");
const { postRequest } = require("../src/PostRequest");

module.exports = async function(context, req) {
  try {
    if (req.method == "OPTIONS") {
      context.res = optionsRequest(req);
    } else {
      context.res = await postRequest(req);
    }
  } catch (error) {
    context.res = {
      status: 500,
      body: error
    };
  }
};
