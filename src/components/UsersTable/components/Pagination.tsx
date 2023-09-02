import {FC, useRef, useEffect, useState} from 'react'
import './Pagination.css'

interface IProps{
    maxPagesCount: number
    currentPage: number
    onChange: (number) => {}
}

const Pagination: FC<IProps> = ({ maxPagesCount, currentPage, onChange }) => {
    const paginationBox = useRef<HTMLDivElement | null>(null)
    const paginationBoxButtons = useRef<HTMLDivElement | null>(null)
    const [isShort, setIsShort] = useState<boolean>(false)

    useEffect(() => {
        setIsShort(paginationBoxButtons.current?.offsetWidth > paginationBox.current?.offsetWidth)
    }, [paginationBox, paginationBoxButtons])

    const arrayOfPages = []
    for (let i = 1; i <= maxPagesCount; i++){
        arrayOfPages.push(i)
    }

    const handlerChangePageByButtons = (value) => {
        if (!Number.isNaN(Number(value))) {
            return onChange(value - 1)
        }

        if (value === 'prev') {
            onChange(currentPage > 0 ? currentPage - 1 : currentPage)
        } else {
            onChange(currentPage < maxPagesCount - 1 ? currentPage + 1 : currentPage)
        }
    }

    const getButtons = () => {
        if (currentPage !== 0 && currentPage !== maxPagesCount) {
            return (
                <>
                    <button className="Pagination__Button" onClick={() => handlerChangePageByButtons(1)}>{1}</button>
                    <div className="Pagination__Space _disable">...</div>
                    <button className="Pagination__Button _active" onClick={() => handlerChangePageByButtons(currentPage)}>{currentPage + 1}</button>
                    <div className="Pagination__Space _disable">...</div>
                    <button className="Pagination__Button" onClick={() => handlerChangePageByButtons(maxPagesCount)}>{maxPagesCount}</button>
                </>

            )
        }

        return (
            <>
                <button className={`Pagination__Button${currentPage === 0 ? ' _active' : ''}`} onClick={() => handlerChangePageByButtons(1)}>{1}</button>
                <div className="Pagination__Space _disable">...</div>
                <button className={`Pagination__Button${currentPage === maxPagesCount ? ' _active' : ''}`} onClick={() => handlerChangePageByButtons(maxPagesCount)}>{maxPagesCount}</button>
            </>
        )
    }

    return (
        <div className="Pagination" ref={paginationBox}>
            {maxPagesCount > 1 &&
                <div className="Pagination__BoxButtons" ref={paginationBoxButtons}>
                    <button className={`Pagination__Button ${currentPage <= 0 ? '_disable' : ''}`}
                            onClick={() => handlerChangePageByButtons('prev')}>Previous
                    </button>
                    {isShort ? (
                        getButtons()
                    ) : (
                        arrayOfPages.map(num =>
                            <button key={num}
                                    className={`Pagination__Button${currentPage + 1 === num ? ' _active' : ''}`}
                                    onClick={() => handlerChangePageByButtons(num)}
                            >
                                {num}
                            </button>
                        )
                    )}
                    <button className={`Pagination__Button${currentPage >= maxPagesCount - 1 ? ' _disable' : ''}`}
                            onClick={() => handlerChangePageByButtons('next')}>Next
                    </button>
                </div>
            }
        </div>
    )
}

export default Pagination
