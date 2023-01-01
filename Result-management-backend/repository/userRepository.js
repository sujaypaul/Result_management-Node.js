const { User } = require('../models/index')

class UserRepository {

    async create(user) {
        try {
            const created_User = await User.create(user);
            return created_User;
        } catch (error) {
            throw (error);
        }
    }

    async find(email) {
        try {
            const user = await User.findOne({
                where: { email: email }
            });
            return user;
        } catch (error) {
            throw (error);
        }
    }
}

module.exports = UserRepository;