import React from "react";
import { Badge, Calendar, Tooltip } from "antd";
import type { BadgeProps } from "antd";
import type { Dayjs } from "dayjs";

// 이벤트 데이터를 날짜별로 정의
const eventData: Record<number, { type: string; title: string }[]> = {
  8: [
    { type: "warning", title: "Project Deadline" },
    { type: "success", title: "Team Meeting" },
  ],
  10: [
    { type: "error", title: "System Maintenance" },
    { type: "success", title: "Client Presentation" },
  ],
  15: [
    { type: "error", title: "Bug Fix Release" },
    { type: "warning", title: "Code Review" },
    { type: "success", title: "Sprint Planning" },
  ],
};

// 날짜별 이벤트 가져오기 함수
const getListData = (value: Dayjs) => {
  return eventData[value.date()] || [];
};

// 날짜 셀 렌더링 함수
const dateCellRender = (value: Dayjs) => {
  const listData = getListData(value);

  if (listData.length === 0) return null;

  return (
    <div className="flex justify-center gap-2">
      {listData.map((item, index) => (
        <Tooltip key={index} title={item.title}>
          <Badge status={item.type as BadgeProps["status"]} />
        </Tooltip>
      ))}
    </div>
  );
};

const CalendarComponent: React.FC = () => {
  return (
    <div className="w-full max-w-[600px] aspect-square bg-white p-4 rounded-lg shadow-lg relative z-0">
      <Calendar
        fullscreen={false}
        headerRender={() => null}
        mode="month"
        cellRender={dateCellRender}
        style={{ zIndex: 1 }} // Calendar의 z-index 낮춤
      />
    </div>
  );
};

export default CalendarComponent;
