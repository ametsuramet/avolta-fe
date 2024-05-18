import { Suspense, createContext, useState } from 'react'
import 'rsuite/dist/rsuite-no-reset.min.css';
import { AppRoute } from './routes/AppRoute'
import { ExpandMenuContext } from './objects/expand_menu';
import { LoadingContext } from './objects/loading_context';
import { CustomProvider } from 'rsuite';
import idID from "@/objects/id_ID";

function App() {
  const [loading, setLoading] = useState<boolean>(false)
  const [expanded, setExpanded] = useState<boolean>(true)
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoadingContext.Provider value={{ isLoading: loading, setIsLoading: setLoading }}>
      <CustomProvider locale={idID}>
      <ExpandMenuContext.Provider value={{
        isExpanded: expanded, setExpanded: (val) => {
          setExpanded(val)
          localStorage.setItem("expanded", val ? "1" : "0")
        }
      }}>
        <AppRoute />
      </ExpandMenuContext.Provider>
      </CustomProvider>
      </LoadingContext.Provider>
    </Suspense>
  )
}

export default App
