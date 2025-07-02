import { useState } from 'react'
import reactLogo from '/logos/react.svg'
import viteLogo from '/logos/vite.svg'
import { Toast } from '@capacitor/toast';

function App() {
  const [count, setCount] = useState(0)

  const showHelloToast = async (count) => {
    await Toast.show({
      text: 'Hello! ' + count,
      position: 'top'
    });
  };

  
  function handleClick() {
    setCount((count) => count + 1)

    showHelloToast(count + 1)
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
    </>
  )
}

export default App
