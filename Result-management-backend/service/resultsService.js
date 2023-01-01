const ResultRepository = require('../repository/resultRepository.js');

class ResultService{

    constructor(){
        this.ResultRepository = new ResultRepository();
    }

    async findRoll(rollNo) {
        try {
            const result = await this.ResultRepository.findRoll(rollNo);
            return result;
        }
        catch (error) {
            throw (error);
        }
    }

    async create(result) {
        try {
            const created_result = await this.ResultRepository.create(result);
            return created_result;
        } catch (error) {
            throw (error);
        }
    }

    async update(rollNo,result) {
        try {
            const updated_result = await this.ResultRepository.update(rollNo,result);
            return updated_result;
        } catch (error) {
            throw (error);
        }
    }

    async delete(rollNo) {
        try {
            const deleted_Result = await this.ResultRepository.delete(rollNo);
            return deleted_Result;
        } catch (error) {
            throw (error);
        }
    }

    async getAll() {
        try {
            const Results = await this.ResultRepository.getAll();
            return Results;
        } catch (error) {
            throw (error);
        }
    }

    async findRollDOB(rollNo, DOB) {
        try {
            const result = await this.ResultRepository.findRollDOB(rollNo,DOB);
            return result;
        } catch (error) {
            throw (error);
        }
    }
}

module.exports = ResultService;