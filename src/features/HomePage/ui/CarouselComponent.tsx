import React from "react";
import { Carousel } from "antd";

interface CarouselItem {
  key: number;
  imageUrl: string;
  text: string;
  textColor?: string; // 텍스트 색상 속성 추가
}

interface CarouselComponentProps {
  items: CarouselItem[];
}

const CarouselComponent: React.FC<CarouselComponentProps> = ({ items }) => {
  return (
    <Carousel autoplay>
      {items.map((item) => (
        <div
          key={item.key}
          className="relative h-[350px] rounded-lg overflow-hidden shadow-lg"
        >
          {/* 이미지 */}
          <img
            src={item.imageUrl}
            alt={`Slide ${item.key}`}
            className="w-full h-full object-cover"
          />
          {/* 텍스트 오버레이 */}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <h3
              className={`${item.textColor || "text-white"} text-2xl font-bold`}
            >
              {item.text}
            </h3>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselComponent;
