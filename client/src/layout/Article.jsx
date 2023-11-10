/* eslint-disable no-unused-vars */

import moment from "moment";
import NewsIcon from "../assets/images/world-news.png";

/* eslint-disable react/prop-types */
export default function Article({ data }) {
  return (
    <div className='article'>
      <div
        className='article-source-info d-flex align-center'
        style={{ gap: "10px" }}>
        <img src={NewsIcon} />
        <p>
          <b>{data.author}</b> in {data.source.name}
        </p>
      </div>
      <p className='article-title'>{data.title}</p>
      <div className='article-description'>
        {data.description}{" "}
        <a href={data.url} target='blank'>
          Read full article
        </a>
      </div>
      <div
        className='article-image'
        style={{ backgroundImage: `url(${data.urlToImage})` }}></div>
      <p className='article-time'>
        Published on <b>{moment(data.publishedAt).format("MMMM Do YYYY")}</b>
      </p>
    </div>
  );
}
