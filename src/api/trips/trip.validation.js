const Joi = require('joi');
const validationMiddleware = require('../../middlewares/scheme.validator');

const schema = Joi.object().keys({
    "TripId": Joi.string(),
    "ScheduleId": Joi.string(),
    "DriverId": Joi.string(),
    "MaxCapacity": Joi.number(),
    "Status": Joi.string()
})
.when(Joi.ref('$action'), {
    "is": validationMiddleware.POST,
    "then": Joi.object({
        "ScheduleId": Joi.string().required(),
        "DriverId": Joi.string().required(),
        "MaxCapacity": Joi.number().required()
    })
});

module.exports = {
    schema
}
