import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "../../../../../core/utils/axios";
import Loader from "../../../../../core/components/Loader";
import "./Search.css";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [results, setResults] = useState({ blogs: [], products: [], projects: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      setLoading(true);
      setError("");
      
      try {
        const res = await axios.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch search results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const hasResults = 
    results.blogs.length > 0 || 
    results.products.length > 0 || 
    results.projects.length > 0;

  return (
    <div className="search-page__container container">
      <h1 className="search-page__title">
        Search Results for <span>"{query}"</span>
      </h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="search-page__error">{error}</p>
      ) : !hasResults && query ? (
        <div className="search-page__empty">
          <p>No results found. Try adjusting your keywords.</p>
        </div>
      ) : (
        <div className="search-page__results">
          
          {results.blogs.length > 0 && (
            <section className="search-page__section">
              <h2>Blog Posts</h2>
              <div className="search-page__grid">
                {results.blogs.map(blog => (
                  <Link to={`/blog/${blog._id}`} key={blog._id} className="search-card">
                    <div className="search-card__content">
                      <h3>{blog.title}</h3>
                      <span className="search-card__type">Blog</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.products.length > 0 && (
            <section className="search-page__section">
              <h2>Store Products</h2>
              <div className="search-page__grid">
                {results.products.map(product => (
                  <Link to={`/access/${product._id}`} key={product._id} className="search-card">
                    <div className="search-card__content">
                      <h3>{product.title}</h3>
                      <span className="search-card__type store-type">Store</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.projects.length > 0 && (
            <section className="search-page__section">
              <h2>Projects</h2>
              <div className="search-page__grid">
                {results.projects.map(project => (
                  <Link to={`/work`} key={project._id} className="search-card">
                    <div className="search-card__content">
                      <h3>{project.title}</h3>
                      <span className="search-card__type project-type">Project</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  );
};

export default Search;