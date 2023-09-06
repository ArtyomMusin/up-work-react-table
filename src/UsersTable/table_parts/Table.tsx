import React, { FC, useEffect, useState, useRef, Fragment } from 'react'
import { useReactTable, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel } from '@tanstack/react-table'
import { IUser, IDOMDimensions, TypeSorting } from '../etc/types'
import { generateArray } from '../etc/utils'
import { DETAILS, GRANTORS, SECURED_PARTIES, COLLATERAL } from '../etc/vars'
import InfoSection from './InfoSection'
import Filter from './Filter'

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

    const filters = [
        {
            name: 'Collateral',
            field: 'collateralSummary',
            handler: (newState: string[]) => setFilteredByCollateral(newState)
        },
        {
            name: 'Secured Parties',
            field: 'securedPartySummary',
            handler: (newState: string[]) => setFilteredBySecuredParties(newState)
        },
        {
            name: 'Grantors',
            field: 'grantorSummary',
            handler: (newState: string[]) => setFilteredByGrantors(newState)
        }
    ]


    return (
        <div className="flex relative text-green-900" ref={wrapper}>
            <div className={`${filtersIsOpen  ? 'z-40 bg-green-100 before:visible after:visible' : 'before:hidden after:hidden z-10'} absolute flex flex-nowrap items-center left-0 -translate-y-full text-green-800 rounded-t pb-2 border border-green-700 border-b-0 pt-0.5 px-3 text-sm whitespace-nowrap select-none hover:bg-green-100 hover:cursor-pointer before:absolute before:right-0 before:bottom-0 before:-translate-y-1.5 before:h-1/2 before:w-4 before:bg-green-100 before:translate-x-full after:absolute after:right-0 after:bottom-0 after:-translate-y-1.5 after:h-1/2 after:w-4 after:bg-white after:translate-x-full after:border after:border-r-0 after:border-t-0 after:border-green-700 after:z-50 after:rounded-bl`} style={{ top: '0.4rem' }} id="filter-label" onClick={handleToggleShowFilters}>
                Filters
                <svg className="w-3 h-3 ml-1 translate-y-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.2673 6.24223C2.20553 4.40955 3.50184 1 6.26039 1H17.7396C20.4981 1 21.7945 4.40955 19.7327 6.24223L15.3356 10.1507C15.1221 10.3405 15 10.6125 15 10.8981V21.0858C15 22.8676 12.8457 23.7599 11.5858 22.5L9.58578 20.5C9.21071 20.1249 8.99999 19.6162 8.99999 19.0858V10.8981C8.99999 10.6125 8.87785 10.3405 8.66436 10.1507L4.2673 6.24223ZM6.26039 3C5.34088 3 4.90877 4.13652 5.59603 4.74741L9.99309 8.6559C10.6336 9.22521 11 10.0412 11 10.8981V19.0858L13 21.0858V10.8981C13 10.0412 13.3664 9.22521 14.0069 8.6559L18.404 4.74741C19.0912 4.13652 18.6591 3 17.7396 3H6.26039Z" fill="#22272A"/>
                </svg>
            </div>
            <Filter data={data} filters={filters} filtersIsOpen={filtersIsOpen}/>
            <div className="w-full h-full border border-green-700 rounded-lg z-30 overflow-hidden">
                <table className="w-full table-auto">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup =>
                            <tr key={headerGroup.id} className="bg-green-200" ref={headerRow}>
                                {headerGroup.headers.map(header =>
                                    <th key={header.id} className="relative border border-b-green-700 border-r-green-700 last:border-r-0 py-1.5 px-4 text-left text-ellipsis w-auto overflow-hidden whitespace-nowrap first:text-center" style={{ maxWidth: DOMDimensions.colWidth }}>
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
                                        <td key={cell.id} className={`${table.getRowModel().rows[i].original.id === openedString && j === 1? 'bg-green-50 border-b-0' : 'bg-white'} border border-b-green-700 border-r-green-700 last:border-r-0 py-1.5 px-4 text-left text-ellipsis w-auto overflow-hidden whitespace-nowrap hover:whitespace-pre-wrap first:text-center`} style={{ maxWidth: DOMDimensions.colWidth }}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                                {/* @ts-ignore */}
                                <tr className={table.getRowModel().rows[i].original.id === openedString? 'contents' : 'hidden'}>
                                    <td className="bg-green-50" colSpan={columns.length}>
                                        <div className="flex flex-col w-full h-full py-4 px-12">
                                            <p className="w-fit border-b-2 border-b-blue-900 px-2 pb-2 mb-6 relative before:absolute -translate-x-2 before:inset-y-full before:inset-x-2/4 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-t-green-900 after:absolute after:inset-y-full after:inset-x-2/4 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-green-100">Info</p>
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
                        <tr className="bg-green-100">
                            <td colSpan={columns.length}>
                                <div className="grid grid-cols-4 w-full flex-nowrap justify-between py-0.5 px-4">
                                    <div className="flex col-span-2 align-middle flex-nowrap">
                                        <span className="mr-1 font-medium text-sm whitespace-nowrap">Go to page</span>
                                        <input value={inputPage !== null ? inputPage : ''} type="text" className="border border-green-500 rounded mr-2 px-2 text-gray-500 w-14 focus-visible:outline-green-700" onKeyDown={handleInputSetPage} onChange={handleChangeInputSetPage}/>
                                        <div className="flex-1 overflow-hidden h-full w-full" ref={paginationWrapper}>
                                            {table.getPageCount() > 1 &&
                                                <div className="flex flex-nowrap w-fit overflow-hidden" ref={paginationButtonsContainer}>
                                                    <button
                                                        className={`bg-white px-2 h-full select-none border border-green-500 rounded-l pb-0.5 font-medium text-sm ${currentPage === 0 ? 'text-gray-500 cursor-default' : 'text-green-900 hover:bg-green-100'}`}
                                                        onClick={handlePrevPage}>Previous</button>
                                                    {DOMDimensions?.isShortPagination ? (
                                                        currentPage === 0 || currentPage === table.getPageCount() - 1 ?
                                                            (
                                                                <>
                                                                    <button className={`${currentPage === 0 ? 'bg-green-900 text-white bg-green-900 border-green-900' : 'text-green-900 bg-white hover:bg-green-700'} text-green-900 px-2 pb-0.5 h-full select-none border border-green-500 font-medium text-sm`} onClick={() => setPage(0)}>{1}</button>
                                                                    <p className="flex justify-center align-bottom text-sm border border-green-500 select-none flex-shrink-0 bg-white w-6">...</p>
                                                                    <button className={`${currentPage === table.getPageCount() - 1 ? 'bg-green-900 border-green-900 text-white' : 'text-green-900 bg-white hover:bg-green-300'} px-2 pb-0.5 select-none h-full border border-green-500 font-medium text-sm`} onClick={() => setPage(table.getPageCount() - 1)}>{table.getPageCount() - 1}</button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <p className="flex justify-center align-bottom text-sm border border-green-500 select-none flex-shrink-0 bg-white w-6">...</p>
                                                                    <button className={`px-2 pb-0.5 h-full select-none border border-green-500 font-medium text-sm bg-green-900 border-green-900 text-white`}>{currentPage + 1}</button>
                                                                    <p className="flex justify-center align-bottom text-sm border border-green-500 select-none flex-shrink-0 bg-white w-6">...</p>
                                                                </>
                                                            )
                                                    ) : (
                                                        generateArray(table.getPageCount())?.map(page =>
                                                            <button key={page} className={`px-2 h-full pb-0.5 border border-green-500 text-green-900 font-medium text-sm hover:bg-green-100 ${currentPage === page ? 'bg-green-900 text-white border-green-900 hover:bg-green-900': 'bg-white'}`} onClick={() => setPage(page)}>{page + 1}</button>
                                                        )
                                                    )}
                                                    <button className={`bg-white px-2 h-full select-none border border-green-500 rounded-r pb-0.5 font-medium text-sm ${currentPage === table.getPageCount() - 1 ? 'text-gray-500 cursor-default' : 'text-green-900 hover:bg-green-100'}`} onClick={handleNextPage}>Next</button>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="flex col-span-1 gap-2 whitespace-nowrap">
                                        Items per page
                                        <select className="bg-white h-full px-1 rounded border border-green-500 focus-visible:outline-green-700" defaultValue={pageSize} onChange={(e) => handleChange(e)}>
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
        </div>
    )
}

export default Table
