import { supabase } from "./supabaseClient";

/**
 * ����� ȸ������ �Լ�
 * @param email ����� �̸���
 * @param password ����� ��й�ȣ
 * @returns ��ϵ� ����� ����
 */
export const registerUser = async (email: string, password: string, additionalData?: { username: string }) => {
  // ����� ���
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(`Registration failed: ${error.message}`);
  }

  if (!data?.user) {
    throw new Error("Registration failed: User object is null.");
  }

  // �߰� �����Ͱ� ������ �����ͺ��̽��� ����
  if (additionalData) {
    const { error: dbError } = await supabase.from("users").insert({
      user_id: data.user.id, // Supabase auth���� �����ϴ� ����� ID
      email: data.user.email,
      user_name: additionalData.username, // �߰� ������ ����
      created_at: new Date(), // ������
      is_admin: false,
    });

    if (dbError) {
      throw new Error(`Failed to save additional data: ${dbError.message}`);
    }
  }

  return data.user;
};


/**
 * ����� �α��� �Լ�
 * @param email ����� �̸���
 * @param password ����� ��й�ȣ
 * @returns �α��ε� ����� ���� �� ����
 */
export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("Login Debug:", { email, error, data });

  if (error) {
    throw new Error(`Login failed: ${error.message}`);
  }

  if (!data?.user) {
    throw new Error("Login failed: User object is null.");
  }

  return { user: data.user, session: data.session };
};


/**
 * ����� �α׾ƿ� �Լ�
 */
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(`Logout failed: ${error.message}`);
  }

  return true;
};

/**
 * ���� �α��ε� ����� ���� ��������
 * @returns ���� ����� ���� �Ǵ� null
 */
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching current user:", error.message);
    return null;
  }

  return data.user;
};
