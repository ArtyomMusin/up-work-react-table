import React, {FC, ReactElement, useEffect, useState} from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import { IUser, TypeSort } from './etc/types'
import { getDate, getTime } from './etc/utils'
import Table from './table_parts/Table'

interface IProps {
    data: IUser[]
}

const UsersTable: FC<IProps> = ({ data }): ReactElement => {
    const [openedString, setOpenedString] = useState<string | null>(null)

    const registrationHeader = (header: object): ReactElement => {
        const ascStyles: string = 'before:absolute before:-right-3 before:top-1 before:border-4 before:border-transparent before:border-b-4 before:border-b-green-900'
        const descStyles: string = 'after:absolute after:-right-3 after:top-3.5 after:border-4 after:border-transparent after:border-t-4 after:border-t-green-900'
        const sortClasses:TypeSort = {
            asc: ascStyles,
            desc: descStyles
        }
        type TypeSortDirection = string | boolean
        // @ts-ignore
        const sortDirection:TypeSortDirection = header.column.getIsSorted() as TypeSortDirection
        // @ts-ignore
        const classNames = typeof sortDirection === 'string' ? sortClasses[sortDirection] : `${ascStyles} ${descStyles}`
        return (
            // @ts-ignore
            <span className={`relative hover:cursor-pointer ${classNames}`} onClick={header.column.getToggleSortingHandler()}>Registration Date<sup
                className="text-xs inline-block pl-1 pr-2 -translate-y-1 translate-x-0.5"
                style={{fontSize: '0.6rem'}}>AU</sup>
                <svg className="absolute w-3 h-3 right-0 bottom-0 -translate-x-px" xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" fill="opacity"/>
                    <circle cx="12" cy="12" r="9" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth="2px"/>
                    <path d="M12 6V12L7.5 16.5" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </span>
        )
    }

    const headerWrapper = (content: string, header: object): ReactElement => {
        const ascStyles:string = 'before:absolute before:right-2.5 before:top-2.5 before:border-4 before:border-transparent before:border-b-4 before:border-b-green-900'
        const descStyles:string = 'after:absolute after:right-2.5 after:top-5 after:border-4 after:border-transparent after:border-t-4 after:border-t-green-900'
        const sortClasses:TypeSort = {
            asc: ascStyles,
            desc: descStyles
        }
        type TypeSortDirection = string | boolean
        // @ts-ignore
        const sortDirection:TypeSortDirection = header.column.getIsSorted() as TypeSortDirection
        // @ts-ignore
        return <span className={`hover:cursor-pointer pl-1 pr-2 ${typeof sortDirection === 'string' ? sortClasses[sortDirection as keyof string] : `${ascStyles} ${descStyles}`}`} onClick={header.column.getToggleSortingHandler()}>{content}</span>
    }

    const columnHelper = createColumnHelper<IUser>()

    const columns = [
        columnHelper.display({
            header: '#',
            cell: info => info.row.index + 1
        }),
        columnHelper.display({
            id: 'more',
            header: '',
            cell: info => <span className={`inline-flex justify-center items-center w-3 h-4 hover:cursor-pointer transition-all duration-200 ease-linear ${info.row.original.id === openedString ? 'rotate-90 -translate-y-0.5 -translate-x-0.5' : '-translate-y-0.5'}`} onClick={() => setOpenedString(prevState => prevState === info.row.original.id ? null : info.row.original.id)}><i className="block w-2 h-0.5 bg-green-900 rotate-45  translate-x-1 -translate-y-1"></i><i  className="block w-2 h-0.5 bg-green-900 -rotate-45 -translate-x-0.5"></i></span>
        }),
        columnHelper.accessor('registrationNumber', {
            header: props => headerWrapper('Registration #', props.header),
            cell: info => info.getValue()
        }),
        columnHelper.accessor('registrationStartTime', {
            header: props => registrationHeader(props.header),
            cell: info => getDate(info.getValue())
        }),
        columnHelper.accessor('registrationEndTime', {
            header: props => headerWrapper('Expiry Date', props.header),
            cell: info => `${getDate(info.getValue())} ${getTime(info.getValue())}`,
        }),
        columnHelper.accessor('collateralSummary', {
            header: props => headerWrapper('Collateral', props.header),
            cell: info => info.getValue()
        }),
        columnHelper.accessor('securedPartySummary', {
            header: props => headerWrapper('Secured Parties', props.header),
            cell: info => info.getValue()
        }),
        columnHelper.accessor('grantorSummary', {
            header: props => headerWrapper('Grantors', props.header),
            cell: info => info.getValue()
        }),
    ]

    return (
        data?.length ? (
            <Table data={data} columns={columns} openedString={openedString} />
        ) : (
            <div className="flex w-full h-full items-center justify-center">
                <h1>Loading...</h1>
            </div>
        )
    )
}

export default UsersTable
