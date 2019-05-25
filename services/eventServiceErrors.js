function DuplicateEventID(id) {
  this.name = 'DuplicateEventID';
  this.message = `Event with id ${id} already exists`;
}
DuplicateEventID.prototype = Object.create(Error.prototype);
DuplicateEventID.prototype.constructor = DuplicateEventID;

function RecordNotFound(message) {
  this.name = 'RecordNotFound';
  this.message = message;
}
RecordNotFound.prototype = Object.create(Error.prototype);
RecordNotFound.prototype.constructor = RecordNotFound;

function IllegalRecordUpdate(message) {
  this.name = 'IllegalRecordUpdate';
  this.message = message;
}
IllegalRecordUpdate.prototype = Object.create(Error.prototype);
IllegalRecordUpdate.prototype.constructor = IllegalRecordUpdate;

module.exports = {
  DuplicateEventID,
  RecordNotFound,
  IllegalRecordUpdate
};
