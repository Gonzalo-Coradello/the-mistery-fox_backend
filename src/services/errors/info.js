export const generatePropertyError = ({
  title,
  author,
  code,
  price,
  stock,
}) => {
  return `One or more properties were incomplete or not valid.
    List of required properties:
    * title     : needs to be a String, received ${title}
    * author    : needs to be a String, received ${author}
    * code      : needs to be a String, received ${code}
    * price     : needs to be a Number, received ${price}
    * stock     : needs to be a Number, received ${stock}`;
};

export const generateDuplicatedError = (code) => {
  return `Code "${code}" is duplicated. Code property must be unique.`;
};

export const generateStockError = (stock) => {
  return `Stock must be either a positive number or zero. ${stock} is invalid.`;
};

export const generateNullError = (cartOrProduct) => {
  return `${cartOrProduct} does not exist.`;
};

export const generatePurchaseError = (cid) => {
  return `Cart with ID ${cid} is empty. Add products and try again.`;
};

export const generateAuthenticationError = () => {
  return "User not found.";
};
