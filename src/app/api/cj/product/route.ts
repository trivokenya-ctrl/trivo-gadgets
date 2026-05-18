import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const pid = req.nextUrl.searchParams.get("pid");

  if (!pid) {
    return NextResponse.json({ error: "Product ID (pid) is required" }, { status: 400 });
  }

  try {
    const tokenRes = await fetch(new URL("/api/cj/token", req.url), { method: "POST" });
    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.accessToken) {
      return NextResponse.json({ error: "Failed to get CJ access token" }, { status: 500 });
    }

    const apiUrl = new URL("https://developers.cjdropshipping.com/api2.0/v1/product/query");
    apiUrl.searchParams.set("pid", pid);

    const res = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "CJ-Access-Token": tokenData.accessToken,
      },
    });

    const json = await res.json();

    if (!res.ok || json.code !== "200") {
      if (json.code === "404" || res.status === 404) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      console.error("CJ product API error:", json);
      return NextResponse.json({ error: "Failed to fetch product from CJ" }, { status: 500 });
    }

    const product = json.data;

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const imageSet: string[] = [];
    if (product.productImageSet && Array.isArray(product.productImageSet)) {
      const allImages = product.productImageSet.filter(Boolean).slice(0, 5);
      imageSet.push(...allImages);
    }
    if (product.productImage && !imageSet.includes(product.productImage)) {
      imageSet.unshift(product.productImage);
    }

    const variants = (product.variants || []).map((v: Record<string, unknown>) => ({
      variantName: v.variantName || v.variant_name || "",
      variantSellPrice: parseFloat(String(v.variantSellPrice ?? v.variant_sell_price ?? v.sellPrice ?? v.sell_price ?? 0)),
      variantImage: v.variantImage || v.variant_image || "",
    }));

    return NextResponse.json({
      pid: product.pid || pid,
      productName: product.productName || product.product_name || "",
      description: product.description || "",
      sellPrice: parseFloat(product.sellPrice ?? product.sell_price ?? 0),
      weight: parseFloat(product.weight ?? 0),
      productImage: product.productImage || product.product_image || imageSet[0] || "",
      productImageSet: imageSet,
      categoryName: product.categoryName || product.category_name || "",
      variants,
    });
  } catch (err) {
    console.error("CJ product fetch failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
