
const validateCandidateData = async (req, res, next) => {
    const { firstName, lastName, email, phoneNumber, timeInterval, linkedIn, github, comment } = req.body;
    const errors = [];

    if (!firstName || typeof firstName !== 'string' || firstName.trim() === '') {
        errors.push({ field: 'firstName', message: 'First name is required and must be a non-empty string.' });
    } else if (firstName.length < 3) {
        errors.push({ field: 'firstName', message: 'First name must be at least 3 characters long.' });
    }

    if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
        errors.push({ field: 'lastName', message: 'Last name is required and must be a non-empty string.' });
    } else if (lastName.length < 3) {
        errors.push({ field: 'lastName', message: 'Last name must be at least 3 characters long.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push({ field: 'email', message: 'A valid email address is required.' });
    }

    if (phoneNumber && typeof phoneNumber !== 'string') {
        errors.push({ field: 'phoneNumber', message: 'Phone number must be a string.' });
    }

    if (timeInterval && typeof timeInterval !== 'string') {
        errors.push({ field: 'timeInterval', message: 'Time interval must be a string.' });
    }

    if (linkedIn && !isValidUrl(linkedIn)) {
        errors.push({ field: 'linkedIn', message: 'LinkedIn profile URL must be a valid URL.' });
    }

    if (github && !isValidUrl(github)) {
        errors.push({ field: 'github', message: 'GitHub profile URL must be a valid URL.' });
    }

    if (!comment || typeof comment !== 'string' || comment.trim() === '') {
        errors.push({ field: 'comment', message: 'Free text comment is required and must be a non-empty string.' });
    } else if (comment.length < 5) {
        errors.push({ field: 'comment', message: 'Comment must be at least 5 characters long.' });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

const isValidUrl = (urlString) => {
    try {
        new URL(urlString);
        return true;
    } catch (e) {
        return false;
    }
};

export default validateCandidateData;
