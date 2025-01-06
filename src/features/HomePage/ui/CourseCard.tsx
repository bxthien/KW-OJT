const CourseCard = ({
  title,
  price,
  chapters,
  orders,
  certificates,
  reviews,
}: {
  title: string;
  price: string;
  chapters: number;
  orders: number;
  certificates: number;
  reviews: number;
}) => {
  return (
    <div className="p-4 bg-white shadow rounded-md">
      <span className="text-xs font-bold text-gray-500 uppercase">Free</span>
      <h3 className="text-lg font-semibold mt-2">{title}</h3>
      <p className="text-sm text-gray-400">${price}</p>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xl font-bold">{chapters}</p>
          <p className="text-xs text-gray-500">Chapters</p>
        </div>
        <div>
          <p className="text-xl font-bold">{orders}</p>
          <p className="text-xs text-gray-500">Orders</p>
        </div>
        <div>
          <p className="text-xl font-bold">{certificates}</p>
          <p className="text-xs text-gray-500">Certificates</p>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-4">{reviews} Reviews</p>
    </div>
  );
};

export default CourseCard;
