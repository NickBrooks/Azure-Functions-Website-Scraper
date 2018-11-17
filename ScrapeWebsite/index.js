const { postRequest } = require("../src/PostRequest");
const { validate } = require("../src/Auth");

module.exports = async function(context, req) {
  try {
    const valid = validate(req);

    context.res = await postRequest(req);
  } catch (error) {
    context.res = {
      status: 500,
      body: error
    };
  }
};
