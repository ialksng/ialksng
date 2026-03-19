import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useParams } from "react-router-dom";
import NotionRenderer from "../components/NotionRenderer";

function NotesViewer() {
  const { id } = useParams();
  const [content, setContent] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`/notes/${id}`);
      setContent(res.data.content);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="notes-container">
      <NotionRenderer content={content} />
    </div>
  );
}

export default NotesViewer;