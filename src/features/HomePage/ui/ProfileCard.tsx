import React from "react";

interface ProfileCardProps {
  username: string | null; // 유저 이름을 전달받기 위한 prop
}

const ProfileCard: React.FC<ProfileCardProps> = ({ username }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6 max-w-sm">
      {/* 배경 이미지 */}
      <div
        className="h-40 bg-cover bg-center rounded-t-lg"
        style={{
          backgroundImage:
            'url("https://cdn.pixabay.com/photo/2016/05/09/22/02/dachshund-1382631_960_720.jpg")',
        }}
      ></div>

      {/* 프로필 이미지 */}
      <div className="relative -mt-16 flex justify-center">
        <img
          src="https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000"
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-white"
        />
      </div>

      {/* 프로필 정보 */}
      <h2 className="text-2xl font-bold mb-2 text-center text-black">
        {username || "Username"} {/* 전달된 유저 이름 표시, 없으면 기본값 */}
      </h2>
      <div className="bg-gray-100 p-5 rounded-lg shadow-inner mt-4 text-center">
        <p className="text-gray-600 mb-2">KNU Course Manager</p>
        <p className="text-gray-600">
          Nice to meet you everyone! Let's have exciting time with us.
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;
