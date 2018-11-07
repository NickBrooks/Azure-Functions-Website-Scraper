function optionsRequest(req) {
  const origin = req.headers["Origin"];

  return {
    headers: {
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": req.method + ", OPTIONS"
    }
  };
}

module.exports.optionsRequest = optionsRequest;
