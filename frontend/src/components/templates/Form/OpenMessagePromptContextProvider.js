import React, { useState } from 'react';

export const OpenMessagePromptContext = React.createContext();

export const OpenMessagePromptContextProvider = ({ children }) => {
  const [onMessagePromptClick, setOnMessagePromptClick] = useState(
    () => () => null
  );

  return (
    <OpenMessagePromptContext.Provider
      value={{
        onClick: onMessagePromptClick,
        setOnClick: setOnMessagePromptClick,
      }}
    >
      {children}
    </OpenMessagePromptContext.Provider>
  );
};

export default OpenMessagePromptContextProvider;
