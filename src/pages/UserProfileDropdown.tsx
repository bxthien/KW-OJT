import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../supabase/authService";
import { getCurrentUser } from "../supabase/authService";
import { getUserName } from "../supabase/dataService";
import { supabase } from "../supabase/supabaseClient";
// import ProfileCard from "../features/HomePage/ui/ProfileCard";

const UserProfileDropdown: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState<string | null>("Username"); // Default value
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);


  // Fetch the current user's username
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          const fetchedUsername = await getUserName(currentUser.id);
          setUsername(fetchedUsername || "Username");
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    const fetchProfileImageFromDatabase = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          console.error("No user is logged in.");
          return;
        }
  
        // users 테이블에서 profile_image 가져오기
        const { data, error } = await supabase
          .from("users")
          .select("profile_image")
          .eq("user_id", currentUser.id)
          .single();
  
        if (error) {
          console.error("Error fetching profile image from database:", error.message);
          return;
        }
  
        if (data?.profile_image) {
          const { data: publicUrlData } = supabase.storage
            .from("profile_img")
            .getPublicUrl(data.profile_image);
  
          if (publicUrlData?.publicUrl) {
            setProfileImageUrl(publicUrlData.publicUrl); // 프로필 이미지 URL 설정
          } else {
            console.error("Error generating public URL for profile image.");
          }
        }
      } catch (error) {
        console.error("Unexpected error fetching profile image:", error);
      }
    };
  
    fetchProfileImageFromDatabase();
  }, []);
  
  
  

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const goToProfilePage = () => {
    navigate("/profile");
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Image and Username */}
      <div
        className="flex items-center cursor-pointer"
        onClick={toggleDropdown}
      >
        <img
  src={profileImageUrl || "https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000"}
  alt="Profile"
  className="w-10 h-10 rounded-full mr-2"
/>

        <span className="font-medium text-black">{username}</span>
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg z-10 p-2 border border-gray-200">
          <ul className="space-y-2">
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-lg"
              onClick={goToProfilePage}
            >
              Profile
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-lg"
              onClick={handleLogout}
            >
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
