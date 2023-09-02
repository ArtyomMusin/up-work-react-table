for correct working use
npm i --save lodash

using:
import UsersTable from './components/UsersTable/index.ts'

return (
      <div>
        <UsersTable data={state}/>
      </div>
)

You can change the number of rows in the table to any other (by default 30):

return (
      <div>
        <UsersTable data={state} countRowsDefault={70}/>
      </div>
)