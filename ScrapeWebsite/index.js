const { postRequest } = require("../src/PostRequest");
const aes256 = require("aes256");

module.exports = async function(context, req) {
  try {
    const tempKey = req.headers["x-temp-key"];
    if (!tempKey) {
      throw "Unauthorized";
    }

    const decrypted = aes256.decrypt(
      "LHGebvoencfCTprzeNwyGiT2ejJr8dSEAPTCK2QRjhbOkHl1PhfDLXGvlwyItBWL",
      req.headers["x-temp-key"]
    );

    if (!parseInt(decrypted)) {
      throw "Unauthorized";
    }

    context.res = await postRequest(req);
  } catch (error) {
    context.res = {
      status: 500,
      body: error
    };
  }
};
