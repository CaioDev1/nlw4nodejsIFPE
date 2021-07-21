import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import UsersRepository from '../database/repositories/UsersRepository'
import * as yup from 'yup'
import AppErrors from '../errors/AppErrors'

class UserController {
    async create(req: Request, res: Response) {
        const {name, email} = req.body

        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required()
        })

        try {
            await schema.validate(req.body, {abortEarly: false})
        } catch(err) {
            throw new AppErrors(err)
        }
        
        const usersRepository = getCustomRepository(UsersRepository)

        const userAlreadyExists = await usersRepository.findOne({
            email
        })

        if(userAlreadyExists) {
            return res.status(400).json({
                error: 'User already exists.'
            })
        }

        const user = usersRepository.create({
            name,
            email
        })

        await usersRepository.save(user)

        res.status(201).json(user)
    }
}

export default UserController