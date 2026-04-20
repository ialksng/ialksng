import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "../../../core/utils/axios";
import Loader from "../../../core/components/Loader";
import { FaPlus, FaTrash, FaBoxOpen, FaEdit } from "react-icons/fa";
import "./AdminProducts.css";

const isValidMongoId = (id) => typeof id === "string" && id.length === 24;

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "notes",
    image: "",
    fileUrl: "",
    notionUrl: ""
  });

  const fetchProducts = async () => {
    setFetching(true);
    try {
      const res = await axios.get("/products");

      const cleanProducts = (res.data.products || res.data || []).filter(p => {
        if (!isValidMongoId(p._id)) {
          console.warn("Invalid product ID removed:", p._id);
          return false;
        }
        return true;
      });

      setProducts(cleanProducts);
    } catch (err) {
      console.error("Fetch products error:", err);
      toast.error("Failed to load existing products.");
      setProducts([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      title: product.title || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "notes",
      image: product.image || "",
      fileUrl: product.fileUrl || "",
      notionUrl: product.notionUrl || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      price: "",
      category: "notes",
      image: "",
      fileUrl: "",
      notionUrl: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || form.price === "" || !form.image || !form.category) {
      return toast.error("Please fill all required fields.");
    }

    if (form.category === "notes" && !form.notionUrl) {
      return toast.error("Please add a Notion URL for notes.");
    }

    setLoading(true);
    const toastId = toast.loading(editingId ? "Updating..." : "Adding...");

    try {
      const payload = {
        ...form,
        price: Number(form.price)
      };

      if (editingId) {
        await axios.put(`/products/${editingId}`, payload);
        toast.success("Updated ✅", { id: toastId });
      } else {
        await axios.post("/products", payload);
        toast.success("Added ✅", { id: toastId });
      }

      cancelEdit();
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Operation failed ❌", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    const toastId = toast.loading("Deleting...");
    try {
      await axios.delete(`/products/${id}`);
      toast.success("Deleted ✅", { id: toastId });
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed ❌", { id: toastId });
    }
  };

  if (fetching) {
    return (
      <div className="ap-loader-wrapper">
        <Loader />
      </div>
    );
  }

  return (
    <div className="ap-container animated-fade-in">
      <div className="ap-header">
        <h1>Manage Store Products</h1>
      </div>

      <div className="ap-form-card">
        <h2>
          {editingId ? <FaEdit /> : <FaPlus />}
          {editingId ? " Edit Product" : " Add Product"}
        </h2>

        <form onSubmit={handleSubmit}>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" />
          <input name="price" value={form.price} onChange={handleChange} placeholder="Price" />
          <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" />

          {form.category === "notes" && (
            <input
              name="notionUrl"
              value={form.notionUrl}
              onChange={handleChange}
              placeholder="Notion URL"
            />
          )}

          <button type="submit">
            {loading ? "Saving..." : editingId ? "Update" : "Add"}
          </button>
        </form>
      </div>

      <div className="ap-product-grid">
        {products.map((p) => (
          <div key={p._id} className="ap-product-card">
            <img src={p.image} alt={p.title} />

            <h3>{p.title}</h3>

            <code>ID: {p._id}</code>

            {p.category === "notes" && (
              <a
                href={`https://gurukul.ialksng.me/learn/${p._id}`}
                target="_blank"
                rel="noreferrer"
              >
                Open in Gurukul ↗
              </a>
            )}

            <div>
              {p.price === 0 ? "FREE" : `₹${p.price}`}
            </div>

            <button onClick={() => handleEdit(p)}>Edit</button>
            <button onClick={() => handleDelete(p._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProducts;