export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254757512769";

export const generateWhatsAppLink = (productName: string, price: number) => {
  const message = `Hi! I'd like to order the ${productName} at KES ${price.toLocaleString()}. Is it available?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const generateCartWhatsAppLink = (items: { name: string; quantity: number; price: number }[], total: number) => {
  let message = `*Hi Trivo Kenya! I'd like to place an order:*\n\n`;
  
  items.forEach(item => {
    message += `- ${item.quantity}x ${item.name} (KES ${(item.price * item.quantity).toLocaleString()})\n`;
  });
  
  message += `\n*Total: KES ${total.toLocaleString()}*\n\nPlease confirm availability.`;
  
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
