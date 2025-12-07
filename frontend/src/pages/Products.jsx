import ProductCard from "../components/ProductCard";

const products = [
  // same 15 products as Home.jsx
  { id: 1, image: "/images/set.jpg" },
    { id: 2, image: "/images/s2.jpeg" },
    { id: 3, image: "/images/s5.png" },
    { id: 4, image: "/images/s3.png" },
    { id: 5, image: "/images/s6.jpeg" },
  { id: 1, image: "/images/b1.png" },
    { id: 2, image: "/images/b2.jpeg" },
    { id: 3, image: "/images/b3.png" },
    { id: 4, image: "/images/r1.jpg" },
    { id: 5, image: "/images/r2.jpg" },
  { id: 1, image: "/images/r3.jpg" },
    { id: 2, image: "/images/e1.png" },
    { id: 3, image: "/images/e5.png" },
    { id: 4, image: "/images/sr1.jpg" },
    { id: 5, image: "/images/sr3.jpg" },
];

export default function Products() {
  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
