import { supabase } from "./supabaseClient";

export const registerUser = async (
  email: string,
  password: string,
  additionalData?: { username: string }
) => {
  // 사용자 등록
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

  // 추가 데이터가 있으면 데이터베이스에 저장
  if (additionalData) {
    const { error: dbError } = await supabase.from("users").insert({
      user_id: data.user.id, // Supabase auth에서 제공하는 사용자 ID
      email: data.user.email,
      user_name: additionalData.username, // 추가 데이터 저장
      created_at: new Date(), // 생성일
      is_admin: false,
    });

    if (dbError) {
      throw new Error(`Failed to save additional data: ${dbError.message}`);
    }
  }

  return data.user;
};

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

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(`Logout failed: ${error.message}`);
  }

  return true;
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching current user:", error.message);
    return null;
  }

  return data.user;
};
