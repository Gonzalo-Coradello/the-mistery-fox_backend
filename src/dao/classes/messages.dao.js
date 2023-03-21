import MessageModel from "../models/message.model";

export default class Messages {
    constructor () {}

    create = async (user, message) => {
        return await MessageModel.create({ user, message })
    }
}