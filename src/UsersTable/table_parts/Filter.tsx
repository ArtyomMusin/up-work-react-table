import React, {FC, useState} from 'react'
import { IUser } from '../etc/types'
import FilterDropdown from './FilterDropdown'

interface IProps {
    data: IUser[]
    filters: {
        name: string
        field: string
        handler: (newState: string[]) => void
    }[]
    filtersIsOpen: boolean
}

const Filter: FC<IProps> = ({ data, filters, filtersIsOpen }) => {
    const [openedFilter, setOpenedFilter] = useState< string | null>(null)

    return (
        <div className={`absolute flex-col top-0 left-0 max-h-96 p-4 border border-green-600 border-t-0 translate-y-px bg-green-100 rounded-br-lg overflow-hidden z-40 ${filtersIsOpen ? 'flex' : 'hidden'}`} id="filters">
            {filters.map(filter =>
                // @ts-ignore
                <FilterDropdown key={filter.field} name={filter.name} openedFilter={openedFilter} setOpenedFilter={setOpenedFilter} data={data.map(user => user[filter.field])} onChange={filter.handler}/>
            )}
       </div>
    )
}

export default Filter
