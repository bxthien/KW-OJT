import { useEffect, useState } from "react";
import { Input, Modal, notification, Table } from "antd";
import { supabase } from "../supabase/supabaseClient";
import MarkdownEditor from "@uiw/react-markdown-editor";

interface Chapter {
  chapter_id: string;
  chapter_name: string;
}

interface Lectute {
  lecture_id: string;
  lecture_name: string;
  lecture_document: string;
  chapter: Chapter;
}

const LecturePage = () => {
  const [lectures, setLectures] = useState<Lectute[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<Lectute | null>(null);
  const [updatedLectureName, setUpdatedLectureName] = useState("");
  const [markdown, setMarkdown] = useState("");

  const fetchLectures = async () => {
    const { data, error } = await supabase.from("lecture").select(`
      *,
      chapter:chapter_id (chapter_name, chapter_id) 
    `);

    if (data) {
      setLectures(data);
    }

    if (error) {
      console.error("Error fetching lectures:", error);
    }
  };
  useEffect(() => {
    fetchLectures();
  }, []);

  const columns = [
    {
      title: "Lecture ID",
      dataIndex: "lecture_id",
      key: "lecture_id",
    },
    {
      title: "Lecture Name",
      dataIndex: "lecture_name",
      key: "lecture_name",
    },
    {
      title: "Chapter Name",
      dataIndex: "chapter",
      key: "chapter",
      render: (_: string, record: Lectute) => (
        <>{record.chapter.chapter_name}</>
      ),
    },
  ];

  const handleRowClick = (record: Lectute) => {
    setSelectedLecture(record);
    setUpdatedLectureName(record.lecture_name);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (selectedLecture) {
      const { error } = await supabase
        .from("lecture")
        .update({
          lecture_name: updatedLectureName,
          lecture_document: markdown,
        })
        .eq("lecture_id", selectedLecture.lecture_id);

      fetchLectures();
      notification.success({ message: "Lectures fetched successfully!" });

      if (error) {
        console.error("Error updating lecture:", error);
      }

      setIsModalVisible(false);
      setSelectedLecture(null);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedLecture(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-5 rounded-xl shadow-md">
        <Table
          dataSource={lectures}
          columns={columns}
          rowKey="lecture_id"
          onRow={(record) => ({
            onClick: () => {
              handleRowClick(record);
              setMarkdown(record.lecture_document);
            },
          })}
        />
      </div>

      <Modal
        title={<div className="text-lg">Update Lecture Name</div>}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
      >
        <div className="flex gap-3 flex-col">
          <div className="flex items-center gap-2">
            <div>Lecture Name:</div>
            <Input
              className="py-2 max-w-[300px]"
              maxLength={50}
              value={updatedLectureName}
              onChange={(e) => setUpdatedLectureName(e.target.value)}
            />
          </div>
          <MarkdownEditor
            value={markdown}
            height="500px"
            className="bg-white border-2 border-gray-200 shadow-md"
            onChange={(value) => setMarkdown(value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default LecturePage;
