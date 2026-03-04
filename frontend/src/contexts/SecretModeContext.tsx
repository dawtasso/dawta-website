import { createContext, useContext, useState, type ReactNode } from 'react';

type SecretModeContextType = {
  showHidden: boolean;
  setShowHidden: (value: boolean) => void;
};

const SecretModeContext = createContext<SecretModeContextType>({
  showHidden: false,
  setShowHidden: () => {},
});

export function SecretModeProvider({ children }: { children: ReactNode }) {
  const [showHidden, setShowHidden] = useState(false);

  return (
    <SecretModeContext.Provider value={{ showHidden, setShowHidden }}>
      {children}
    </SecretModeContext.Provider>
  );
}

export function useSecretMode() {
  return useContext(SecretModeContext);
}
