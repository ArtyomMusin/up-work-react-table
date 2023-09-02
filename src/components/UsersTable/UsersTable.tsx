import {FC, useEffect, useRef, useState, Fragment, DOMElement} from 'react'
import './UsersTable.css'
import _ from 'lodash'
import { getDate, getTime } from './utils.ts'
import { DETAILS, GRANTORS, SECURED_PARTIES, COLLATERAL } from './vars.ts'
import InfoSection from './components/InfoSection.tsx'
import Pagination from './components/Pagination.tsx'
import Select from './components/Select.tsx'
import FilterDropdown from './components/FilterDropdown.tsx'

interface IProps{
    data: object[]
    countRowsDefault?: number
}

interface User{
    id: string
    registrationNumber: number
    registrationStartTime: string
    registrationEndTimeString: string
    collateralSummary: string
    securedPartySummary: string
    grantorSummary: string
    securedParties: [
        {
            securedPartySummary: string
        }
    ]
}

interface IDOMDimensions {
    colWidth: number
    isScrollable: boolean
}

const UsersTable: FC<IProps> = ({ data, countRowsDefault }) => {
    //hooks
    const wrapper = useRef<HTMLDivElement | null>(null)
    const headerRow = useRef<HTMLDivElement | null>(null)

    // states
    const [DOMDimensions, setDomDimension] = useState<IDOMDimensions>({})
    const [countRows, setCountRows] = useState<number>(countRowsDefault)
    const [dataSlice, setDataSlice] = useState<object[] | null>(null)
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [activeRow, setActiveRow] = useState<string>(null)
    const [searchPageValue, setSearchPageValue] = useState<number | ''>('')
    const [sortingName, setSortingName] = useState<string | null>(null)
    const [sortingType, setSortingType] = useState<string>('desc')
    const [filteredByCollateral, setFilteredByCollateral] = useState<string[] | null>(null)
    const [filteredBySecuredParties, setFilteredBySecuredParties] = useState<string[] | null>(null)
    const [filteredByGrantors, setFilteredByGrantors] = useState<string[] | null>(null)
    const [filteredUsers, setFilteredUsers] = useState<object[] | null>(null)
    const [sortedUsers, setSortedUsers] = useState<object[] | null>(null)
    const [filtersIsOpen, setFiltersIsOpen] = useState<boolean>(false)
    const [countRowsVariants, setCountRowsVariants] = useState<object[]>([
        {value: 100, label: '100'},
        {value: 50, label: '50'},
        {value: 30, label: '30'},
        {value: 20, label: '20'},
        {value: 10, label: '10'}
    ])
    // console.log('data', data)

    //vars
    const maxPagesCount = Math.ceil(filteredUsers?.length / countRows)
    const startOfPaginationRange = currentPage * countRows
    const endOfPaginationRange = currentPage * countRows + countRows

    // calculate dimensions for normal display at different width
    const calculateDimensions = () => {
        if (!headerRow.current || !wrapper.current) return
        const ths = Array.from(headerRow.current.querySelectorAll('th'))
        // set columns width
        const screenWidth = window.innerWidth
        const deltaWidth: number = ths.reduce((sum, th, i) => i < 5 ? sum + th.offsetWidth : sum, 0)
        const paddingCell = window.getComputedStyle(ths[ths.length - 1],'').getPropertyValue('padding-left')
        const paddingValue = screenWidth < 1000 ? Number(paddingCell.slice(0, paddingCell.length - 2)) * 6 : 0
        const colWidth = Math.floor((Math.floor(wrapper.current.offsetWidth) - paddingValue - deltaWidth) / 3)
        setDomDimension(prevState => ({ ...prevState, colWidth }))

        // set scrollable section
        if (wrapper.current.offsetWidth < 900) {
            setDomDimension(prevState => ({ ...prevState, isScrollable: true }))
        }
    }

    // handlers
    const handlerSliceData = () => {
        setDataSlice(sortedUsers?.filter((item, i) => i >= startOfPaginationRange && i < endOfPaginationRange))
    }

    const handlerShowInfo = (id) => {
        setActiveRow(id === activeRow ? null : id)
    }

    const handlerKeyDown = (e) => {
        if (e.keyCode === 13) {
            handlerChangePage()
        }
    }

    const handlerChangePage = () => {
        if (Number(searchPageValue) > maxPagesCount || Number(searchPageValue) < 1) return
        setCurrentPage(Number(searchPageValue) - 1)
    }

    const changeSearchInput = (e) => {
        if (!Number.isNaN(Number(e.target.value))) {
            setSearchPageValue(e.target.value)
        }
    }

    const handleChangePage = (page) => {
        setCurrentPage(Number(page))
        setSearchPageValue('')
    }

    const changeRowsCount = (value) => {
        setCountRows(Number(value))
    }

    const handleSort = (name) => {
        if (name !== sortingName) {
            setSortingName(name)
            setSortingType('asc')
            return
        }
        setSortingType(prevState => prevState === 'desc' ? 'asc' : 'desc')
    }

    const sortUsers = () => {
        if(sortingName && filteredUsers.length) {
            setSortedUsers(_.orderBy(filteredUsers, [sortingName], [sortingType]))
            return
        }
        setSortedUsers(filteredUsers)
    }

    const checkSorting = (name) => {
        if (name !== sortingName) return ''
        return sortingType === 'asc' ? ' _asc' : ' _desc'
    }

    const handleFilter = () => {
        let filteredData = null

        if (filteredByCollateral) {
            let filtered = []
            for(const item of filteredByCollateral){
                filtered = [...filtered, ...data?.filter(user => user?.collateralSummary === item)]
            }
            filteredData = filtered
        }
        if (filteredBySecuredParties) {
            let filtered = []
            const source = filteredData || data
            for(const item of filteredBySecuredParties){
                filtered = [...filtered, ...source?.filter(user => user?.securedPartySummary === item)]
            }
            filteredData = filtered
        }
        if (filteredByGrantors) {
            let filtered = []
            const source = filteredData || data
            for(const item of filteredByGrantors){
                filtered = [...filtered, ...source?.filter(user => user?.grantorSummary === item)]
            }
            filteredData = filtered
        }
        if (!filteredData) {
            setFilteredUsers(data)
            return
        }
        setFilteredUsers(filteredData)
    }

    const handleOpenCloseFilters = () => {
        setFiltersIsOpen(prevState => !prevState)
    }

    const closeFilters = (e) => {
        if (e.target.classList.contains('UsersTable__FilterLabel')) return
        if (e.target.closest('.UsersTable__Filters')) return
        setFiltersIsOpen(false)
    }

    // observers
    useEffect(() => {
        sortUsers()
    }, [data, sortingName, sortingType, filteredUsers])

    useEffect(() => {
        handleFilter()
    }, [data, filteredByCollateral, filteredBySecuredParties, filteredByGrantors])

    useEffect(() => {
        if (!countRowsVariants.find(obj => obj.value === countRowsDefault)) {
            setCountRowsVariants(prevState => [...prevState, { value: countRowsDefault, label: countRowsDefault.toString() }].sort((a, b) => b.value - a.value))
        }
    }, [countRowsDefault])

    useEffect(() => {
        handlerSliceData()
    }, [data, currentPage, countRows, sortedUsers])

    useEffect(() => {
        const observer = new ResizeObserver(calculateDimensions)
        observer.observe(wrapper.current)
    }, [wrapper.current])

    useEffect(() => {
        if (currentPage > 0 && currentPage >= maxPagesCount) {
            setCurrentPage(maxPagesCount - 1)
        }
    }, [countRows])

    useEffect(() => {
        if (!headerRow.current) return
        calculateDimensions()
    }, [headerRow.current])

    useEffect(() => {
        document.addEventListener(('click'), closeFilters)
        return () => document.removeEventListener(('click'), closeFilters)
    }, [])

    return (
        <section className="UsersTable">
            <div className="UsersTable__FilterLabel" onClick={handleOpenCloseFilters}>
                Filters
                <svg className="UsersTable__FilterIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.2673 6.24223C2.20553 4.40955 3.50184 1 6.26039 1H17.7396C20.4981 1 21.7945 4.40955 19.7327 6.24223L15.3356 10.1507C15.1221 10.3405 15 10.6125 15 10.8981V21.0858C15 22.8676 12.8457 23.7599 11.5858 22.5L9.58578 20.5C9.21071 20.1249 8.99999 19.6162 8.99999 19.0858V10.8981C8.99999 10.6125 8.87785 10.3405 8.66436 10.1507L4.2673 6.24223ZM6.26039 3C5.34088 3 4.90877 4.13652 5.59603 4.74741L9.99309 8.6559C10.6336 9.22521 11 10.0412 11 10.8981V19.0858L13 21.0858V10.8981C13 10.0412 13.3664 9.22521 14.0069 8.6559L18.404 4.74741C19.0912 4.13652 18.6591 3 17.7396 3H6.26039Z" fill="#22272A"/>
                </svg>
            </div>
            <div className={`UsersTable__Filters${filtersIsOpen ? ' _active' : ''}`}>
                <FilterDropdown name={'Collateral'} data={data.map(user => user.collateralSummary)} onChange={setFilteredByCollateral}/>
                <FilterDropdown name={'Secured Parties'} data={data.map(user => user.securedPartySummary)} onChange={setFilteredBySecuredParties}/>
                <FilterDropdown name={'Grantors'} data={data.map(user => user.grantorSummary)} onChange={setFilteredByGrantors}/>
            </div>
            <div className="UsersTable__WrapperTable" ref={wrapper} style={{ overflowX: `${DOMDimensions.isScrollable ? 'auto' : 'hidden'}` }}>
                {data ? (
                    <table className="UsersTable__Table" style={{ width: wrapper.current?.offsetWidth }}>
                        <thead className="UsersTable__Head">
                        <tr className="UsersTable__RowHead" ref={headerRow}>
                            <th className="UsersTable__Cell UsersTable__HeadCell">#</th>
                            <th className="UsersTable__Cell UsersTable__HeadCell"></th>
                            <th className={`UsersTable__Cell UsersTable__HeadCell UsersTable__HeadSortable${checkSorting('registrationNumber')}`} onClick={() => handleSort('registrationNumber')}>Registration #</th>
                            <th className={`UsersTable__Cell UsersTable__HeadCell UsersTable__HeadSortable${checkSorting('registrationStartTime')}`} onClick={() => handleSort('registrationStartTime')}>
                                Registration Date<sup className="UsersTable__Sup">AU</sup>
                                <svg className="UsersTable__IconCLock" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                                    <rect width="24" height="24" fill="opacity"/>
                                    <circle cx="12" cy="12" r="9" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2px"/>
                                    <path d="M12 6V12L7.5 16.5" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </th>
                            <th className={`UsersTable__Cell UsersTable__HeadCell UsersTable__HeadSortable${checkSorting('registrationEndTimeString')}`} onClick={() => handleSort('registrationEndTimeString')}>Expiry Date</th>
                            <th className={`UsersTable__Cell UsersTable__HeadCell UsersTable__HeadSortable dynamic-width${checkSorting('collateralSummary')}`} onClick={() => handleSort('collateralSummary')} style={{ maxWidth: DOMDimensions.colWidth }}>Collateral</th>
                            <th className={`UsersTable__Cell UsersTable__HeadCell UsersTable__HeadSortable dynamic-width${checkSorting('securedPartySummary')}`} onClick={() => handleSort('securedPartySummary')} style={{ maxWidth: DOMDimensions.colWidth }}>Secured Parties</th>
                            <th className={`UsersTable__Cell UsersTable__HeadCell UsersTable__HeadSortable dynamic-width${checkSorting('grantorSummary')}`} onClick={() => handleSort('grantorSummary')} style={{ maxWidth: DOMDimensions.colWidth }}>Grantors</th>
                        </tr>
                        </thead>
                        <tbody className="UsersTable__Body">
                            {dataSlice?.length ? (
                                dataSlice?.map((user: User, i) =>
                                    <Fragment key={user.id}>
                                        <tr>
                                            <td className="UsersTable__Cell">{i + 1 + currentPage * countRows}</td>
                                            <td className={`UsersTable__Cell ${user.id === activeRow ? '_active' : ''}`}><button className="UsersTable__OpenButton" onClick={() => handlerShowInfo(user.id)}></button></td>
                                            <td className="UsersTable__Cell" title={String(user.registrationNumber)}>{user.registrationNumber}</td>
                                            <td className="UsersTable__Cell UsersTable__Nowrap">{getDate(user.registrationStartTime)} {getTime(user.registrationStartTime)}</td>
                                            <td className="UsersTable__Cell" >{getDate(user.registrationEndTimeString)}</td>
                                            <td className="UsersTable__Cell dynamic-width" style={{ maxWidth: DOMDimensions.colWidth }}>{user.collateralSummary}</td>
                                            <td className="UsersTable__Cell dynamic-width" style={{ maxWidth: DOMDimensions.colWidth }}>{user.securedPartySummary}</td>
                                            <td className="UsersTable__Cell dynamic-width" style={{ maxWidth: DOMDimensions.colWidth }}>{user.grantorSummary}</td>
                                        </tr>
                                        <tr className={`UsersTable__RowInfo ${user.id === activeRow ? '_active' : ''}`}>
                                            <td colSpan={8}>
                                                <div className="UsersTable__Info">
                                                    <div className="UsersTable__TitleInfo">Summary</div>
                                                    <div className="UsersTable__ContentInfo">
                                                        <div className="UsersTable__BoxInfo">
                                                            <InfoSection section={DETAILS} data={user}/>
                                                            <InfoSection section={GRANTORS} data={user}/>
                                                            <InfoSection section={SECURED_PARTIES} data={user}/>
                                                        </div>
                                                        <div className="UsersTable__BoxInfo">
                                                            <InfoSection section={COLLATERAL} data={user}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </Fragment>
                                )
                            ) : (
                                <tr className="UsersTable__NoMatches">
                                    <td colSpan={8}>No matches</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot className="UsersTable__Foot">
                            <tr className="UsersTable__RowFoot">
                                <td className="UsersTable__CellFoot" colSpan={8}>
                                    <div className="UsersTable__WrapperFoot" style={{ width: wrapper.current?.offsetWidth }}>
                                        <div className="UsersTable__BoxFoot UsersTable__Pagination">
                                            <label className="UsersTable__LabelFoot" htmlFor="table-foot-input">Go to page</label>
                                            <div className="UsersTable__SearchBox">
                                                <input className="UsersTable__InputFoot" id="table-foot-input" type="text" value={searchPageValue} onChange={changeSearchInput} onKeyDown={handlerKeyDown}/>
                                                <svg className="UsersTable__SearchIcon" viewBox="0 0 30 30" onClick={handlerChangePage}><g xmlns="http://www.w3.org/2000/svg" data-name="Layer 2" id="Layer_2"><path d="M18,10a8,8,0,1,0-3.1,6.31l6.4,6.4,1.41-1.41-6.4-6.4A8,8,0,0,0,18,10Zm-8,6a6,6,0,1,1,6-6A6,6,0,0,1,10,16Z" fill="#A3ABB2"/></g></svg>
                                            </div>
                                            <Pagination currentPage={currentPage} maxPagesCount={maxPagesCount} onChange={handleChangePage}/>
                                        </div>
                                        <div className="UsersTable__BoxFoot UsersTable__PageCountBox">
                                            Items per page
                                            <Select
                                                options={countRowsVariants}
                                                value={countRows}
                                                onChange={changeRowsCount}
                                            />
                                        </div>
                                        <p className="UsersTable__BoxFoot UsersTable__InfoFoot">
                                            {startOfPaginationRange + 1} - {currentPage + 1 === maxPagesCount ? filteredUsers?.length : endOfPaginationRange} of {filteredUsers?.length}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                ) : (
                    <h1>Loading...</h1>
                )}
            </div>
        </section>
    )
}

UsersTable.defaultProps={
    countRowsDefault: 30
}

export default UsersTable
