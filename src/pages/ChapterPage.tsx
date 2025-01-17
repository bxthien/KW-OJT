import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Drawer,
  Form,
  Input,
  Pagination,
  message,
  Popconfirm,
} from "antd";
import { EditOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { supabase } from "../supabase/supabaseClient";

interface Lectute {
  lecture_id: string;
  lecture_name: string;
}

interface Chapter {
  chapter_id: string;
  chapter_name: string;
  quiz_cnt: number;
  date_of_update: string;
  lecture: Lectute[];
}

const ChapterPage: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lectures, setLectures] = useState<Lectute[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;
  const [form] = Form.useForm();

  // ✅ Supabase에서 Chapter 데이터 조회
  const fetchChapters = async () => {
    try {
      const { data, error } = await supabase
        .from("chapter")
        .select(
          `
        chapter_id,
        chapter_name,
        quiz_cnt,
        date_of_update,
        lecture (
          lecture_id,
          lecture_name
        )
        `
        )
        .ilike("chapter_name", `%${searchTerm}%`)
        .order("date_of_update", { ascending: false });

      if (error) {
        console.error("Error fetching chapters:", error);
        message.error("Failed to fetch chapters.");
        return;
      }

      setChapters(data);
    } catch (err) {
      console.error("Error:", err);
      message.error("An unexpected error occurred.");
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [searchTerm]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const currentDate = new Date().toISOString(); // 현재 날짜 및 시간 설정

      if (isAdding) {
        // 새로운 Chapter 추가
        const { error } = await supabase.from("chapter").insert([
          {
            chapter_name: values.name,
            quiz_cnt: values.quiz,
            date_of_update: currentDate,
          },
        ]);

        if (error) {
          console.error("Error adding chapter:", error);
          message.error("Failed to add chapter.");
          return;
        }

        message.success("Chapter added successfully!");
      } else if (selectedChapter) {
        // 기존 Chapter 수정
        const { error } = await supabase
          .from("chapter")
          .update({
            chapter_name: values.name,
            quiz_cnt: values.quiz,
            date_of_update: currentDate, // 수정 시 날짜 업데이트
          })
          .eq("chapter_id", selectedChapter.chapter_id);

        if (error) {
          console.error("Error updating chapter:", error);
          message.error("Failed to update chapter.");
          return;
        }

        message.success("Chapter updated successfully!");
      }

      fetchChapters();
      setIsDrawerOpen(false);
      form.resetFields();
    } catch (err) {
      // ✅ TypeScript에서 오류를 명확하게 처리
      if (err instanceof Error) {
        console.error("Unexpected error:", err.message);
        message.error(`An error occurred: ${err.message}`);
      } else {
        console.error("Unexpected error:", err);
        message.error("An unexpected error occurred.");
      }
    }
  };

  // ✅ Chapter 삭제
  const handleDelete = async () => {
    if (!selectedChapter) return;

    try {
      const { error } = await supabase
        .from("chapter")
        .delete()
        .eq("chapter_id", selectedChapter.chapter_id);

      if (error) {
        console.error("Error deleting chapter:", error);
        message.error("Failed to delete chapter.");
        return;
      }

      message.success("Chapter deleted successfully!");
      fetchChapters();
      setIsDrawerOpen(false);
    } catch (err) {
      // ✅ TypeScript에서 오류를 명확하게 처리
      if (err instanceof Error) {
        console.error("Unexpected error:", err.message);
        message.error(`An error occurred: ${err.message}`);
      } else {
        console.error("Unexpected error:", err);
        message.error("An unexpected error occurred.");
      }
    }
  };

  // 페이지네이션 변경 핸들러
  const handlePaginationChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="py-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Input
            className="py-2 w-[300px]"
            placeholder="Search by chapter name"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div>
          <h1 className="text-2xl text-black font-bold"></h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsAdding(true);
              setSelectedChapter(null);
              form.resetFields();
              setIsDrawerOpen(true);
            }}
          >
            Add Chapter
          </Button>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Table
          columns={[
            { title: "ID", dataIndex: "chapter_id", key: "id" },
            { title: "Chapter Name", dataIndex: "chapter_name", key: "name" },
            { title: "Quiz Count", dataIndex: "quiz_cnt", key: "quiz" },
            { title: "Last Updated", dataIndex: "date_of_update", key: "date" },
            {
              title: "Action",
              key: "action",
              render: (_: unknown, record: Chapter) => (
                <Button
                  type="link"
                  onClick={() => {
                    setIsAdding(false);
                    setSelectedChapter(record);
                    setLectures(record.lecture);
                    form.setFieldsValue({
                      name: record.chapter_name,
                      quiz: record.quiz_cnt,
                    });
                    setIsDrawerOpen(true);
                  }}
                  icon={<EditOutlined />}
                  style={{ fontSize: "18px" }}
                />
              ),
            },
          ]}
          dataSource={chapters.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          pagination={false}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "16px",
          }}
        >
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={chapters.length}
            onChange={handlePaginationChange}
          />
        </div>
      </div>

      <Drawer
        title={
          isAdding ? "Add Chapter" : `Edit ${selectedChapter?.chapter_name}`
        }
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={400}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Chapter Name"
            name="name"
            rules={[
              { required: true, message: "Please enter the chapter name" },
            ]}
          >
            <Input placeholder="Enter chapter name" />
          </Form.Item>
          <Form.Item
            label="Quiz Count"
            name="quiz"
            rules={[{ required: true, message: "Please enter the quiz count" }]}
          >
            <Input type="number" placeholder="Enter quiz count" />
          </Form.Item>
          <div className="flex flex-col">
            <div>Lectures:</div>
            <div className="flex gap-2 py-2">
              {lectures.map((lecture) => (
                <div
                  className="bg-slate-300 rounded-md p-2"
                  key={lecture.lecture_id}
                >
                  {lecture.lecture_name}
                </div>
              ))}
            </div>
          </div>
        </Form>

        <div className="flex justify-end mt-4 gap-2">
          {!isAdding && (
            <Popconfirm
              title="Are you sure to delete this chapter?"
              onConfirm={handleDelete}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" disabled danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          )}
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default ChapterPage;
