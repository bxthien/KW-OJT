import { Image } from "antd";
import CourseIcon from "../assets/monitor.svg";
import UpArrow from "../assets/arrow-up.png";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import IncrementalCounter from "../shared/services/IncrementalCounter";

const OverviewDashboard = () => {
  const [courseCount, setCourseCount] = useState(0);
  const [coursePercent, setCoursePercent] = useState(0);

  const [userCount, setUserCount] = useState(0);
  const [userPercent, setuserPercent] = useState(0);

  const [userCourseCount, setUserCourseCount] = useState(0);
  const [userCoursePercent, setuserCoursePercent] = useState(0);

  useEffect(() => {
    const fetchCourseCount = async () => {
      const { count: currentCount, error: currentError } = await supabase
        .from("courses")
        .select("*", { count: "exact" });

      const { count: weeklyCount, error: weeklyError } = await supabase
        .from("courses")
        .select("*", { count: "exact" })
        .gte(
          "create_at",
          new Date(new Date().setDate(new Date().getDate() - 7)).toISOString()
        );

      if (currentError || weeklyError) {
        console.error(
          "Error fetching course counts:",
          currentError || weeklyError
        );
      } else {
        const percentageIncrease =
          ((weeklyCount ?? 0 - (currentCount ?? 1)) / (currentCount ?? 1)) *
          100;
        console.log(
          "Percentage increase in courses this week:",
          percentageIncrease
        );
        setCoursePercent(Math.round(percentageIncrease));
        setCourseCount(currentCount ?? 0);
      }
    };

    const fetchUserCount = async () => {
      const { count, error } = await supabase
        .from("user_course_info")
        .select("*", { count: "exact" });

      const { count: weeklyCount, error: weeklyError } = await supabase
        .from("user_course_info")
        .select("*", { count: "exact" })
        .gte(
          "student_enrollment_date",
          new Date(new Date().setDate(new Date().getDate() - 7)).toISOString()
        );

      if (error || weeklyError) {
        console.error(
          "Error fetching course counts:",
          weeklyError || weeklyError
        );
      } else {
        const percentageIncrease =
          ((weeklyCount ?? 0 - (count ?? 1)) / (count ?? 1)) * 100;
        console.log(
          "Percentage increase in courses this week:",
          percentageIncrease
        );
        setuserPercent(Math.round(percentageIncrease));
        setUserCount(count ?? 0);
      }
    };

    const fetchUserCourseInfo = async () => {
      const { count, error } = await supabase
        .from("users")
        .select("*", { count: "exact" });

      const { count: weeklyCount, error: weeklyError } = await supabase
        .from("users")
        .select("*", { count: "exact" })
        .gte(
          "created_at",
          new Date(new Date().setDate(new Date().getDate() - 7)).toISOString()
        );

      if (error || weeklyError) {
        console.error(
          "Error fetching course counts:",
          weeklyError || weeklyError
        );
      } else {
        const percentageIncrease =
          ((weeklyCount ?? 0 - (count ?? 1)) / (count ?? 1)) * 100;
        console.log(
          "Percentage increase in courses this week:",
          percentageIncrease
        );
        setuserCoursePercent(Math.round(percentageIncrease));
        setUserCourseCount(count ?? 0);
      }
    };

    fetchUserCount();
    fetchCourseCount();
    fetchUserCourseInfo();
  }, []);

  return (
    <div className="col-span-3">
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-row items-center gap-3 bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-center bg-teal-200 p-3 rounded-full">
            <Image src={CourseIcon} width={48} height={48} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-500">Courses</h2>
            <p className="text-4xl text-black font-bold">
              <IncrementalCounter end={courseCount} />
            </p>
            <p className="flex flex-row items-center justify-center text-black">
              <Image src={UpArrow} />
              <p className="text-[#00AC4F] flex items-center font-bold ">
                <IncrementalCounter end={coursePercent} />%
              </p>
              from last week
            </p>
          </div>
        </div>
        <div className="flex flex-row items-center gap-3 bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-center bg-teal-200 p-3 rounded-full">
            <Image src={CourseIcon} width={48} height={48} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-500">Users</h2>
            <p className="text-4xl text-black font-bold">
              <IncrementalCounter end={userCount} />
            </p>
            <p className="flex flex-row items-center justify-center text-black">
              <Image src={UpArrow} />
              <p className="text-[#00AC4F] flex items-center font-bold ">
                <IncrementalCounter end={userPercent} />%
              </p>
              from last week
            </p>
          </div>
        </div>{" "}
        <div className="flex flex-row items-center gap-3 bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-center bg-teal-200 p-3 rounded-full">
            <Image src={CourseIcon} width={48} height={48} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-500">Courses</h2>
            <p className="text-4xl text-black font-bold">
              <IncrementalCounter end={userCourseCount} />
            </p>
            <p className="flex flex-row items-center justify-center text-black">
              <Image src={UpArrow} />
              <p className="text-[#00AC4F] flex items-center font-bold ">
                <IncrementalCounter end={userCoursePercent} />%
              </p>
              from last week
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;
