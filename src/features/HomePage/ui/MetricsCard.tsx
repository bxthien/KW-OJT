const MetricsCard = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h4 className="text-sm font-medium text-gray-500">{title}</h4>
      <p className="text-xl font-semibold text-gray-800 mt-2">{value}</p>
    </div>
  );
};

export default MetricsCard;
