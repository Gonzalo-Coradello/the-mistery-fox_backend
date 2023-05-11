import { usersService } from '../repositories/index.js'
import config from '../config/config.js'
import CustomError from '../services/errors/CustomError.js'
import { generateAuthenticationError } from '../services/errors/info.js'
import EErrors from '../services/errors/enums.js'

const { COOKIE_NAME } = config

export const updateRole = async (req, res) => {
  try {
    const { uid } = req.params
    const user = await usersService.getUserByID(uid)

    const newRole = user.role === 'user' ? 'premium' : 'user'

    const data = {
      ...user,
      role: newRole,
    }

    const result = await usersService.updateUser(uid, data)

    res.clearCookie(COOKIE_NAME).json({
      status: 'success',
      message: `Role updated to ${newRole}. Log in again.`,
    })
  } catch (error) {
    req.logger.error(error.toString())
    res.json({ status: 'error', error })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params
    const result = await usersService.deleteUser(uid)
    res.json({ status: 'success', result })
  } catch (error) {
    req.logger.error(error.toString())
    res.json({ status: 'error', error })
  }
}

export const deleteUserByEmail = async (req, res) => {
  try {
    const email = req.params.email
    const user = await usersService.getUserByEmail(email)
    if (!user)
      CustomError.createError({
        name: 'Authentication error',
        cause: generateAuthenticationError(),
        message: 'Error trying to find user.',
        code: EErrors.AUTHENTICATION_ERROR,
      })
    const result = await usersService.deleteUser(user._id || user.id)
    res.json({ status: 'success', result })
  } catch (error) {
    req.logger.error(error.toString())
    res.json({ status: 'error', error })
  }
}
