import { useState } from 'react'
import reactLogo from '/logos/react.svg'
import viteLogo from '/logos/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  const [inputValue, setInputValue] = useState("");
  
  
  function handleClick() {
    setCount((count) => count + 1)
  }

  return (
    <>
      <div className="flex items-center justify-center">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo h-[6em] p-[1.5em] will-change-[filter] transition-[filter] duration-300 drop-shadow-[0_0_2em_#646cffaa]" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react h-[6em] p-[1.5em] will-change-[filter] transition-[filter] duration-300 drop-shadow-[0_0_2em_#61dafbaa] animate-logo-spin" alt="React logo" />
        </a>
      </div>
      <h1 className='font-bold'>i9chat</h1>
      <div className="card p-[2em]">
        <button className='outline-none' onClick={handleClick}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs text-[#888]">
        Click on the Vite and React logos to learn more
      </p>
      <div className='py-2'>
        <input placeholder='Write something...' className="w-2xs h-12 outline-none border border-solid border-neutral-800 focus:border-[#646cff] rounded-lg px-3" type="text" onChange={(ev) => setInputValue(ev.target.value)} value={inputValue} />
      </div>
    </>
  )
}

export default App
