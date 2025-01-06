const ReviewCard = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h4 className="text-xs font-medium text-gray-500">{label}</h4>
      <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
  );
};

export default ReviewCard;
