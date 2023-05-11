import { Router } from 'express'
import {
  updateRole,
  deleteUser,
  deleteUserByEmail,
} from '../controllers/sessions.controller.js'
import { passportCall, authorization } from '../middleware/auth.js'

const router = Router()

router.put('/premium/:uid', passportCall('current'), authorization(['user',  'premium']), updateRole)
router.delete('/email/:email', deleteUserByEmail)
router.delete('/:uid', deleteUser)

export default router
