import { ShieldCheck, Award, Star, Truck } from "lucide-react";

const brands = [
  { name: "Samsung", icon: "S" },
  { name: "Apple", icon: "A" },
  { name: "Sony", icon: "S" },
  { name: "JBL", icon: "J" },
  { name: "Bose", icon: "B" },
  { name: "Xiaomi", icon: "X" },
  { name: "Dyson", icon: "D" },
  { name: "Anker", icon: "A" },
];

const guarantees = [
  { icon: ShieldCheck, text: "100% Authentic Products" },
  { icon: Award, text: "Official Brand Warranty" },
  { icon: Star, text: "Quality Verified" },
  { icon: Truck, text: "Nationwide Delivery" },
];

export default function BrandsSection() {
  return (
    <section className="py-16 border-y border-white/5 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-3">
            Certified <span className="text-accent">Brands</span>
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto">
            We partner with authorized distributors to bring you genuine products with full warranty.
          </p>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-6 mb-12">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl md:text-2xl font-bold text-white group-hover:border-accent/50 group-hover:bg-white/10 transition-all">
                {brand.icon}
              </div>
              <span className="text-xs text-neutral-500 font-medium text-center">{brand.name}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {guarantees.map((g) => {
            const Icon = g.icon;
            return (
              <div
                key={g.text}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <Icon className="h-5 w-5 text-accent shrink-0" />
                <span className="text-sm text-neutral-300 font-medium">{g.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
