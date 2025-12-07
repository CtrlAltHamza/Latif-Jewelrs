export default function About() {
  const team = [
    { name: "Muhammad Khurram Shehzad", phone: "0301-7890240", img: "/images/abag.jpg" },
    { name: "Muhammad Amran Latif", phone: "0301-3934992", img: "/images/amran.jpg" },
    { name: "Dawood Khurram", phone: "0305-7521082", img: "/images/dk.jpg" },
  ];

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Top: image (Latif Shehzad) to the left of heading + intro */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
        <div className="w-40 h-40 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
          <img
            src="/images/abu.jpg"
            alt="Latif Shehzad"
            className="w-full h-full object-contain"
            onError={(e) => { e.currentTarget.src = '/images/placeholder.jpg'; }}
          />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">About LATIF JEWELS</h1>
          <p className="mb-2">
            LATIF JEWELS is dedicated to providing elegant jewelry for every occasion.
            Visit us at our shop to purchase jewelry!
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            With Latif Shehzad — crafting quality and trust since day one.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {team.map((person, i) => (
          <div key={i} className="border p-4 rounded shadow bg-white dark:bg-gray-800 flex flex-col">
            <div>
              <h3 className="text-xl font-bold">{person.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{person.phone}</p>
            </div>

            {/* image below their info - show full image and expand width */}
            <div className="mt-4 overflow-hidden rounded-md">
              <div className="w-full h-56 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <img
                  src={person.img || "/images/placeholder.jpg"}
                  alt={person.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-2">Shop Address</h2>
      <p>Sadar Bazar Faqirwali</p>
    </div>
  );
}
