function log(req, res, next) {
  console.log("Logging...");
  next();
  // next() to pass control to the next middleware function in the pipeline.If you don't do this, you are not termination req, res cycle, our req will end up hanging.
}
module.exports = log;