import { useParams } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();

  // For now, static content; can fetch details later
  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Product Detail - {id}</h1>
      <img src="/images/hero.jpg" alt="Product" className="w-full max-w-lg mx-auto mb-4" />
      <p className="text-gray-700 dark:text-gray-300">Description of the product goes here.</p>
    </div>
  );
}
