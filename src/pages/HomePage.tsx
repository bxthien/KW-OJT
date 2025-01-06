import ChatBot from "./ChatBot";
import ReviewCard from "../features/HomePage/ui/ReviewCard";
import MetricsCard from "../features/HomePage/ui/MetricsCard";
import CourseCard from "../features/HomePage/ui/CourseCard";

// Home Page 컴포넌트
const HomePage = () => {
  return (
    <div className="">
      {/* Sidebar */}
      {/* <Sidebar /> */}

      {/* Main Content */}
      <main className="flex flex-col bg-gray-100 p-6 h-screen overflow-auto">
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
