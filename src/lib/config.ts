export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254757512769";

export const generateWhatsAppLink = (productName: string, price: number) => {
  const message = `Hi Trivo Kenya! I'd like to order ${productName} at KES ${price.toLocaleString()}. Please confirm availability.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
