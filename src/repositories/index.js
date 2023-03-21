import ProductsRepository from "./products.repository";
import UsersRepository from "./users.repository";
import CartRepository from "./carts.repository";
import MessagesRepository from "./messages.repository";

import Products from "../dao/classes/products.dao";
import Users from "../dao/classes/users.dao";
import Carts from "../dao/classes/carts.dao";
import Messages from "../dao/classes/messages.dao";

export const productsService = new ProductsRepository(new Products)
export const usersService = new UsersRepository(new Users)
export const cartsService = new CartRepository(new Carts)
export const messagesService = new MessagesRepository(new Messages)