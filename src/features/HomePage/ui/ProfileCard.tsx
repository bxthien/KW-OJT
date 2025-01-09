import React from "react";

interface ProfileCardProps {
  username: string | null; // 유저 이름을 전달받기 위한 prop
}

const ProfileCard: React.FC<ProfileCardProps> = ({ username }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-sm w-full">
      {/* 배경 이미지 */}
      <div
        className="h-28 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://cdn.pixabay.com/photo/2016/05/09/22/02/dachshund-1382631_960_720.jpg")',
        }}
      ></div>

      {/* 프로필 이미지 */}
      <div className="relative -mt-12 flex justify-center">
        <img
          src="https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000"
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
        />
      </div>

      {/* 프로필 정보 */}
<<<<<<< HEAD
      <h2 className="text-2xl font-bold mb-2 text-center text-black">
        {username || "Username"} {/* 전달된 유저 이름 표시, 없으면 기본값 */}
      </h2>
      <div className="bg-gray-100 p-5 rounded-lg shadow-inner mt-4 text-center">
        <p className="text-gray-600 mb-2">KNU Course Manager</p>
        <p className="text-gray-600">
          Nice to meet you everyone! Let's have exciting time with us.
        </p>
=======
      <div className="text-center mt-4 px-4 pb-4">
        <h2 className="text-xl font-bold text-black">Username</h2>

        {/* 회색 블록 안에 텍스트 */}
        <div className="bg-gray-100 rounded-lg p-4 mt-3 shadow-inner">
          <p className="text-gray-600 text-sm">KNU Course Manager</p>
          <p className="text-gray-500 text-xs mt-1">
            Nice to meet you! Let's have an exciting time with us.
          </p>
        </div>
>>>>>>> c4f31b7473989e7c9db4986242caf013ab221693
      </div>
    </div>
  );
};

export default ProfileCard;
