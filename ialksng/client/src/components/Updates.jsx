import "../styles/updates.css"

function Updates() {
  const posts = [
    {
      type: "text",
      content: "🚀 Just launched my portfolio website!",
      time: "2 days ago"
    },
    {
      type: "image",
      content: "🔥 Working on a new UI design",
      image: "https://via.placeholder.com/500x250",
      time: "5 days ago"
    }
  ]

  return (
    <section className="updates-page">

      <h2 className="updates-title">Updates</h2>

      <div className="updates-card">

        {posts.map((post, index) => (
          <div className="post" key={index}>

            {/* HEADER */}
            <div className="post-header">
              <div>
                <span className="name">Alok Singh</span>
                <p className="role">Full Stack Developer</p>
              </div>
              <span className="time">{post.time}</span>
            </div>

            {/* CONTENT */}
            <p className="post-text">{post.content}</p>

            {/* IMAGE */}
            {post.type === "image" && (
              <img src={post.image} alt="post" />
            )}

            {/* VIDEO */}
            {post.type === "video" && (
              <iframe src={post.video} allowFullScreen></iframe>
            )}

            {/* ACTIONS */}
            <div className="post-actions">
              <span>❤️ Like</span>
              <span>💬 Comment</span>
              <span>🔗 Share</span>
            </div>

          </div>
        ))}

      </div>

    </section>
  )
}

export default Updates