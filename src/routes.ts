import {Router} from 'express'
import SendEmailController from './controller/SendEmailController'
import SurveysController from './controller/SurveysController'
import UserController from './controller/UserController'

const router = Router()

const userController = new UserController()
const surveysController = new SurveysController()
const sendEmailController = new SendEmailController()

router.post('/users', userController.create)

router.post('/surveys', surveysController.create)
router.get('/surveys', surveysController.show)

router.post('/sendEmail', sendEmailController.execute)

export default router