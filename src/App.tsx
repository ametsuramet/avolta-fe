import { Suspense, createContext, useState } from 'react'
import 'rsuite/dist/rsuite-no-reset.min.css';
import { AppRoute } from './routes/AppRoute'
import { ExpandMenuContext } from './objects/expand_menu';
import { LoadingContext } from './objects/loading_context';

function App() {
  const [loading, setLoading] = useState<boolean>(false)
  const [expanded, setExpanded] = useState<boolean>(true)
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoadingContext.Provider value={{ isLoading: loading, setIsLoading: setLoading }}>
      <ExpandMenuContext.Provider value={{
        isExpanded: expanded, setExpanded: (val) => {
          setExpanded(val)
          localStorage.setItem("expanded", val ? "1" : "0")
        }
      }}>
        <AppRoute />
      </ExpandMenuContext.Provider>
      </LoadingContext.Provider>
    </Suspense>
  )
}

export default App
