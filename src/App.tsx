import { Suspense, createContext, useState } from 'react'
import 'rsuite/dist/rsuite-no-reset.min.css';
import { AppRoute } from './routes/AppRoute'
import { ExpandMenuContext } from './objects/expand_menu';

function App() {
  const [expanded, setExpanded] = useState<boolean>(true)
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExpandMenuContext.Provider value={{
        isExpanded: expanded, setExpanded: (val) => {
          setExpanded(val)
          localStorage.setItem("expanded", val ? "1" : "0")
        }
      }}>
        <AppRoute />
      </ExpandMenuContext.Provider>
    </Suspense>
  )
}

export default App
