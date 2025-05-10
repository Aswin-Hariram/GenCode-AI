export default function ErrorDisplay({ error }) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-800">
      <div className="text-center p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2 text-red-600">Error Loading Problem</h2>
        <p className="mb-4">{error}</p>
        <p className="text-gray-600">Using default problem data</p>
      </div>
    </div>
  );
}
