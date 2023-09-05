import React, { FC, useEffect, useState, useRef, Fragment } from 'react'
import { useReactTable, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel } from '@tanstack/react-table'
import { IUser, IDOMDimensions, TypeSorting, TypeTanStackTableHeader } from '../etc/types'
import { generateArray } from '../etc/utils'
import { DETAILS, GRANTORS, SECURED_PARTIES, COLLATERAL } from '../etc/vars'
import InfoSection from './InfoSection'
import FilterDropdown from './FilterDropdown'

interface IProps {
    data: IUser[]
    columns: object[]
    openedString: string | null
}

const Table: FC<IProps> = ({ data, columns, openedString  }) => {
    const wrapper = useRef<HTMLDivElement | null>(null)
    const headerRow = useRef<HTMLTableRowElement | null>(null)
    const paginationWrapper = useRef<HTMLDivElement | null>(null)
    const paginationButtonsContainer = useRef<HTMLDivElement | null>(null)

    const [currentPage, setCurrentPage] = useState<number>(0)
    const [inputPage, setInputPage] = useState<number | null>(null)
    const [pageSize, setPageSize] = useState<number>(30)
    const [sorting, setSorting] = useState<TypeSorting[]>([])
    const [DOMDimensions, setDomDimension] = useState<IDOMDimensions>({})
    const [filtersIsOpen, setFiltersIsOpen] = useState<boolean>(false)
    const [filteredByCollateral, setFilteredByCollateral] = useState<string[] | null>(null)
    const [filteredBySecuredParties, setFilteredBySecuredParties] = useState<string[] | null>(null)
    const [filteredByGrantors, setFilteredByGrantors] = useState<string[] | null>(null)
    const [filteredData, setFilteredData] = useState<object[]>(data)

    const table = useReactTable({
        data: filteredData,
        // @ts-ignore
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            // @ts-ignore
            sorting: sorting,
        },
        // @ts-ignore
        onSortingChange: setSorting,
    })

    // calculate dimensions for normal display at different width
    const calculateDimensions = () => {
        if (!headerRow.current || !wrapper.current) return
        const ths: HTMLElement[] = Array.from(headerRow.current.querySelectorAll('th'))
        // set columns width
        const screenWidth: number = window.innerWidth
        const deltaWidth: number = ths.reduce((sum, th, i) => i < 5 ? sum + th.offsetWidth : sum, 0)
        // @ts-ignore
        const paddingCell: string = window.getComputedStyle(ths[ths.length - 1],'').getPropertyValue('padding-left')
        const paddingValue: number = screenWidth < 1000 ? Number(paddingCell.slice(0, paddingCell.length - 2)) * 6 : 0
        const colWidth: number = Math.floor((Math.floor(wrapper.current.offsetWidth) - paddingValue - deltaWidth) / 3)
        setDomDimension(prevState => ({ ...prevState, colWidth }))

        // set scrollable section
        if (wrapper.current.offsetWidth < 900) {
            setDomDimension(prevState => ({ ...prevState, isScrollable: true }))
        }

        if(!paginationWrapper.current || !paginationButtonsContainer.current) return
        if (paginationWrapper.current.offsetWidth <= paginationButtonsContainer.current.offsetWidth){
            setDomDimension(prevState => ({ ...prevState, isShortPagination: true }))
        }
    }

    //setters
    const setPage = (page: number) => {
        setCurrentPage(page)
        table.setPageIndex(page)
    }

    // handlers
    const handlePrevPage = () => {
        setCurrentPage(prevState => {
            if (prevState > 0) {
                table.previousPage()
                return prevState - 1
            }
            return prevState
        })
    }

    const handleNextPage = () => {
        setCurrentPage(prevState => {
            if (prevState < table.getPageCount() - 1) {
                table.nextPage()
                return prevState + 1
            }
            return prevState
        })
    }

    const handleChangeInputSetPage = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (Number.isNaN(Number(e.target.value))) return
        setInputPage(Number(e.target.value))
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        setPageSize(Number(e.target.value))
    }

    const handleToggleShowFilters = (): void => {
        setFiltersIsOpen(prevState => !prevState)
    }

    const handleFilter = (): void => {
        let filteredData: (IUser[] | null) = null

        if (filteredByCollateral) {
            let filtered: IUser[] = []
            for(const item of filteredByCollateral){
                filtered = [...filtered, ...data?.filter((user: IUser) => user?.collateralSummary === item)]
            }
            filteredData = filtered
        }
        if (filteredBySecuredParties) {
            let filtered: IUser[] = []
            const source = filteredData || data
            for(const item of filteredBySecuredParties){
                filtered = [...filtered, ...source?.filter((user: IUser) => user?.securedPartySummary === item)]
            }
            filteredData = filtered
        }
        if (filteredByGrantors) {
            let filtered: IUser[] = []
            const source: IUser[] = filteredData || data
            for(const item of filteredByGrantors){
                filtered = [...filtered, ...source?.filter((user: IUser) => user?.grantorSummary === item)]
            }
            filteredData = filtered
        }
        if (!filteredData) {
            setFilteredData(data)
            return
        }
        setFilteredData(filteredData)
    }

    const handleCloseFilters = (e: React.MouseEvent<HTMLElement>) => {
        if ((e.target as HTMLElement).closest('#filter-label')) return
        if ((e.target as HTMLElement).closest('#filters')) return
        setFiltersIsOpen(false)
    }

    const handleInputSetPage = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (!inputPage) return
        if (e.key === 'Enter' && inputPage > 0 && inputPage <= table.getPageCount()) {
            setCurrentPage(inputPage - 1)
            table.setPageIndex(inputPage - 1)
        }
    }

    // observers
    useEffect(handleFilter, [data, filteredByCollateral, filteredBySecuredParties, filteredByGrantors])

    useEffect(() => {
        setFilteredData(data)
    }, [data])

    useEffect(() => {
        table.setPageSize(pageSize)
        setPage(0)
    }, [pageSize])

    useEffect(() => {
        if (!headerRow.current) return
        calculateDimensions()
    }, [headerRow.current, paginationButtonsContainer, paginationWrapper])

    useEffect(() => {
        if (wrapper.current) {
            const observer = new ResizeObserver(calculateDimensions)
            observer.observe(wrapper.current)
        }
    }, [wrapper.current, paginationButtonsContainer, paginationWrapper])

    useEffect(() => {
        // @ts-ignore
        document.addEventListener(('click'), handleCloseFilters)
        // @ts-ignore
        return () => document.removeEventListener(('click'), handleCloseFilters)
    }, [])


    return (
        <div className="flex w-full h-full border border-b-gray-300 rounded-lg relative" ref={wrapper}>
            <div className="absolute flex flex-nowrap items-center top-2 left-0 -translate-y-full text-zinc-800 rounded border border-slate-200 border-b-0 pt-0.5 px-3 pb-2.5 text-sm whitespace-nowrap select-none z-10 hover:bg-slate-100 hover:cursor-pointer" id="filter-label" onClick={handleToggleShowFilters}>
                Filters
                <svg className="w-3 h-3 ml-1 translate-y-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.2673 6.24223C2.20553 4.40955 3.50184 1 6.26039 1H17.7396C20.4981 1 21.7945 4.40955 19.7327 6.24223L15.3356 10.1507C15.1221 10.3405 15 10.6125 15 10.8981V21.0858C15 22.8676 12.8457 23.7599 11.5858 22.5L9.58578 20.5C9.21071 20.1249 8.99999 19.6162 8.99999 19.0858V10.8981C8.99999 10.6125 8.87785 10.3405 8.66436 10.1507L4.2673 6.24223ZM6.26039 3C5.34088 3 4.90877 4.13652 5.59603 4.74741L9.99309 8.6559C10.6336 9.22521 11 10.0412 11 10.8981V19.0858L13 21.0858V10.8981C13 10.0412 13.3664 9.22521 14.0069 8.6559L18.404 4.74741C19.0912 4.13652 18.6591 3 17.7396 3H6.26039Z" fill="#22272A"/>
                </svg>
            </div>
            <div className={`absolute flex-col top-0 left-0 max-h-96 p-4 border border-slate-200 bg-slate-100 rounded overflow-x-hidden overflow-y-auto z-50${filtersIsOpen ? ' flex' : ' hidden'}`} id="filters">
                <FilterDropdown name={'Collateral'} data={data.map((user: IUser) => user.collateralSummary)} onChange={setFilteredByCollateral}/>
                <FilterDropdown name={'Secured Parties'} data={data.map((user: IUser) => user.securedPartySummary)} onChange={setFilteredBySecuredParties}/>
                <FilterDropdown name={'Grantors'} data={data.map((user: IUser) => user.grantorSummary)} onChange={setFilteredByGrantors}/>
            </div>
            <table className="w-full table-auto">
                <thead>
                    {table.getHeaderGroups().map(headerGroup =>
                        <tr key={headerGroup.id} className="bg-slate-100" ref={headerRow}>
                            {headerGroup.headers.map(header =>
                                <th key={header.id} className="relative border border-b-gray-300 py-1.5 px-4 text-left text-ellipsis w-auto overflow-hidden whitespace-nowrap first:text-center" style={{ maxWidth: DOMDimensions.colWidth }}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            )}
                        </tr>
                    )}
                </thead>

                <tbody>
                {filteredData?.length ? (
                    table.getRowModel().rows.map((row, i) =>
                        <Fragment key={row.id}>
                            <tr>
                                {row.getVisibleCells().map((cell, j) => (
                                    // @ts-ignore
                                    <td key={cell.id} className={`${table.getRowModel().rows[i].original.id === openedString && j === 1? 'bg-sky-50 border-b-0' : 'bg-white'} border border-b-gray-300 py-1.5 px-4 text-left text-ellipsis w-auto overflow-hidden whitespace-nowrap hover:whitespace-pre-wrap first:text-center`} style={{ maxWidth: DOMDimensions.colWidth }}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                            {/* @ts-ignore */}
                            <tr className={table.getRowModel().rows[i].original.id === openedString? 'contents' : 'hidden'}>
                                <td className="bg-sky-50" colSpan={columns.length}>
                                    <div className="flex flex-col w-full h-full py-4 px-12">
                                        <p className="w-fit border-b-2 border-b-blue-900 px-2 pb-2 mb-6 relative before:absolute -translate-x-2 before:inset-y-full before:inset-x-2/4 before:-translate-x-1/4 before:border-8 before:border-transparent before:border-t-green-950 after:absolute after:inset-y-full after:inset-x-2/4 after:border-4 after:border-transparent after:border-t-sky-100">Summary</p>
                                        <div className="flex flex-row gap-2">
                                            <div className="flex flex-col">
                                                {/* @ts-ignore */}
                                                <InfoSection section={DETAILS} data={table.getRowModel().rows[i].original}/>
                                                {/* @ts-ignore */}
                                                <InfoSection section={GRANTORS} data={table.getRowModel().rows[i].original}/>
                                                {/* @ts-ignore */}
                                                <InfoSection section={SECURED_PARTIES} data={table.getRowModel().rows[i].original}/>
                                            </div>
                                            <div className="UsersTable__BoxInfo">
                                                {/* @ts-ignore */}
                                                <InfoSection section={COLLATERAL} data={table.getRowModel().rows[i].original}/>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </Fragment>
                    )
                ) : (
                    <tr className="text-center text-2xl font-bold text-gray-300">
                        <td colSpan={8}>No matches</td>
                    </tr>
                )}
                </tbody>

                <tfoot>
                    <tr className="bg-slate-100">
                        <td colSpan={columns.length}>
                            <div className="grid grid-cols-4 w-full flex-nowrap justify-between py-0.5 px-4">
                                <div className="flex col-span-2 align-middle flex-nowrap">
                                    <span className="mr-1 font-medium text-sm whitespace-nowrap">Go to page</span>
                                    <input value={inputPage !== null ? inputPage : ''} type="text" className="border border-gray-200 rounded mr-2 px-2 text-gray-500 w-14 focus-visible:outline-sky-600" onKeyDown={handleInputSetPage} onChange={handleChangeInputSetPage}/>
                                    <div className="flex-1 overflow-hidden h-full w-full" ref={paginationWrapper}>
                                        {table.getPageCount() > 1 &&
                                            <div className="flex flex-nowrap w-fit" ref={paginationButtonsContainer}>
                                                <button
                                                    className={`bg-white px-2 rounded-l h-full border border-gray-200 font-medium text-sm ${currentPage === 0 ? 'text-gray-500 cursor-default' : 'text-sky-600 hover:bg-gray-100'}`}
                                                    onClick={handlePrevPage}>Previous</button>
                                                {DOMDimensions?.isShortPagination ? (
                                                    currentPage === 0 || currentPage === table.getPageCount() - 1 ?
                                                        (
                                                            <>
                                                                <button className={`${currentPage === 0 ? 'bg-sky-600 border-sky-600 text-white' : 'text-sky-600 hover:bg-gray-100 hover:bg-sky-600'} px-2 h-full border font-medium text-sm`} onClick={() => setPage(0)}>{0}</button>
                                                                <div className="flex flex-shrink-0 bg-white h-full w-6 px-2">...</div>
                                                                <button className={`${currentPage === table.getPageCount() - 1 ? 'bg-sky-600 border-sky-600 text-white' : 'text-sky-600 hover:bg-gray-100 hover:bg-sky-600'} px-2 h-full border font-medium text-sm`} onClick={() => setPage(table.getPageCount() - 1)}>{table.getPageCount() - 1}</button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="flex flex-shrink-0 bg-white h-full w-6 px-2">...</div>
                                                                <button className={`px-2 h-full border border-gray-200 text-sky-600 bg-sky-600 font-medium text-sm hover:bg-gray-100 'bg-sky-600 text-white border-sky-600 hover:bg-sky-600`}>{currentPage}</button>
                                                                <div className="flex flex-shrink-0 bg-white h-full w-6 px-2">...</div>
                                                            </>
                                                        )
                                                ) : (
                                                    generateArray(table.getPageCount())?.map(page =>
                                                        <button key={page} className={`px-2 h-full border border-gray-200 text-sky-600 font-medium text-sm hover:bg-gray-100 ${currentPage === page ? 'bg-sky-600 text-white border-sky-600 hover:bg-sky-600': 'bg-white'}`} onClick={() => setPage(page)}>{page + 1}</button>
                                                    )
                                                )}
                                                <button className={`bg-white px-2 rounded-r h-full border border-gray-200 font-medium text-sm ${currentPage === table.getPageCount() - 1 ? 'text-gray-500 cursor-default' : 'text-sky-600 hover:bg-gray-100'}`} onClick={handleNextPage}>Next</button>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="flex col-span-1 gap-2 whitespace-nowrap">
                                    Items per page
                                    <select className="bg-white h-full px-1 rounded-sm border border-gray-300 focus-visible:outline-sky-600" defaultValue={pageSize} onChange={(e) => handleChange(e)}>
                                        <option value="10">10</option>
                                        <option value="30">30</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                </div>
                                <div className="flex justify-end col-span-1 flex-nowrap whitespace-nowrap">{filteredData?.length ? currentPage * pageSize + 1 : 0} - {currentPage * pageSize + pageSize < filteredData.length ? currentPage * pageSize + pageSize : filteredData.length} of {filteredData.length}</div>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

export default Table
