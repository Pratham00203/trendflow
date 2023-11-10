/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import Article from "./Article";

export default function NewsSection({ articles }) {
  return (
    <div className='posts-section d-flex flex-col' style={{ gap: "35px" }}>
      {articles.map((a, index) => {
        return <Article key={index} data={a} />;
      })}
    </div>
  );
}
