const difficultyMap = {
  Easy: "bg-green-200 text-green-900 border-green-300",
  Medium: "bg-yellow-200 text-yellow-900 border-yellow-300",
  Hard: "bg-red-200 text-red-900 border-red-300",
};

const DifficultyBadge = ({ difficulty }) => (
  <span
    className={`text-sm px-3 py-1 rounded-full font-medium ${
      difficultyMap[difficulty] || "bg-blue-200 text-blue-900 border-blue-300"
    }`}
  >
    {difficulty || "Unknown"}
  </span>
);

export default DifficultyBadge;
