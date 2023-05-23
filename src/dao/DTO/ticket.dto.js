export default class TicketDTO {
  constructor(ticket) {
    this.code = ticket.code,
    this.purchase_datetime = ticket.purchase_datetime,
    this.amount = ticket.amount,
    this.purchaser = ticket.purchaser
    this.items = ticket.items.map(p => ({
      id: p._id || p.id,
      title: p.title,
      author: p.author,
      price: p.price,
      quantity: p.quantity 
    }))
  }
}
