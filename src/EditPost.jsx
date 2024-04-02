import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import DataContext from "./context/DataContext";
import api from "./api/posts";
import { format } from "date-fns";
import { db } from "../data/firebaseConfig"; // Antag att du har konfigurerat detta

import { doc, updateDoc } from "firebase/firestore";

const EditPost = () => {
  const { posts, setPosts } = useContext(DataContext);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const { id } = useParams();
  const post = posts.find((post) => post.id === id);

  const navigate = useNavigate();

  useEffect(() => {
    if (post) {
      setEditTitle(post.title);
      setEditBody(post.body);
    }
  }, [post, setEditTitle, setEditBody]);

  const handleEdit = async (id) => {
    const datetime = format(new Date(), "MMMM dd, yyyy - HH:mm");
    const updatePost = { id, title: editTitle, datetime, body: editBody };
    try {
      // Skapa en referens till det specifika dokumentet i Firestore
      const postRef = doc(db, "posts", id);
      // Använd updateDoc för att uppdatera dokumentet
      await updateDoc(postRef, updatePost);
      const updatedPosts = posts.map((post) =>
        post.id === id ? { ...updatePost } : post
      );
      localStorage.setItem("blogposts", JSON.stringify(updatedPosts));
      setPosts(updatedPosts);
      setEditTitle("");
      setEditBody("");
      navigate("/");
    } catch (err) {
      console.log(`Error ${err.message}`);
    }
  };

  return (
    <main className="NewPost">
      {editTitle && (
        <>
          <h2>Edit Post</h2>
          <form className="newPostForm" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="postTitle">Title:</label>
            <input
              type="text"
              id="postTitle"
              required
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <label htmlFor="postBody">Post:</label>
            <textarea
              type="text"
              id="postBody"
              required
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
            ></textarea>
            <button type="submit" onClick={() => handleEdit(post.id)}>
              Submit
            </button>
          </form>
        </>
      )}
      {!editTitle && (
        <>
          <h2>Post Not Found</h2>
          <p>Well, that's dissappointing!</p>
          <p>
            <Link to="/">Visit Our Homepage</Link>
          </p>
        </>
      )}
    </main>
  );
};

export default EditPost;
