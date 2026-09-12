const mongoose = require("mongoose");

/**
 * Validates whether the given id is a valid MongoDB ObjectId.
 * @param {string} id
 * @returns {boolean}
 */
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;
};

module.exports = {
  isValidObjectId,
};
