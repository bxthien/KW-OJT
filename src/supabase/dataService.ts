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
 * �����ͺ��̽����� ��� user_name, email, created_at, is_admin ��������
 * @returns user_name, email, created_at, is_admin �迭
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
    .from("users") // Supabase �����ͺ��̽��� "users" ���̺�
    .select(
      "user_id, user_name, email, created_at, is_admin, contact, date_of_birth, age, status"
    ); // ������ �÷� ����

  if (error) {
    console.error("Error fetching users data:", error.message);
    return [];
  }

  // user_name, email, created_at, is_admin �����͸� �迭�� ��ȯ
  return data.map((user) => ({
    user_id: user.user_id || "Unknown",
    user_name: user.user_name || "Unknown",
    is_admin: user.is_admin || false,
    created_at: user.created_at || "Unknown",
    email: user.email || "Unknown",
    contact: user.contact || "Unknown",
    birth: user.date_of_birth || "Unknown",
    age: user.age || 0, // age�� ������ 0���� �⺻�� ����\
    status: !!user.status,
  }));
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

export const getCourseColors = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("courses") // Supabase �����ͺ��̽��� "courses" ���̺�
    .select("color"); // ������ �÷��� "color"�� ����

  if (error) {
    console.error("Error fetching course colors:", error.message);
    return [];
  }

  // color�� �����Ͽ� �迭�� ��ȯ
  return data.map((course) => course.color || "#1677ff"); // �⺻ ������ ����
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

export const addUserData = async (user: {
  name: string;
  type: string;
  date: string;
  contact: string;
}) => {
  const { error } = await supabase
    .from("users")
    .insert([
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
