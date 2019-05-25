/**
 *
 * @param {Request} req
 * @returns {ControllerInput}
 */
function makeControllerInput(req) {
  return {
    params: req.params,
    data: req.body,
    header: req.header,
    method: req.method
  };
}

function handleControllerOutput(res, output) {
  // TODO: Validation on output
  res.status(output.code || 200).json(output.data);
}

/**
 * Maps a controllerAction to an express router
 * 
 * @param {(ControllerInput) => Promise<ControllerOutput>} controllerAction
 * @param {Request} req
 * @param {Response} res
 */
const fromControllerAction = controllerAction => (req, res) => {
  const input = makeControllerInput(req);
  controllerAction(input)
    .then(handleControllerOutput.bind(null, res))
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: `Something went wrong: ${err.message}`
      });
    });
}

module.exports = {
  fromControllerAction
};
