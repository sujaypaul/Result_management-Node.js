const { Results } = require('../models/index');


class ResultRepository {
    async findRoll(rollNo) {
        try {
            const result = await Results.findOne({
                    where: {
                        RollNo: rollNo
                    }
                });
            return result;
        }
        catch (error) {
            throw (error);
        }
    }

    async create(result) {
        try {
            const created_result = await Results.create(result);
            return created_result;
        } catch (error) {
            throw (error);
        }
    }

    async update(rollNo,result) {
        try {
            const [updated_result] = await Results.update(result, {
                where: { RollNo: rollNo }
            });
            return updated_result;
        } catch (error) {
            throw (error);
        }
    }

    async delete(rollNo) {
        try {
            const deleted_Result = await Results.destroy({
                where: { RollNo: rollNo }
            });
            return deleted_Result;
        } catch (error) {
            throw (error);
        }
    }

    async getAll() {
        try {
            const results = await Results.findAll();
            return results;
        } catch (error) {
            throw (error);
        }
    }

    async findRollDOB(rollNo, dob) {
        try {
            const result = await Results.findOne({
                where: {
                    RollNo: rollNo,
                    DOB: dob
                }
            });
            return result;
        } catch (error) {
            throw (error);
        }
    }
}

module.exports = ResultRepository;