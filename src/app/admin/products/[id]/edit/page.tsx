import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminProductForm from "../../AdminProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product) notFound();

  return <AdminProductForm product={product} />;
}
