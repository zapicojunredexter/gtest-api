/*
const Joi = require('joi');

class User {
    constructor (params) {
        this.fields = [
            "Id",
            "FirstName",
            "LastName",
            "Birthdate",
            "Gender",
            "ContactNumber",
            "Email"
        ];

        this.fields.forEach((key) => {
            this[key] = params[key];
        });

        /*
        this.Id = params.Id;
        this.FirstName = params.FirstName;
        this.LastName = params.LastName;
        this.Birthdate = params.Birthdate;
        this.Gender = params.Gender;
        this.ContactNumber = params.ContactNumber;
        this.Email = params.Email;
        */
    }

    getErrors () {
        const scheme = Joi.object().keys({
            "Birthdate": Joi.date().max('01-01-2000'),
            "ContactNumber": Joi.string().required(),
            "Email": Joi.string().email(),
            "FirstName": Joi.string().required(),
            "Gender": Joi.string().required(),
            "Id": Joi.string(),
            "LastName": Joi.string().required()
        });

        const object = {};

        this.fields.forEach((field) => {
            object[field] = this[field];
        });
        const validationResult = Joi.validate(object,scheme);

        if (validationResult.error) {
            return validationResult.error.details.map((error) => error.message);
        }
        
        return null;
    }
}

module.exports = User;
*/