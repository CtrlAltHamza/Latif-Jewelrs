export default function Contact() {
  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <form className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow space-y-4">
        <input type="text" placeholder="Your Name" className="w-full p-2 border rounded" />
        <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
        <textarea placeholder="Message" className="w-full p-2 border rounded" rows={4}></textarea>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500">Send</button>
      </form>
    </div>
  );
}
