import React, { useState, useEffect } from 'react'
import UsersTable from './UsersTable/UsersTable'
import { IUser } from './UsersTable/etc/types'

function App() {
  const [data, setData] = useState<IUser[] | null>(null)

  const loadData = async () => {
    fetch('https://jsonblob.com/api/jsonBlob/1146283587699335168')
        .then(res => res.json())
        // .then(data => setData(data))
        .then(data => setData(data.map((user: IUser) => ({ ...user, registrationNumber: Number(user.registrationNumber) }))))
  }

  useEffect(() => {
    void loadData()
  }, [])

  return (
      data &&
        <div style={{ padding: '3rem', boxSizing: 'border-box' }}>
          <UsersTable data={data}/>
        </div>
  )
}

export default App
