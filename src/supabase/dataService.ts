import { supabase } from "./supabaseClient";

export const getUserName = async (userId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching user name:", error.message);
    return null;
  }
  console.log("object", data);

  return data?.user_name || null;
};

export const getCourseNames = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("courses")
    .select("course_name");

  if (error) {
    console.error("Error fetching course names:", error.message);
    return [];
  }


  return data.map((course) => course.course_name);
};

export const getCourseColors = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("courses")
    .select("color");

  if (error) {
    console.error("Error fetching course colors:", error.message);
    return [];
  }


  return data.map((course) => course.color || "#1677ff");
};


export const getCourseDescriptions = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("courses") 
    .select("course_description"); 

  if (error) {
    console.error("Error fetching course descriptions:", error.message);
    return [];
  }


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
