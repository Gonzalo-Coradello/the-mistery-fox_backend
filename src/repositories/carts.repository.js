import CartDTO from '../dao/DTO/cart.dto.js'
import CustomError from '../services/errors/CustomError.js'
import EErrors from '../services/errors/enums.js'
import {
  generateNullError,
  generatePurchaseError,
} from '../services/errors/info.js'
import { productsService, ticketsService } from './index.js'
import mercadopago from 'mercadopago'
import config from '../config/config.js'
const { FRONTEND_BASE_URL } = config

export default class CartRepository {
  constructor(dao) {
    this.dao = dao
  }

  createCart = async () => {
    return await this.dao.create()
  }

  getCart = async id => {
    return await this.dao.getByID(id)
  }

  updateCart = async (id, data) => {
    await this.dao.update(id, data)
    const cart = { id, products: data.products }
    return new CartDTO(cart)
  }

  addProductToCart = async (user, cart, product, quantity) => {
    if (!cart) {
      CustomError.createError({
        name: 'Cart error',
        cause: generateNullError('Cart'),
        message: 'Error trying to find cart',
        code: EErrors.NULL_ERROR,
      })
    }

    if (!product) {
      CustomError.createError({
        name: 'Product error',
        cause: generateNullError('Product'),
        message: 'Error trying to find product',
        code: EErrors.NULL_ERROR,
      })
    }

    const userID = user.id.toString()
    const owner = product.owner?.toString()

    if (user.role === 'premium' && owner === userID)
      CustomError.createError({
        name: 'Authorization error',
        cause: generateAuthorizationError(),
        message: "You can't add your own product to your cart.",
        code: EErrors.AUTHORIZATION_ERROR,
      })

    const productIndex = cart.products.findIndex(p =>
      p.product?.equals(product._id)
    )
    if (productIndex === -1) {
      cart.products.push({ product: product._id, quantity })
      await this.updateCart(cart.id, cart)
    } else {
      cart.products[productIndex].quantity += quantity
      await this.updateCart(cart.id, cart)
    }
    return new CartDTO(cart)
  }

  prepareCheckout = async cid => {
    const cart = await this.getCart(cid)
    if (cart.products.length === 0)
      CustomError.createError({
        name: 'Purchase error',
        cause: generatePurchaseError(cid),
        message: 'Error trying to purchase. Cart cannot be empty.',
        code: EErrors.PURCHASE_ERROR,
      })

    const cartProducts = await Promise.all(
      cart.products.map(async product => {
        const newObj = await productsService.getProduct(
          product.product || product._id
        )
        newObj.quantity = product.quantity
        return newObj
      })
    )

    const outOfStock = cartProducts
      .filter(p => p.stock < p.quantity)
      .map(p => ({ product: p._id, quantity: p.quantity }))
    const available = cartProducts.filter(p => p.stock >= p.quantity)

    if(outOfStock.length > 0) {
      await this.updateCart(cid, { products: available })
      return { outOfStock }
    }

    let preference = {
      items: [],
      back_urls: {
        "success": `${FRONTEND_BASE_URL}/checkout/success`,
        "failure": `${FRONTEND_BASE_URL}/checkout/failure`,
        "pending": `${FRONTEND_BASE_URL}/checkout/pending`
      },
      auto_return: "approved",
    }

    available.forEach(prod => {
      preference.items.push({
        title: prod.title,
        unit_price: prod.price,
        quantity: prod.quantity
      })
    })

    const response = await mercadopago.preferences.create(preference)
    return { outOfStock, available, preferenceId: response.body.id }
  }

  finishCheckout = async (cid, items, purchaser) => {
    const amount = items.reduce((acc, product) => acc + product.price * product.quantity, 0)
    const ticket = (await ticketsService.createTicket({ amount, purchaser, items })).toObject()
    items.forEach(async product => await productsService.updateStock(product._id, product.quantity) )
    await this.updateCart(cid, { products: [] })
    return ticket
  }

  purchase = async (cid, purchaser) => {
    const cart = await this.getCart(cid)
    if (cart.products.length === 0)
      CustomError.createError({
        name: 'Purchase error',
        cause: generatePurchaseError(cid),
        message: 'Error trying to purchase. Cart cannot be empty.',
        code: EErrors.PURCHASE_ERROR,
      })

    const cartProducts = await Promise.all(
      cart.products.map(async product => {
        const newObj = await productsService.getProduct(
          product.product || product._id
        )
        newObj.quantity = product.quantity
        return newObj
      })
    )

    const outOfStock = cartProducts
      .filter(p => p.stock < p.quantity)
      .map(p => ({ product: p._id, quantity: p.quantity }))
    const available = cartProducts.filter(p => p.stock >= p.quantity)
    const amount = available.reduce((acc, product) => acc + product.price * product.quantity, 0)

    if(outOfStock.length > 0) {
      await this.updateCart(cid, { products: available })
      return { outOfStock }
    }

    let preference = {
      items: [],
      back_urls: {
        "success": `${FRONTEND_BASE_URL}/checkout/success`,
        "failure": `${FRONTEND_BASE_URL}/checkout/failure`,
        "pending": `${FRONTEND_BASE_URL}/checkout/pending`
      },
      auto_return: "approved",
    }

    available.forEach(prod => {
      preference.items.push({
        title: prod.title,
        unit_price: prod.price,
        quantity: prod.quantity
      })
    })

    const response = await mercadopago.preferences.create(preference)

    const ticket = (await ticketsService.createTicket({ amount, purchaser, items: available })).toObject()
    available.forEach(async product => await productsService.updateStock(product._id, product.quantity) )
    await this.updateCart(cid, { products: [] })

    return { outOfStock, ticket, preferenceId: response.body.id }
  }
}
