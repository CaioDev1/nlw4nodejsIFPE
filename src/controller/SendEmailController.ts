import {Request, Response} from 'express'
import { getCustomRepository } from 'typeorm'
import SurveysRepository from '../database/repositories/SurveysRepository'
import SurveysUsersRepository from '../database/repositories/SurveysUsersRepository'
import UsersRepository from '../database/repositories/UsersRepository'
import SendEmailService from '../services/SendEmailService'
import {resolve} from 'path'
import AppErrors from '../errors/AppErrors'

class SendEmailController {
    async execute(req: Request, res: Response) {
        const {email, survey_id} = req.body

        const usersRepository = getCustomRepository(UsersRepository)
        const surveysRepository = getCustomRepository(SurveysRepository)
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

        const user = await usersRepository.findOne({email})

        if(!user) {
            throw new AppErrors('User does not exist.')
        }

        const survey = await surveysRepository.findOne({id: survey_id})

        if(!survey) {
            throw new AppErrors('Survey does not exist.')
        }

        const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsEmail.hbs')

        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: {user_id: user.id, value: null},
            relations: ['user', 'survey']
        })

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: '',
            link: process.env.URL_MAIL
        }


        if(surveyUserAlreadyExists) {
            variables.id = surveyUserAlreadyExists.id

            await SendEmailService.execute(email, survey.title, variables, npsPath)
            
            return res.json(surveyUserAlreadyExists)
        }

        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        })

        await surveysUsersRepository.save(surveyUser)

        variables.id = surveyUser.id
        
        await SendEmailService.execute(email, survey.title, variables, npsPath)

        res.json(surveyUser)
    }
}

export default SendEmailController