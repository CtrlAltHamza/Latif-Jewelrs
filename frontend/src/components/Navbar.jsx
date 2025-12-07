import { Link } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-gray-800 dark:text-white">LATIF JEWELRS</div>
      <ul className="flex space-x-4">
        <li><Link to="/" className="hover:text-indigo-500">Home</Link></li>
        <li><Link to="/products" className="hover:text-indigo-500">Products</Link></li>
        <li><Link to="/about" className="hover:text-indigo-500">About</Link></li>
        <li><Link to="/contact" className="hover:text-indigo-500">Contact</Link></li>
        <li><Link to="/admin" className="hover:text-indigo-500">Admin</Link></li>
      </ul>
      <DarkModeToggle />
    </nav>
  );
}
