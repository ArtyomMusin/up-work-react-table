import React, {FC, useEffect, useState} from 'react'

interface IProps {
    name: string
    data: string[]
    onChange: (props: (string[] | null)) => void
}

const FilterDropdown: FC<IProps> = ({ name, data, onChange }) => {
    const unrepeated:string[] = data.reduce((newArray: string[], item) => newArray.includes(item) ? newArray : [...newArray, item], [])
    const [isOpen, setIsOpen] = useState(false)
    const [searchValue, setSearchValue] = useState<string>('')
    const [filteredData, setFilteredData] = useState<string[] | null>(null)
    const [chosen, setChosen] = useState<string[]>([])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)
    }

    const handleChooseInput = (item: string) => {
        setChosen(prevState => prevState.includes(item) ? prevState.filter(string => string !== item) : [...prevState, item])
    }

    const handleSelectAll = () => {
        setChosen([])
    }

    useEffect(() => {
        setFilteredData(unrepeated)
    }, [data])

    useEffect(() => {
        setFilteredData(unrepeated.filter(string => string.toLowerCase().includes(searchValue.toLowerCase())))
    }, [searchValue])

    useEffect(() => {
        const value: string[] | null = chosen.length ? chosen : null
        onChange(value)
    }, [chosen])

    return (
        <div className="flex flex-col px-4 text-slate-900 overflow-hidden">
            <div className="relative inline-flex items-center py-2 px-4 font-medium select-none hover:cursor-pointer" onClick={() => setIsOpen(prevState => !prevState)}>
                <span className={`inline-flex justify-center items-center w-3 h-4 absolute left-0 top-1/2 -translate-y-1.5 -translate-x-1.5 ${isOpen ? 'rotate-90 -translate-y-2' : ''}`}>
                    <i className="block w-2 h-0.5 bg-gray-900 rotate-45  translate-x-1 -translate-y-1"></i><i  className="block w-2 h-0.5 bg-gray-900 -rotate-45 -translate-x-0.5"></i>
                </span>{name}
                <span className={`${chosen.length ? 'inline-flex' : 'hidden'} w-1 h-1 rounded bg-sky-600 translate-y-0.5 translate-x-1.5`}></span>
            </div>
            <div className={`flex-col px-4 border-l-2 border-dashed ${isOpen ? 'flex' : 'hidden'}`}>
                <input className="border border-gray-300 px-2 py-1 mb-4 rounded focus-visible:outline focus-visible:outline-sky-600 placeholder:italic placeholder:text-gray-300" type="text" placeholder="Search..." value={searchValue} onChange={handleSearch}/>
                <div className="max-w-xs max-h-48 pb-4 overflow-x-hidden overflow-y-auto">
                    <div className="flex items-baseline flex-nowrap gap-0.5">
                        <input className="m-0 translate-y-px" id={name + 'all'} type="checkbox" checked={!chosen.length} onChange={handleSelectAll}/>
                        <label className="inline-block select-none w-full whitespace-nowrap text-ellipsis overflow-x-hidden hover:whitespace-pre-wrap" htmlFor={name + 'all'}>(Select all)</label>
                    </div>
                    {filteredData &&
                        filteredData.map((item, i) =>
                            <div key={item} className="flex items-baseline flex-nowrap gap-0.5">
                                <input className="m-0 translate-y-px" id={name + i} type="checkbox" checked={chosen.includes(item)} onChange={() => handleChooseInput(item)}/>
                                <label className="inline-block select-none w-full whitespace-nowrap text-ellipsis overflow-x-hidden hover:whitespace-pre-wrap" htmlFor={name + i}>{item}</label>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default FilterDropdown