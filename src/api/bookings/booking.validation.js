const Joi = require('joi');
const validationMiddleware = require('../../middlewares/scheme.validator');

const schema = Joi.object().keys({
    "BookingId": Joi.string(),
    "CommuterId": Joi.string(),
    "Status": Joi.string(),
    "SeatNumber": Joi.string(),
    "SeatsBought": Joi.number()
})
.when(Joi.ref('$action'), {
    "is": validationMiddleware.POST,
    "then": Joi.object({
        "CommuterId": Joi.string().required(),
        "SeatNumber": Joi.string().required(),
        "SeatsBought": Joi.number().required()
    })
});

module.exports = {
    schema
}
