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

export default function BrandsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Brands We <span className="text-accent">Carry</span>
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="group relative"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-foreground/[0.07] to-foreground/[0.02] border border-subtle flex items-center justify-center text-2xl md:text-3xl font-bold text-foreground/80 group-hover:text-accent group-hover:border-accent/30 group-hover:shadow-[0_0_30px_-5px_rgba(37,211,102,0.15)] transition-all duration-300">
                {brand.icon}
              </div>
              <span className="block text-center text-xs text-muted-foreground mt-2 font-medium group-hover:text-muted transition-colors">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
