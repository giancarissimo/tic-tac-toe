import { Suspense, lazy } from 'react'
import Loader from './components/common/loaders/Loader.jsx'
const MainMenu = lazy(() => import('./components/views/MainMenu.jsx'))

function App() {
  return (
    <Suspense fallback={<Loader />} >
      <MainMenu />
    </Suspense>
  )
}

export default App
