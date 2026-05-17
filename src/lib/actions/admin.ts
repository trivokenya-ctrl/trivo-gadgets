"use server";

import { createServerClient } from "@supabase/ssr";
import { Database } from "@/types/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"];

function getAdminClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

export async function createProduct(formData: FormData) {
  const supabase = getAdminClient();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseInt(formData.get("price") as string) || 0;
  const stock = parseInt(formData.get("stock") as string) || 0;
  const category = formData.get("category") as string;
  const image_url = formData.get("image_url") as string;
  const is_featured = formData.get("is_featured") === "true";
  const seo_title = formData.get("seo_title") as string;
  const seo_description = formData.get("seo_description") as string;
  const focus_keyword = formData.get("focus_keyword") as string;

  if (is_featured) {
    await supabase.from("products").update({ is_featured: false }).neq("id", "placeholder");
  }

  const { error } = await supabase.from("products").insert({
    name,
    description: description || null,
    price,
    stock,
    category: category || null,
    image_url: image_url || null,
    is_featured,
    seo_title: seo_title || null,
    seo_description: seo_description || null,
    focus_keyword: focus_keyword || null,
  });

  if (error) throw new Error(error.message);
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = getAdminClient();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseInt(formData.get("price") as string) || 0;
  const stock = parseInt(formData.get("stock") as string) || 0;
  const category = formData.get("category") as string;
  const image_url = formData.get("image_url") as string;
  const is_featured = formData.get("is_featured") === "true";
  const seo_title = formData.get("seo_title") as string;
  const seo_description = formData.get("seo_description") as string;
  const focus_keyword = formData.get("focus_keyword") as string;

  if (is_featured) {
    await supabase.from("products").update({ is_featured: false }).neq("id", id);
  }

  const { error } = await supabase
    .from("products")
    .update({
      name,
      description: description || null,
      price,
      stock,
      category: category || null,
      image_url: image_url || null,
      is_featured,
      seo_title: seo_title || null,
      seo_description: seo_description || null,
      focus_keyword: focus_keyword || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deleteProduct(id: string) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getAdminStats() {
  const supabase = getAdminClient();

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*");

  if (productsError) throw new Error(productsError.message);

  const { count: subscribersCount, error: subsError } = await supabase
    .from("subscribers")
    .select("*", { count: "exact", head: true });

  if (subsError) throw new Error(subsError.message);

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const lowStock = products.filter((p) => p.stock < 3).length;

  return { totalProducts, totalStock, subscribersCount: subscribersCount || 0, lowStock };
}

export async function getAdminProducts() {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Product[];
}

export async function getAdminSubscribers() {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("subscribers")
    .select("email, subscribed_at")
    .order("subscribed_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}
