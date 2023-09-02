import { useEffect, useState } from 'react'
import './App.css'
import UsersTable from './components/UsersTable/index.ts'

const App = () => {
  const [state, setState] = useState([])

  const loadData = async () => {
    fetch('https://jsonblob.com/api/jsonBlob/1146283587699335168')
        .then(res => res.json())
        .then(data => setState(data))
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
      <div style={{ padding: '3rem', boxSizing: 'border-box' }}>
        <UsersTable data={state}/>
      </div>
  )
}

export default App

