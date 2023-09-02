import {FC, useEffect, useState} from 'react'
import './Select.css'

interface IProps{
    options: [{
        value: string | number
        label: string
    }]
    value: string | number
    onChange: () => {}
}

const Select: FC<IProps> = ({ options, value, onChange }) => {
    const [isOpened, setIsOpened] = useState(false)
    const filteredOptions = options.reduce((newArr, item) => newArr.find(obj => obj.value === item.value) ? newArr : [...newArr, item], [])

    const handleChangeState = (e) => {
        if (!e.target?.classList.contains('Select__Label')) {
            setIsOpened(false)
        }
    }

    const handleSelect = () => {
        setIsOpened(prevState => !prevState)
    }

    const handleClick = (e) => {
        if (!e.target.dataset.value === undefined) return
        onChange(e.target.dataset.value)
    }

    useEffect(() => {
        document.addEventListener(('click'), handleChangeState)
        return () => document.removeEventListener(('click'), handleChangeState)
    }, [])

    return (
        <div className="Select" onClick={handleSelect}>
            <p className="Select__Label">{value}</p>
            <div className={`Select__BoxList ${isOpened ? '_active' : ''}`}>
                <ul className="Select__List" onClick={handleClick}>
                    {filteredOptions.map(option =>
                        <li key={option.value} className="Select__ItemList" data-value={option.value}>{option.label}</li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default Select
