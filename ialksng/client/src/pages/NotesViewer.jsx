import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useParams } from "react-router-dom";
import NotionRenderer from "../components/NotionRenderer";

function NotesViewer() {
  const { id } = useParams();
  const [content, setContent] = useState([]);

  // Moved fetchNotes ABOVE useEffect so it's initialized before being called
  const fetchNotes = async () => {
    try {
      const res = await axios.get(`/notes/${id}`);
      setContent(res.data.content);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotes();
    // Added id as a dependency so it refetches if the id changes
  }, [id]);

  return (
    <div className="notes-container">
      <NotionRenderer content={content} />
    </div>
  );
}

export default NotesViewer;