import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import SurveysUsersRepository from "../database/repositories/SurveysUsersRepository";

class NpsController {
    async execute(req: Request, res: Response) {
        const {survey_id} = req.params

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

        const surveyUsers = await surveysUsersRepository.find({
            survey_id,
            value: Not(IsNull())
        })

        const detractor = surveyUsers.filter(survey => (survey.value >= 0 && survey.value <= 6)).length

        const promoters = surveyUsers.filter(survey => (survey.value >= 9 && survey.value <= 10)).length

        const passives = surveyUsers.filter(survey => (survey.value >= 7 && survey.value <= 8)).length

        const totalAnswers = surveyUsers.length

        const calculate = Number(((promoters - detractor) / totalAnswers * 100).toFixed(2))

        return res.json({
            detractor,
            promoters,
            passives,
            totalAnswers,
            nps: calculate
        })
    }
}

export default NpsController