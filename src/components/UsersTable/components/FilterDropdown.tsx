import {FC, useEffect, useState} from 'react'
import './FilterDropdown.css'

interface IProps {
    name: string
    data: object[]
    onChange: ([]) => {}
}

const FilterDropdown: FC<IProps> = ({ name, data, onChange }) => {
    const unrepeated = data.reduce((newArray, item) => newArray.includes(item) ? newArray : [...newArray, item], [])
    const [isOpen, setIsOpen] = useState(false)
    const [searchValue, setSearchValue] = useState<string>('')
    const [filteredData, setFilteredData] = useState<object | null>(null)
    const [chosen, setChosen] = useState<string[]>([])

    const handleSearch = (e) => {
        setSearchValue(e.target.value)
    }

    const handleChooseInput = (item) => {
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
        onChange(chosen.length ? chosen : null)
    }, [chosen])

    return (
        <div className="FilterDropdown">
            <div className={`FilterDropdown__Label${isOpen ? ' _active': ''}`} onClick={() => setIsOpen(prevState => !prevState)}>
                {name}<span className={`FilterDropdown__Indicator${chosen.length ? ' _active': ''}`}></span>
            </div>
            <div className="FilterDropdown__Dropdown">
                <input className="FilterDropdown__Search" type="text" placeholder="Search..." value={searchValue} onChange={handleSearch}/>
                <div className="FilterDropdown__InputsContainer">
                    <div className="FilterDropdown__WrapperInput">
                        <input className="FilterDropdown__Input" id={name + 'all'} type="checkbox" checked={!chosen.length} onChange={handleSelectAll}/>
                        <label className="FilterDropdown__LabelCheckBox" htmlFor={name + 'all'}>(Select all)</label>
                    </div>
                    {filteredData &&
                        filteredData.map((item, i) =>
                            <div key={item} className="FilterDropdown__WrapperInput">
                                <input className="FilterDropdown__Input" id={name + i} type="checkbox" checked={chosen.includes(item)} onChange={() => handleChooseInput(item)}/>
                                <label className="FilterDropdown__LabelCheckBox" htmlFor={name + i}>{item}</label>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default FilterDropdown
