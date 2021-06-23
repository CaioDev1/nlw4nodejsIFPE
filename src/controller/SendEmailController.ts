import {Request, Response} from 'express'
import { getCustomRepository } from 'typeorm'
import SurveysRepository from '../database/repositories/SurveysRepository'
import SurveysUsersRepository from '../database/repositories/SurveysUsersRepository'
import UsersRepository from '../database/repositories/UsersRepository'
import SendEmailService from '../services/SendEmailService'
import {resolve} from 'path'

class SendEmailController {
    async execute(req: Request, res: Response) {
        const {email, survey_id} = req.body

        const usersRepository = getCustomRepository(UsersRepository)
        const surveysRepository = getCustomRepository(SurveysRepository)
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

        const user = await usersRepository.findOne({email})

        if(!user) {
            res.status(400).json({
                error: 'User does not exist.'
            })
        }

        const survey = await surveysRepository.findOne({id: survey_id})

        if(!survey) {
            res.status(400).json({
                error: 'Survey does not exist.'
            })
        }

        const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsEmail.hbs')
        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            user_id: user.id,
            link: process.env.URL_MAIL
        }

        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: [{user_id: user.id}, {value: null}],
            relations: ['user', 'survey']
        })

        if(surveyUserAlreadyExists) {
            await SendEmailService.execute(email, survey.title, variables, npsPath)
            
            return res.json(surveyUserAlreadyExists)
        }

        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        })

        await surveysUsersRepository.save(surveyUser)

        await SendEmailService.execute(email, survey.title, variables, npsPath)

        res.json(surveyUser)
    }
}

export default SendEmailController