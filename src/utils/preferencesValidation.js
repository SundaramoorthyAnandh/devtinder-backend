const validator = require('validator');
const ALLOWED_GENDER = ['male', 'female', 'all'];

const preferencesValidator = (data) => {
    Object.keys(data).forEach((field) => {
        switch (field) {
            case 'age': {
                validateAge(data[field]);
                return true;
            }
            case 'skills': {
                validateSkills(data[field]);
                return true;
            }
            case 'gender': {
                validateGender(data[field]);
                return true;
            }
            case '_id': {
                validateUserId(data[field]);
                return true;
            }
            default:
                throw new Error(`Unknown field: ${field}`);
        }
    });

    return true;
};

const validateAge = (age) => {
    if (age < 18) {
        throw new Error('Minimum required age is 18');
    }
};

const validateSkills = (skills) => {
    if (!Array.isArray(skills) || skills.length < 3 || skills > 10) {
        throw new Error(
            'Skills should be list of min 3 skills and max 10 skills'
        );
    }
};

const validateGender = (gender) => {
    if (!ALLOWED_GENDER.includes(gender)) {
        throw new Error('Invalid gender option');
    }
};

const validateUserId = (id) => {
    if (!validator.isMongoId(id)) {
        throw new Error('Not a valid User Id');
    }
};

module.exports = {
    preferencesValidator,
};
