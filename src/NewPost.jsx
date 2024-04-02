import { useContext, useState } from "react";
import DataContext from "./context/DataContext";
import api from "./api/posts";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { db } from "../data/firebaseConfig"; // Antag att du har konfigurerat detta
import { collection, addDoc } from "firebase/firestore";

const NewPost = () => {
  const { posts, setPosts } = useContext(DataContext);

  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const setId = posts.length ? Number(posts[posts.length - 1].id) + 1 : 1;
    const id = setId.toString();
    const datetime = format(new Date(), "MMMM dd, yyyy - HH:mm");
    const newPost = { id, title: postTitle, datetime, body: postBody };
    try {
      // const response = await api.post("./posts", newPost);
      // Referens till 'posts' samlingen
      const postsCollectionRef = collection(db, "posts");
      // Lägg till det nya inlägget i Firestore
      const docRef = await addDoc(postsCollectionRef, newPost);

      // Firestore genererar ett unikt ID för varje nytt dokument, så vi kan
      // inkludera detta ID i vår lokala tillståndshantering om vi vill
      const addedPost = { ...newPost, id: docRef.id };
      const allPosts = [...posts, addedPost];

      //localStorage.setItem("blogposts", JSON.stringify(allPosts));
      setPosts(allPosts);
      setPostTitle("");
      setPostBody("");
      navigate("/");
    } catch (err) {
      console.log(`Error ${err.message}`);
    }
  };

  return (
    <main className="NewPost">
      <h2>NewPost</h2>
      <form className="newPostForm" onSubmit={handleSubmit}>
        <label htmlFor="postTitle">Title:</label>
        <input
          type="text"
          id="postTitle"
          required
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
        />
        <label htmlFor="postBody">Post:</label>
        <textarea
          type="text"
          id="postBody"
          required
          value={postBody}
          onChange={(e) => setPostBody(e.target.value)}
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </main>
  );
};

export default NewPost;
