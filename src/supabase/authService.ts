import { supabase } from "./supabaseClient";

export const registerUser = async (
  email: string,
  password: string,
  additionalData?: { username: string }
) => {
  // 인증 단계
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(`Authentication registration failed: ${error.message}`);
  }

  if (!data?.user) {
    throw new Error("Authentication registration failed: User object is null.");
  }

  try {
    // 데이터베이스 삽입 단계
    if (additionalData) {
      const { error: dbError } = await supabase.from("users").insert({
        user_id: data.user.id,
        email: data.user.email,
        user_name: additionalData.username,
        created_at: new Date(),
        is_admin: false, // 기본 값
      });

      if (dbError) {
        console.error("Database insertion error in registerUser:", dbError);
        // 경고만 남기고 프로세스 중단하지 않음
      }
    }
  } catch (dbError) {
    console.error("Unexpected error during database update:", dbError);
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
