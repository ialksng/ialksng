import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../../../../../core/utils/axios";
import Loader from "../../../../../core/components/Loader";
import "./Search.css";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [results, setResults] = useState({ 
    blogs: [], products: [], projects: [], 
    games: [], streams: [], recommendations: [], lifePosts: [] 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      setLoading(true);
      
      try {
        const res = await axios.get(`/search?q=${encodeURIComponent(query)}`);
        setResults({
          blogs: res.data.blogs || [],
          products: res.data.products || [],
          projects: res.data.projects || [],
          games: res.data.games || [],
          streams: res.data.streams || [],
          recommendations: res.data.recommendations || [],
          lifePosts: res.data.lifePosts || []
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch search results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const hasResults = 
    results.blogs.length > 0 || 
    results.products.length > 0 || 
    results.projects.length > 0 ||
    results.games.length > 0 ||
    results.streams.length > 0 ||
    results.recommendations.length > 0 ||
    results.lifePosts.length > 0;

  return (
    <div className="search-page__container container">
      <h1 className="search-page__title">
        Search Results for <span>"{query}"</span>
      </h1>

      {loading ? (
        <Loader />
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

          {results.games.length > 0 && (
            <section className="search-page__section">
              <h2>GameZone</h2>
              <div className="search-page__grid">
                {results.games.map(game => (
                  <Link to={`/more/gamezone/${game._id}`} key={game._id} className="search-card">
                    <div className="search-card__content">
                      <h3>{game.name}</h3>
                      <span className="search-card__type game-type">Game</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.streams.length > 0 && (
            <section className="search-page__section">
              <h2>Live Streams</h2>
              <div className="search-page__grid">
                {results.streams.map(stream => (
                  <Link to={`/more/live`} key={stream._id} className="search-card">
                    <div className="search-card__content">
                      <h3>{stream.title}</h3>
                      <span className="search-card__type stream-type">Stream</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.recommendations.length > 0 && (
            <section className="search-page__section">
              <h2>Gear & Recommendations</h2>
              <div className="search-page__grid">
                {results.recommendations.map(rec => (
                  <Link to={`/more/products`} key={rec._id} className="search-card">
                    <div className="search-card__content">
                      <h3>{rec.name}</h3>
                      <span className="search-card__type gear-type">Gear</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.lifePosts.length > 0 && (
            <section className="search-page__section">
              <h2>Life Updates</h2>
              <div className="search-page__grid">
                {results.lifePosts.map(post => (
                  <Link to={`/more/life`} key={post._id} className="search-card">
                    <div className="search-card__content">
                      <h3>{post.title}</h3>
                      <span className="search-card__type life-type">Life</span>
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