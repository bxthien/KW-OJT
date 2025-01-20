import { useEffect, useState } from "react";
import { Input, Modal, notification, Table, Button, Select } from "antd";
import { supabase } from "../supabase/supabaseClient";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { PlusOutlined } from "@ant-design/icons";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false); // Add modal ?ÉÅ?Éú
  const [newLectureName, setNewLectureName] = useState("");
  const [newLectureMarkdown, setNewLectureMarkdown] = useState("");
  const [selectedChapter, setSelectedChapter] = useState<string>(""); // Selected chapter
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchLectures = async () => {
    const { data, error } = await supabase
      .from("lecture")
      .select(
        `*,
         chapter:chapter_id (chapter_name, chapter_id)`
      )
      .or(
        `lecture_name.ilike.%${searchTerm}%,lecture_document.ilike.%${searchTerm}%`
      ).order('date_of_update');
  
    if (data) {
      const sortedData = data.sort(
        (a, b) => new Date(b.date_of_update).getTime() - new Date(a.date_of_update).getTime()
      ); // √÷Ω≈ µ•¿Ã≈Õ øÏº± ¡§∑ƒ
      setLectures(sortedData);
    }
  
    if (error) {
      console.error("Error fetching lectures:", error);
    }
  };
  
  

  const fetchChapters = async () => {
    const { data, error } = await supabase.from("chapter").select("*");
    if (data) {
      setChapters(data);
    }
    if (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  useEffect(() => {
    fetchLectures();
    fetchChapters();
  }, [searchTerm]);

  const handleAddLecture = async () => {
    if (
      !newLectureName.trim() ||
      !newLectureMarkdown.trim() ||
      !selectedChapter
    ) {
      notification.error({ message: "All fields are required!" });
      return;
    }

    const { error } = await supabase.from("lecture").insert([
      {
        lecture_name: newLectureName.trim(),
        lecture_document: newLectureMarkdown.trim(),
        chapter_id: selectedChapter, // Save selected chapter ID
        date_of_update: new Date(),
      },
    ]);

    if (!error) {
      notification.success({ message: "Lecture added successfully!" });
      setIsAddModalVisible(false);
      setNewLectureName("");
      setNewLectureMarkdown("");
      setSelectedChapter("");
      await fetchLectures();
      setCurrentPage(1);
    } else {
      console.error("Error adding lecture:", error);
      notification.error({
        message: "Failed to add lecture",
        description: error.message,
      });
    }
  };

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
    {
      title: "Action",
      key: "action",
      render: (_: string, record: Lectute) => (
        <Button
          type="link"
          danger
          onClick={(e) => {
            e.stopPropagation(); // ?ù¥Î≤§Ìä∏ ?†Ñ?åå Ï§ëÎã®
            handleDeleteLecture(record.lecture_id);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleRowClick = (record: Lectute) => {
    setSelectedLecture(record);
    setUpdatedLectureName(record.lecture_name);
    setMarkdown(record.lecture_document || "");
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (selectedLecture) {
      const { error } = await supabase
        .from("lecture")
        .update({
          lecture_name: updatedLectureName.trim(),
          lecture_document: markdown.trim(),
          date_of_update: new Date(),
        })
        .eq("lecture_id", selectedLecture.lecture_id);
  
      if (!error) {
        notification.success({ message: "Lecture updated successfully!" });
        await fetchLectures(); // µ•¿Ã≈Õ ∞ªΩ≈
        setCurrentPage(1); // √π ∆‰¿Ã¡ˆ∑Œ ¿Ãµø
        setSelectedLecture(null);
        setIsModalVisible(false);
      } else {
        console.error("Error updating lecture:", error);
        notification.error({
          message: "Failed to update lecture",
          description: error.message,
        });
      }
    }
  };
  

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedLecture(null);
  };

  const handleDeleteLecture = async (lectureId: string) => {
    const { error } = await supabase
      .from("lecture")
      .delete()
      .eq("lecture_id", lectureId);

    if (!error) {
      notification.success({
        message: "Lecture deleted successfully!",
      });
      fetchLectures(); // Í∞ïÏùò Î™©Î°ù ?ÉàÎ°úÍ≥†Ïπ?
    } else {
      notification.error({
        message: "Failed to delete lecture",
        description: error.message,
      });
      console.error("Error deleting lecture:", error);
    }
  };
  return (
    <div className="py-4 bg-gray-100 min-h-screen">
      <div className="mb-4 flex items-center justify-between">
        <Input
          className="py-2 w-[300px]"
          placeholder="Search by lecture name or document"
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsAddModalVisible(true)}
        >
          Add Lecture
        </Button>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-md">
      <Table
  dataSource={lectures}
  columns={columns}
  rowKey="lecture_id"
  onRow={(record) => ({
    onClick: () => {
      handleRowClick(record);
    },
  })}
  pagination={{
    position: ["bottomCenter"],
    current: currentPage, // Bind to state
    pageSize: 10, // Adjust as needed
    total: lectures.length,
    onChange: (page) => setCurrentPage(page), // Update current page
  }}
/>

      </div>

      <Modal
        title={<div className="text-lg">Update Lecture</div>}
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

      <Modal
        title={<div className="text-lg">Add New Lecture</div>}
        open={isAddModalVisible}
        onOk={handleAddLecture}
        onCancel={() => setIsAddModalVisible(false)}
        width={1000}
      >
        <div className="flex gap-3 flex-col">
          <div className="flex items-center gap-2">
            <div>Lecture Name:</div>
            <Input
              className="py-2 max-w-[300px]"
              maxLength={50}
              value={newLectureName}
              onChange={(e) => setNewLectureName(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <div>Chapter:</div>
            <Select
              className="w-[300px]"
              value={selectedChapter}
              onChange={(value) => setSelectedChapter(value)}
              options={chapters.map((chapter) => ({
                label: chapter.chapter_name,
                value: chapter.chapter_id,
              }))}
            />
          </div>
          <MarkdownEditor
            value={newLectureMarkdown}
            height="500px"
            className="bg-white border-2 border-gray-200 shadow-md"
            onChange={(value) => setNewLectureMarkdown(value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default LecturePage;
