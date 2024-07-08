const { User } = require("../models/user.model");

async function verifyRole(email) {
    try {
        let user = await User.findOne({ where: { email: email } });
        return user.role
    } catch (error) {
        throw new Error('You are not authorized')
    }
}


module.exports = {
    verifyRole
};