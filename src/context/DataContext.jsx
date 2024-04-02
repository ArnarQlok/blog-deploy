import { createContext, useEffect, useState } from "react";
import api from "../api/posts";
import { db } from "../../data/firebaseConfig"; // Antag att du har konfigurerat detta
import { collection, getDocs } from "firebase/firestore";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [posts, setPosts] = useState(
    JSON.parse(localStorage.getItem("blogposts")) || []
  );
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // useEffect(() => {
  //   localStorage.setItem("blogposts", JSON.stringify(posts));
  // }, [posts]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // const response = await api.get("/posts");
        const querySnapshot = await getDocs(collection(db, "posts"));
        const postsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsArray);
        //setPosts(response.data);
      } catch (err) {
        console.log(`Error fetching posts: ${err.message}`);
        // if (err.response) {
        //   console.log(err.response.data);
        //   console.log(err.response.status);
        //   console.log(err.respsonse.headers);
        // } else {
        //   console.log(`Error ${err.message}`);
        // }
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const filteredResults = posts.filter(
      (post) =>
        post.body.toLowerCase().includes(search.toLowerCase()) ||
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    setSearchResults(filteredResults.reverse());
  }, [posts, search]);

  return (
    <DataContext.Provider
      value={{
        search,
        setSearch,
        searchResults,
        posts,
        setPosts,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
