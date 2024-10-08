import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import EditorPpage from './pages/EditorPage'
import { Toaster } from 'react-hot-toast'
function App() {

  return (
    <>
    <div>
      <Toaster position='top-center' >
      </Toaster>
    </div>

    <BrowserRouter>
<Routes>
  <Route path='/' element={<Home></Home>} ></Route>
  <Route path='/editor/:roomId' element={<EditorPpage></EditorPpage>} ></Route>
</Routes>
    </BrowserRouter>
    </>
  )
}

export default App
