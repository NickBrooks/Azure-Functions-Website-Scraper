const { postRequest } = require("../src/PostRequest");

module.exports = async function(context, req) {
  try {
    context.res = await postRequest(req);
  } catch (error) {
    context.res = {
      status: 500,
      body: error
    };
  }
};
