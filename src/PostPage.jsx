import { useParams, Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import DataContext from "./context/DataContext";
import api from "./api/posts";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../data/firebaseConfig"; // Antag att du har konfigurerat detta

const PostPage = () => {
  const { posts, setPosts } = useContext(DataContext);
  const { id } = useParams();
  const post = posts.find((post) => post.id.toString() === id);
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
      // Skapa en referens till det specifika dokumentet i Firestore
      const postRef = doc(db, "posts", id);
      // Använd deleteDoc för att ta bort dokumentet
      await deleteDoc(postRef);
      const postsList = posts.filter((post) => post.id !== id);
      localStorage.setItem("blogposts", JSON.stringify(postsList));
      setPosts(postsList);
      navigate("/");
    } catch (err) {
      console.log(`Error ${err.message}`);
    }
  };

  return (
    <main className="PostPage">
      <article className="post">
        {post && (
          <>
            <h2>{post.title}</h2>
            <p className="postDate">{post.datetime}</p>
            <p className="postBody">{post.body}</p>
            <Link to={`/edit/${post.id}`}>
              <button className="editButton">Edit Post</button>
            </Link>
            <button
              className="deleteButton"
              onClick={() => handleDelete(post.id)}
            >
              Delete Post
            </button>
          </>
        )}
        {!post && (
          <>
            <h2>Post not found</h2>
            <p>Well, that's disappointing</p>
            <p>
              <Link to="/">Visit Our HomePage</Link>
            </p>
          </>
        )}
      </article>
    </main>
  );
};

export default PostPage;