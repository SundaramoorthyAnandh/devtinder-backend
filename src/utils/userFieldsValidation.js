const validator = require('validator');

const ALLOWED_PROFESSSION = [
    'Software Engineer',
    'Data Scientist',
    'Web Developer',
    'UI/UX Designer',
    'Product Manager',
    'Project Manager',
    'Graphic Designer',
    'Marketing Specialist',
    'Sales Manager',
    'Business Analyst',
    'Consultant',
    'DevOps Engineer',
    'Cloud Engineer',
    'Cybersecurity Specialist',
    'Database Administrator',
    'System Administrator',
    'Mobile App Developer',
    'Full Stack Developer',
    'Machine Learning Engineer',
    'IT Support Specialist',
    'Network Engineer',
    'Quality Assurance Engineer',
    'Technical Writer',
    'Solution Architect',
    'Blockchain Developer',
    'Others',
];

const ALLOWED_GENDER = ['male', 'female', 'others'];

const fieldsValidator = (data) => {
    Object.keys(data).forEach((field) => {
        switch (field) {
            case 'firstName': {
                validateFirstName(data[field]);
                return true;
            }
            case 'lastName': {
                validateLastName(data[field]);
                return true;
            }
            case 'userName': {
                validateUserName(data[field]);
                return true;
            }
            case 'email': {
                validateEmail(data[field]);
                return true;
            }
            case 'profession': {
                validateProfession(data[field]);
                return true;
            }
            case 'password': {
                validatePassword(data[field]);
                return true;
            }
            case 'age': {
                validateAge(data[field]);
                return true;
            }
            case 'about': {
                validateAbout(data[field]);
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
            case 'photoUrl': {
                validatePhotoUrl(data[field]);
                return true;
            }
            default:
                throw new Error(`Unknown field: ${field}`);
        }
    });
};

const validateFirstName = (firstName) => {
    if (!firstName) {
        throw new Error('First Name cannot be empty');
    }

    if (firstName.length < 3 || firstName.length > 40) {
        throw new Error('First Name must be within 3 to 40 characters');
    }

    if (!/^[A-Za-z. ]{3,40}$/g.test(firstName)) {
        throw new Error(
            'First Name should only contain Alphabets, . and Space'
        );
    }
};

const validateLastName = (lastName) => {
    if (!lastName) {
        throw new Error('Last Name cannot be empty');
    }

    if (lastName.length < 3 || lastName.length > 40) {
        throw new Error('Last Name must be within 3 to 40 characters');
    }

    if (!/^[A-Za-z. ]{3,40}$/.test(lastName)) {
        throw new Error('Last Name should only contain Alphabets, . and Space');
    }
};

const validateUserName = (userName) => {
    if (!userName) {
        throw new Error('User Name cannot be empty');
    }

    if (userName.length < 3 || userName.length > 40) {
        throw new Error('User Name must be within 3 to 40 characters');
    }

    const userNameRegex = /^[A-Za-z0-9_\-@. ]{3,40}$/;

    if (!userNameRegex.test(userName)) {
        throw new Error('User Name should only contain Alphabets, . and Space');
    }
};

const validateEmail = (email) => {
    if (!validator.isEmail(email)) {
        throw new Error('Invalid email format');
    }
};

const validateProfession = (prof) => {
    if (!ALLOWED_PROFESSSION.includes(prof)) {
        throw new Error('Invalid Profession');
    }
};

const validatePassword = (password) => {
    if (!validator.isStrongPassword(password)) {
        throw new Error('Password is too week');
    }
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

const validateAbout = (about) => {
    if (about.length > 1000) {
        throw new Error('About must be within 1000 characters');
    }
};

const validatePhotoUrl = (url) => {
    if (!validator.isURL(url)) {
        throw new Error('Invalid URL format');
    }
};

module.exports = {
    fieldsValidator,
};
