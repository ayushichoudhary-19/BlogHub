import React, { useEffect, useState } from "react";
const AboutMe = ({ edit, aboutMe, setAboutMe }) => {
  const [content, setContent] = useState(aboutMe);
  const [isEditing, setIsEditing] = useState(edit);
  const [inputValue, setInputValue] = useState(content);

  useEffect(() => {
    setIsEditing(edit);
  }, [edit]);

  useEffect(() => {
    setContent(inputValue);
    setAboutMe(inputValue);
  }, [inputValue]);

  return (
    <div className="w-full mt-2">
      {isEditing ? (
        <textarea
          value={inputValue}
          className={`bg-transparent resize-none h-full ${
            isEditing ? "border-b border-gray-500" : ""
          } focus:border-b w-full focus:ring-0 focus:outline-none`}
          onChange={(e) => setInputValue(e.target.value)}
        />
      ) : (
        <p>{content}</p>
      )}
    </div>
  );
};

export default AboutMe;
