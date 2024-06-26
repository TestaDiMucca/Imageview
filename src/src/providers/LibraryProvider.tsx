import React, { createContext, useCallback, useEffect, useState } from 'react';
import useSettingsContext from 'src/hooks/useSettingsContext';
import { storeLibrary } from 'src/utils/files.helpers';

interface LibraryContextValues {
  library: EnrichedFile[];
  setLibrary: (_: EnrichedFile[], puntStore?: boolean) => void;
  renderKey: number;
}

export const LibraryContext = createContext<LibraryContextValues>({
  library: [],
  setLibrary: () => {},
  renderKey: 0,
});

interface ProviderProps {}

const LibraryProvider: React.FC<React.PropsWithChildren<ProviderProps>> = ({
  children,
}) => {
  const { generalSettings } = useSettingsContext();
  const [library, setLibrary] = useState<EnrichedFile[]>([]);
  const [renderKey, setRenderKey] = useState(0);

  const handleSetLibrary = useCallback(
    (lib: EnrichedFile[], puntStore = true) => {
      setLibrary(lib);
      if (!puntStore && !!generalSettings.libraryCaching)
        void storeLibrary(lib);
    },
    [generalSettings.libraryCaching]
  );

  useEffect(() => {
    setRenderKey(Math.random());
  }, [library.length]);

  return (
    <LibraryContext.Provider
      value={{ library, setLibrary: handleSetLibrary, renderKey }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export default LibraryProvider;
