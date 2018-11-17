const { postRequest } = require("../src/PostRequest");
const { validate } = require("../src/Auth");

module.exports = async function(context, req) {
  try {
    if (!(await validate(req))) {
      throw "Unauthorized";
    }

    context.res = await postRequest(req);
  } catch (error) {
    if (error === "Unauthorized") {
      context.res = {
        status: 401,
        body: { error: "Unauthorized" }
      };
    } else {
      context.res = {
        status: 500,
        body: error
      };
    }
  }
};
