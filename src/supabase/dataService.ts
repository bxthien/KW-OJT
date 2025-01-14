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
 * 데이터베이스에서 모든 user_name, email, created_at, is_admin 가져오기
 * @returns user_name, email, created_at, is_admin 배열
 */
export const getUsersData = async (): Promise<
  {
    user_id: string;
    user_name: string;
    is_admin: boolean;
    created_at: string;
    email: string;
    contact: string;
    birth: string;
    age: number;
    status: boolean;
  }[]
> => {
  const { data, error } = await supabase
    .from("users") // Supabase 데이터베이스의 "users" 테이블
    .select(
      "user_id, user_name, email, created_at, is_admin, contact, date_of_birth, age, status"
    ); // 가져올 컬럼 지정
  if (error) {
    console.error("Error fetching users data:", error.message);
    return [];
  }
  // user_name, email, created_at, is_admin 데이터를 배열로 반환
  return data.map((user) => ({
    user_id: user.user_id || "Unknown",
    user_name: user.user_name || "Unknown",
    is_admin: user.is_admin || false,
    created_at: user.created_at || "Unknown",
    email: user.email || "Unknown",
    contact: user.contact || "Unknown",
    birth: user.date_of_birth || "Unknown",
    age: user.age || 0, // age가 없으면 0으로 기본값 설정\
    status: !!user.status,
  }));
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
export const getCourseColors = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("courses") // Supabase 데이터베이스의 "courses" 테이블
    .select("color"); // 가져올 컬럼을 "color"로 제한
  if (error) {
    console.error("Error fetching course colors:", error.message);
    return [];
  }
  // color만 추출하여 배열로 반환
  return data.map((course) => course.color || "#1677FF"); // 기본 색상을 설정
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
export const addUserData = async (user: {
  name: string;
  type: string;
  date: string;
  contact: string;
}) => {
  const { error } = await supabase.from("users").insert([
    {
      user_name: user.name,
      is_admin: user.type === "Admin",
      created_at: user.date,
      email: user.contact,
    },
  ]);
  if (error) {
    throw new Error(error.message);
  }
};
export const updateUserData = async (
  id: number,
  updates: { name: string; type: string; date: string; contact: string }
) => {
  const { error } = await supabase
    .from("users")
    .update({
      user_name: updates.name,
      is_admin: updates.type === "Admin",
      created_at: updates.date,
      email: updates.contact,
    })
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
};
