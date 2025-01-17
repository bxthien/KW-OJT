import React, { useState, useEffect } from "react";

type CounterProps = {
  start?: number; // Giá trị bắt đầu
  end: number; // Giá trị kết thúc
  duration?: number; // Thời gian hiệu ứng (ms)
};

const IncrementalCounter: React.FC<CounterProps> = ({
  start = 0,
  end,
  duration = 1000,
}) => {
  const [value, setValue] = useState<number>(start);

  useEffect(() => {
    // Tính toán khoảng cách giữa các bước tăng
    const stepTime = duration / Math.abs(end - start); // Thời gian mỗi bước
    const step = start < end ? 1 : -1; // Xác định hướng tăng hoặc giảm

    const interval = setInterval(() => {
      setValue((prev) => {
        if ((step > 0 && prev >= end) || (step < 0 && prev <= end)) {
          clearInterval(interval); // Dừng khi đạt giá trị cuối
          return end;
        }
        return prev + step; // Tăng dần giá trị
      });
    }, stepTime);

    return () => clearInterval(interval); // Dọn dẹp interval
  }, [start, end, duration]);

  return <div>{value}</div>;
};

export default IncrementalCounter;
