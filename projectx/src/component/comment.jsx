import React, { createContext, useContext, useState } from 'react';

const CommentContext = createContext();

export const useCommentContext = () => useContext(CommentContext);

export const CommentProvider = ({ children }) => {
  const [content, setContent] = useState([]);

  return (
    <CommentContext.Provider value={{ content, setContent }}>
      {children}
    </CommentContext.Provider>
  );
};