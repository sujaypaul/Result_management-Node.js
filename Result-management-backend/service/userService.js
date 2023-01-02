const UserRepository = require('../repository/userRepository.js');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

class UserService {

    constructor() {
        this.UserRepository = new UserRepository();
    }

    async create(user) {
        const salt = await bcrypt.genSalt(10);
        var enUser = {
            email: user.email,
            password: await bcrypt.hash(user.password, salt),
            role: user.role
        };
        try {
            const registeredUser = await this.UserRepository.create(enUser);
            return registeredUser;
        } catch (error) {
            throw (error);
        }
    }

    async find(email) {
        try {
            const user = await this.UserRepository.find(email);
            if (user) {
                var usr = {
                    role: user.role
                }
                return usr;
            }
            return null;
        } catch (error) {
            throw (error);
        }
    }

    async login(user) {
        try {
            const dbUser = await this.UserRepository.find(user.email);

            const passIsValid = await bcrypt.compare(user.password, dbUser.password);

            if (passIsValid) {
                const token = jwt.sign(
                    { "id": dbUser.id, "email": dbUser.email, "role": dbUser.role },
                    process.env.JWT_KEY,
                    {expiresIn:"1h"}
                );
                return { Token: token };
            } else {
                return null;
            }
        } catch (error) {
            throw (error);
        }
    }

    authenticateJWT = (role) => {
        return (req, res, next) => {
            try {
                let token = req.headers['authorization'].split(" ")[1];
                let decoded = jwt.verify(token, process.env.JWT_KEY);

                console.log(decoded.role + " and parameter " + role)
                if (decoded.role !== role) {
                    res.status(403).json({ "error": "you don't have permision" });
                }
                else {
                    req.user = decoded;
                    next();
                }

            } catch (err) {
                res.status(401).json({ "error": "Couldnt Authenticate" });
            }
        }
    }

}
module.exports = UserService;