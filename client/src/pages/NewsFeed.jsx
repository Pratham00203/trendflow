/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import Aside from "../layout/Aside";
import { useEffect } from "react";
import NewsSection from "../layout/NewsSection";
import axios from "axios";
import NewsSkeleton from "../util/NewsSkeleton";

export default function NewsFeed() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    setArticles([]);
    setIsLoading(true);
    document.title = "What's happening around the world?";
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const category = urlParams.get("category");
    if (category) {
      setSelectedCategory(category);
      window.history.pushState(
        "",
        "",
        `/news?category=${category.toLocaleLowerCase()}`
      );
    } else {
      setSelectedCategory("general");
      window.history.pushState("", "", `/news?category=general`);
    }
    getNews();
  }, [selectedCategory]);

  const handleOptionClick = (e) => {
    setSelectedCategory(e.target.innerText.toLocaleLowerCase());
    window.history.pushState(
      "",
      "",
      `/news?category=${e.target.innerText.toLocaleLowerCase()}`
    );
  };

  const getNews = async () => {
    try {
      const res = await axios({
        method: "get",
        url: `https://newsapi.org/v2/everything?q=${selectedCategory}&language=en&pageSize=80&apiKey=${
          import.meta.env.VITE_NEWS_API_KEY
        }`,
      });

      setArticles(res.data.articles);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className='main-content home'>
        <div className='feed-options d-flex'>
          <div className='news-categories d-flex'>
            <button
              className={`btn ${
                selectedCategory === "general" ? "active" : ""
              }`}
              onClick={handleOptionClick}>
              General
            </button>
            <button
              className={`btn ${
                selectedCategory === "business" ? "active" : ""
              }`}
              onClick={handleOptionClick}>
              Business
            </button>
            <button
              className={`btn ${
                selectedCategory === "entertainment" ? "active" : ""
              }`}
              onClick={handleOptionClick}>
              Entertainment
            </button>

            <button
              className={`btn ${selectedCategory === "health" ? "active" : ""}`}
              onClick={handleOptionClick}>
              Health
            </button>
            <button
              className={`btn ${
                selectedCategory === "science" ? "active" : ""
              }`}
              onClick={handleOptionClick}>
              Science
            </button>
            <button
              className={`btn ${selectedCategory === "sports" ? "active" : ""}`}
              onClick={handleOptionClick}>
              Sports
            </button>
            <button
              className={`btn ${
                selectedCategory === "technology" ? "active" : ""
              }`}
              onClick={handleOptionClick}>
              Technology
            </button>
          </div>
        </div>
        {!loading ? <NewsSection articles={articles} /> : <NewsSkeleton />}
      </div>
      <Aside />
    </>
  );
}
