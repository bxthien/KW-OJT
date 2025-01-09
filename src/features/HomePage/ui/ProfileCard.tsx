const ProfileCard = () => {
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
      <div className="text-center mt-4 px-4 pb-4">
        <h2 className="text-xl font-bold text-black">Username</h2>

        {/* 회색 블록 안에 텍스트 */}
        <div className="bg-gray-100 rounded-lg p-4 mt-3 shadow-inner">
          <p className="text-gray-600 text-sm">KNU Course Manager</p>
          <p className="text-gray-500 text-xs mt-1">
            Nice to meet you! Let's have an exciting time with us.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
