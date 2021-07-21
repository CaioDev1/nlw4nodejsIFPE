import {Router} from 'express'
import AnswerController from './controller/AnswerController'
import NpsController from './controller/NpsController'
import SendEmailController from './controller/SendEmailController'
import SurveysController from './controller/SurveysController'
import UserController from './controller/UserController'

const router = Router()

const userController = new UserController()
const surveysController = new SurveysController()
const sendEmailController = new SendEmailController()
const answerController = new AnswerController()
const npsController = new NpsController()

router.post('/users', userController.create)

router.post('/surveys', surveysController.create)
router.get('/surveys', surveysController.show)

router.post('/sendEmail', sendEmailController.execute)

router.get('/answers/:value', answerController.execute)

router.get('/nps/:survey_id', npsController.execute)

export default router