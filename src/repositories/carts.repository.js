import CartDTO from "../dao/DTO/cart.dto";

export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  createCart = async () => {
    return await this.dao.create();
  };

  getCart = async (id) => {
    const cart = await this.dao.getByID(id);
    return new CartDTO(cart);
  };

  updateCart = async (id, data) => {
    const cart = await this.dao.update(id, data);
    return new CartDTO(cart);
  };

  addProductToCart = async (cart, product) => {
    if (!cart) return res.send({ status: "error", error: "No se ha encontrado el carrito" });
    if (!product) return res.send({ status: "error", error: "No se ha encontrado el producto" });

    const productIndex = cart.products.findIndex((p) => p.product.equals(product._id));
    if (productIndex === -1) {
      cart.products.push({ product: product._id, quantity: 1 });
      await cart.save();
    } else {
      cart.products[productIndex].quantity++;
      await this.updateCart(cart.id, cart)
    }
    return cart
  };
}
