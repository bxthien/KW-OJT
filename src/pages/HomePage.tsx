import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { notification } from "antd";
import { getCurrentUser } from "../supabase/authService";
import { supabase } from "../supabase/supabaseClient";
import { getUserName } from "../supabase/dataService";
import { Course } from "../shared/constant/course";
import CalendarComponent from "../features/HomePage/ui/CalendarComponent";
import CarouselComponent from "../features/HomePage/ui/CarouselComponent";
import "../app/index.css";
import OverviewDashboard from "./OverviewDashboard";

const HomePage: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedDescription, setSelectedDescription] = useState<string | null>(
    null
  );
  const [userName, setUserName] = useState<string | null>(null);

  const [notificationDisplayed, setNotificationDisplayed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setNotificationDisplayed(false); // �α׾ƿ� �� �˸� ���� �ʱ�ȭ
      }
    });
  }, []);

  useEffect(() => {
    if (location.state?.notification && !notificationDisplayed) {
      api.success({
        message: location.state.notification,
        description: "Welcome to HOTDOG LMS!",
        placement: "topRight",
        key: "login-success",
      });
      setNotificationDisplayed(true);
      navigate(location.pathname, { replace: true }); // ���� ����
    }

    const fetchUserData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          const fetchedUserName = await getUserName(currentUser.id);
          setUserName(fetchedUserName || "Username");
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        navigate("/login");
      }
    };

    fetchUserData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        getUserName(session.user.id).then((fetchedUserName) => {
          setUserName(fetchedUserName || "Username");
        });
      } else {
        navigate("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [
    location.state,
    api,
    navigate,
    notificationDisplayed,
    location.pathname,
    userName,
  ]);

  const closeModal = () => {
    setSelectedCourse(null);
    setSelectedDescription(null);
  };

  return (
    <div className="bg-gray-100">
      {contextHolder}
      <main className="relative flex flex-col bg-gray-100 py-4 gap-4">
        <div className="grid grid-cols-3">
          <OverviewDashboard />
        </div>
        <section className="grid grid-cols-10 gap-6 mb-6">
          {/* Welcome Section - 6 부분 */}
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col h-full col-span-6">
            <h3 className="text-3xl font-bold mb-2 text-black">Welcome!</h3>
            <CarouselComponent
              items={[
                {
                  key: 1,
                  imageUrl:
                    "https://plus.unsplash.com/premium_vector-1724224259580-04c544bd1fad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG90ZG9nfGVufDB8fDB8fHww",
                  text: "Welcome to HOTDOG LMS!",
                  textColor: "text-yellow-300",
                },
                {
                  key: 2,
                  imageUrl:
                    "https://plus.unsplash.com/premium_vector-1720534517470-8815da9e3998?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3R1ZHl8ZW58MHx8MHx8fDA%3D",
                  text: "Add your courses",
                  textColor: "text-red-400",
                },
                {
                  key: 3,
                  imageUrl:
                    "https://plus.unsplash.com/premium_vector-1733900623866-fc9102b17450?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fGpvaW58ZW58MHx8MHx8fDA%3D",
                  text: "Join our LMS",
                  textColor: "text-black-500",
                },
                {
                  key: 4,
                  imageUrl:
                    "https://plus.unsplash.com/premium_vector-1731582099083-969d4dfe2580?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8JUVCJUFBJUE5JUVEJTkxJTlDfGVufDB8fDB8fHww",
                  text: "Achieve your goals!",
                  textColor: "text-white",
                },
              ]}
            />
          </div>

          {/* Calendar Section - 4 부분 */}
          <div className="bg-white p-6 rounded-lg shadow-md h-full col-span-4">
            <h3 className="text-3xl font-bold mb-2 text-black">Calendar</h3>
            <CalendarComponent />
          </div>
        </section>
      </main>

      {selectedCourse && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">{selectedCourse.title}</h2>
            <p className="text-gray-600">Description: {selectedDescription}</p>
            <textarea
              className="w-full mt-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a description..."
              rows={4}
            />
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
