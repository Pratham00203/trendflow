/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import DropdownImg from "../assets/images/dropdown.png";

/* eslint-disable react/prop-types */
const topics = [
  "Agriculture",
  "Food",
  "Environment",
  "Finance",
  "Technology",
  "Electronics",
  "Gadgets",
  "Education",
  "Gender",
  "Health",
  "Cars",
  "Bikes",
  "Review",
  "Poverty",
  "Politics",
  "How to",
  "Beginner's Guide",
  "Interviews",
  "Personal",
  "Entertainment",
  "Movies",
  "Music",
  "Productivity",
  "Travel",
  "World",
  "History",
  "Fitness",
  "Social",
  "Social Media",
  "DIY",
  "Celebrities",
  "Love",
  "Relationship",
  "Lifestyle",
  "Life",
  "Mental Health",
  "Nature",
  "Business",
  "Sports",
  "Dance",
  "Other",
];

export default function SelectionBox({ value, setValue }) {
  const [showOptions, setShowOptions] = useState(false);

  const addValue = (e) => {
    let option = e.target.innerText;
    if (!value.includes(option)) {
      setValue((prev) => {
        return [...prev, option];
      });
    }
  };

  const removeValue = (option) => {
    const newvalue = value.filter((i) => i !== option);
    setValue(newvalue);
  };

  return (
    <div
      className='interests-field'
      style={{
        position: "relative",
      }}>
      <div className='interests-box'>
        {value.length === 0 ? (
          <p>Empty</p>
        ) : (
          value.map((v, index) => {
            return (
              <div
                className='interest d-flex align-center'
                style={{ justifyContent: "space-between" }}
                key={index}>
                {v} <span onClick={() => removeValue(v)}>X</span>
              </div>
            );
          })
        )}

        <img src={DropdownImg} onClick={() => setShowOptions(!showOptions)} />
      </div>
      <div
        className='interests-options flex-col'
        style={{ display: showOptions ? "flex" : "none" }}>
        {topics.map((t, i) => {
          return (
            <div className='interest' key={i} onClick={addValue}>
              {t}
            </div>
          );
        })}
      </div>
    </div>
  );
}
