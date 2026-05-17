export type Review = {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  text: string;
  created_at: string;
};

const STORAGE_KEY = "trivo_reviews";

export function getReviews(productId?: string): Review[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const all: Review[] = data ? JSON.parse(data) : [];
    return productId ? all.filter((r) => r.product_id === productId) : all;
  } catch {
    return [];
  }
}

export function addReview(review: Omit<Review, "id" | "created_at">): Review {
  const newReview: Review = {
    ...review,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  const all = getReviews();
  all.unshift(newReview);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return newReview;
}

export function getAverageRating(productId: string): number {
  const reviews = getReviews(productId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
