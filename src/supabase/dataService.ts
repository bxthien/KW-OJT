import { supabase } from "./supabaseClient";

/**
 * 데이터베이스에서 유저 이름 가져오기
 * @param userId 유저 ID (Supabase Auth의 user ID)
 * @returns 유저 이름
 */
export const getUserName = async (userId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from("users") // Supabase 데이터베이스의 "users" 테이블
    .select("user_name") // 가져올 컬럼 지정
    .eq("user_id", userId) // 조건: user_id와 일치
    .single(); // 단일 결과만 반환

  if (error) {
    console.error("Error fetching user name:", error.message);
    return null;
  } 

  return data?.user_name || null;
};

/**
 * 데이터베이스에서 모든 course_name 가져오기
 * @returns course_name 배열
 */
export const getCourseNames = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("courses") // Supabase 데이터베이스의 "courses" 테이블
    .select("course_name"); // 가져올 컬럼 지정

  if (error) {
    console.error("Error fetching course names:", error.message);
    return [];
  }

  // course_name만 추출하여 배열로 반환
  return data.map((course) => course.course_name);
};

/**
 * 데이터베이스에서 모든 course_name과 color 가져오기
 * @returns course_name과 color를 포함한 배열
 */
export const getCoursesWithColors = async (): Promise<{ course_name: string; color: string }[]> => {
  const { data, error } = await supabase
    .from("courses") // Supabase 데이터베이스의 "courses" 테이블
    .select("course_name, color"); // 가져올 컬럼 지정

  if (error) {
    console.error("Error fetching courses with colors:", error.message);
    return [];
  }

  // course_name과 color 추출하여 배열로 반환
  return data.map((course) => ({
    course_name: course.course_name,
    color: course.color || "#1677ff", // 기본 색상을 설정
  }));
};

/**
 * 데이터베이스에서 모든 course_description 가져오기
 * @returns course_description 배열
 */
export const getCourseDescriptions = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("courses") // Supabase 데이터베이스의 "courses" 테이블
    .select("course_description"); // 가져올 컬럼 지정

  if (error) {
    console.error("Error fetching course descriptions:", error.message);
    return [];
  }

  // course_description만 추출하여 배열로 반환
  return data.map((course) => course.course_description);
};





