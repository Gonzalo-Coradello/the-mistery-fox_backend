import { Router } from 'express'
import {
  updateRole,
  deleteUser,
  deleteUserByEmail,
} from '../controllers/users.controller.js'
import { passportCall, authorization } from '../middleware/auth.js'
import { uploader } from '../services/multer.js'

const router = Router()

router.put('/premium/:uid', passportCall('current'), authorization(['user',  'premium']), updateRole)
router.post('/:uid/documents', uploader.array('files'), uploadDocuments)
router.delete('/email/:email', deleteUserByEmail)
router.delete('/:uid', deleteUser)

export default router
