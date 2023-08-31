import React, { useState, ReactNode, Dispatch, SetStateAction } from 'react';

type MessagePromptContextType = {
  onClick: () => void;
  setOnClick: Dispatch<SetStateAction<() => void>>;
};

export const OpenMessagePromptContext = React.createContext<
  MessagePromptContextType | undefined
>(undefined);

type OpenMessagePromptContextProviderProps = {
  children: ReactNode;
};

export const OpenMessagePromptContextProvider: React.FC<
  OpenMessagePromptContextProviderProps
> = ({ children }) => {
  const [onMessagePromptClick, setOnMessagePromptClick] = useState<() => void>(
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
