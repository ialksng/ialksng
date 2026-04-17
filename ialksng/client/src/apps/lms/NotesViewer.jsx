import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axios from "../../core/utils/axios";
import NotionRenderer from "./NotionRenderer";
import Loader from "../../core/components/Loader";

function NotesViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Fetching notes for ID: ${id}`);
        const res = await axios.get(`/notes/${id}`);
        
        console.log("Full backend response:", res.data);

        let fetchedContent = [];
        if (Array.isArray(res.data)) {
          fetchedContent = res.data;
        } else if (res.data && Array.isArray(res.data.content)) {
          fetchedContent = res.data.content; 
        } else if (res.data && Array.isArray(res.data.data)) {
          fetchedContent = res.data.data;
        } else if (res.data && Array.isArray(res.data.blocks)) {
          fetchedContent = res.data.blocks;
        }

        setContent(fetchedContent);
        
      } catch (err) {
        console.error("Notes fetch error:", err);
        setError("Failed to load notes. Please check the backend connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [id]);

  if (loading) return <Loader />;
  
  if (error) return (
    <div style={{ color: "red", padding: "50px", textAlign: "center" }}>
      <p>{error}</p>
      <button onClick={() => navigate(-1)} style={{ padding: "8px 16px", marginTop: "10px", cursor: "pointer" }}>Go Back</button>
    </div>
  );

  return (
    <div className="notes-container" style={{ minHeight: "100vh", padding: "20px" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px", padding: "8px 16px", cursor: "pointer" }}>⬅ Back</button>
      <NotionRenderer content={content} />
    </div>
  );
}

export default NotesViewer;