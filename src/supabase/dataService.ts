import { supabase } from "./supabaseClient";

/**
 * �����ͺ��̽����� ���� �̸� ��������
 * @param userId ���� ID (Supabase Auth�� user ID)
 * @returns ���� �̸�
 */
export const getUserName = async (userId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from("users") // Supabase �����ͺ��̽��� "users" ���̺�
    .select("user_name") // ������ �÷� ����
    .eq("user_id", userId) // ����: user_id�� ��ġ
    .single(); // ���� ����� ��ȯ

  if (error) {
    console.error("Error fetching user name:", error.message);
    return null;
  } 

  return data?.user_name || null;
};

/**
 * �����ͺ��̽����� ��� course_name ��������
 * @returns course_name �迭
 */
export const getCourseNames = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("courses") // Supabase �����ͺ��̽��� "courses" ���̺�
    .select("course_name"); // ������ �÷� ����

  if (error) {
    console.error("Error fetching course names:", error.message);
    return [];
  }

  // course_name�� �����Ͽ� �迭�� ��ȯ
  return data.map((course) => course.course_name);
};

/**
 * �����ͺ��̽����� ��� course_name�� color ��������
 * @returns course_name�� color�� ������ �迭
 */
export const getCoursesWithColors = async (): Promise<{ course_name: string; color: string }[]> => {
  const { data, error } = await supabase
    .from("courses") // Supabase �����ͺ��̽��� "courses" ���̺�
    .select("course_name, color"); // ������ �÷� ����

  if (error) {
    console.error("Error fetching courses with colors:", error.message);
    return [];
  }

  // course_name�� color �����Ͽ� �迭�� ��ȯ
  return data.map((course) => ({
    course_name: course.course_name,
    color: course.color || "#1677ff", // �⺻ ������ ����
  }));
};

/**
 * �����ͺ��̽����� ��� course_description ��������
 * @returns course_description �迭
 */
export const getCourseDescriptions = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("courses") // Supabase �����ͺ��̽��� "courses" ���̺�
    .select("course_description"); // ������ �÷� ����

  if (error) {
    console.error("Error fetching course descriptions:", error.message);
    return [];
  }

  // course_description�� �����Ͽ� �迭�� ��ȯ
  return data.map((course) => course.course_description);
};





