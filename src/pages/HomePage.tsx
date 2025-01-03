import Sidebar from "./Sidebar";
import ChatBot from "./ChatBot";

// Metrics 컴포넌트
const MetricsCard = ({ title, value }: { title: string; value: string }) => (
  <div className="p-4 bg-white shadow rounded-md">
    <h4 className="text-sm font-medium text-gray-500">{title}</h4>
    <p className="text-xl font-semibold text-gray-800 mt-2">{value}</p>
  </div>
);

// Review 컴포넌트
const ReviewCard = ({ label, value }: { label: string; value: string }) => (
  <div className="p-4 bg-white shadow rounded-md">
    <h4 className="text-xs font-medium text-gray-500">{label}</h4>
    <p className="text-lg font-bold text-gray-800">{value}</p>
  </div>
);

// Course 컴포넌트
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
}) => (
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

// Home Page 컴포넌트
const HomePage = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Add Course
          </button>
        </header>

        {/* Metrics */}
        <section className="grid grid-cols-3 gap-6 mb-6">
          <MetricsCard title="Life Time Courses Commission" value="$1K" />
          <MetricsCard title="Life Time Received Commission" value="$800.0" />
          <MetricsCard title="Life Time Pending Commission" value="$200.0" />
        </section>

        {/* Sales Chart (임시 대체) */}
        <section className="bg-white shadow rounded-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Life Time Sales</h3>
          <div className="h-40 bg-gray-200"></div>{" "}
          {/* 차트 라이브러리로 대체 */}
        </section>

        {/* Reviews */}
        <section className="grid grid-cols-6 gap-4 mb-6">
          <ReviewCard label="Total Reviews" value="1000" />
          <ReviewCard label="1 star reviews" value="100" />
          <ReviewCard label="2 star reviews" value="100" />
          <ReviewCard label="3 star reviews" value="100" />
          <ReviewCard label="4 star reviews" value="100" />
          <ReviewCard label="5 star reviews" value="100" />
        </section>

        {/* Courses */}
        <section className="grid grid-cols-3 gap-6">
          <CourseCard
            title="Beginner's Guide to Design"
            price="50.00"
            chapters={13}
            orders={254}
            certificates={25}
            reviews={25}
          />
          <CourseCard
            title="Beginner's Guide to Design"
            price="50.00"
            chapters={13}
            orders={254}
            certificates={25}
            reviews={25}
          />
          <CourseCard
            title="Beginner's Guide to Design"
            price="50.00"
            chapters={13}
            orders={254}
            certificates={25}
            reviews={25}
          />
        </section>
      </main>
      {/* Chatbot Icon */}
      <ChatBot />
    </div>
  );
};

export default HomePage;
