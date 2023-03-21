import UserDTO from "../dao/DTO/user.dto";

export default class UsersRepository {
    constructor(dao) {
        this.dao = dao
    }

    getUsers = async () => await this.dao.get()
    getUserByID = async (id) => {
        const user = await this.dao.getByID(id)
        return new UserDTO(user)
    }
    getUserByEmail = async (email) => {
        const user = await this.dao.getByEmail(email)
        return new UserDTO(user)
    }
    createUser = async (data) => {
        return await this.dao.create(data)
    }
}