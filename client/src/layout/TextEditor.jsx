/* eslint-disable react/prop-types */
import { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

export default function TextEditor({ placeholder, value, setValue }) {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const config = useMemo(() => {
    return {
      readonly: false, // all options from https://xdsoft.net/jodit/doc/,
      placeholder: placeholder || "What's on your mind?",
      height: 300,
    };
  }, [placeholder]);

  const handleBlur = (newContent) => {
    setContent(newContent);
    setValue(newContent);
  };

  return (
    <>
      <JoditEditor
        ref={editor}
        value={value ? value : content}
        config={config}
        tabIndex={1} // tabIndex of textarea
        onBlur={(newContent) => handleBlur(newContent)} // preferred to use only this option to update the content for performance reasons
      />
    </>
  );
}
