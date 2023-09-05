// data types
export type TypeOrganisationGrantor = {
    grantorType: string
    organisationName: string
    organisationNumber: string
    organisationNumberType: string
}

export type TypeIndividualGrantor = {
    grantorType: string
    individualFamilyName: string
    individualGivenNames: string
}

export type TypeOrganisationSecuredParties = {
    organisationName: string
    organisationNumber: string
    organisationNumberType: string
    securedPartyType: string
}

export type TypeIndividualSecuredParties = {
    individualFamilyName: string
    individualGivenNames: string
    securedPartyType: string
}

interface IRowData {
    areAssetsSubjectToControl: boolean
    areProceedsClaimed: boolean
    changeNumber: number
    collateralClassType: string
    collateralDescription: string
    collateralSummary: string
    collateralType: string
    givingOfNoticeIdentifier: string
    grantorSummary: string
    grantors: Array<TypeOrganisationGrantor & TypeIndividualGrantor>
    hasAttachment: boolean
    isInventory: boolean
    isPmsi: boolean
    isSerialised: boolean
    isSubordinate: boolean
    isTransitional: boolean
    ppsrCloudId: string
    proceedsClaimedDescription: string
    registrationEndTime: string
    registrationNumber: string
    registrationStartTime: string
    searchNumber: string
    securedParties: Array<TypeOrganisationSecuredParties & TypeIndividualSecuredParties>
    securedPartySummary: string
}

export interface IUser extends IRowData {
    aircraftNationality:  null
    aircraftNationalityCodeAndRegistrationMark: null
    attachments: null
    classType: string
    createdAt: string
    description: string
    fileId: null
    id: string
    isInventory: boolean
    linkedPpsrRegistrationNumber: null
    manufacturersModel: null
    manufacturersName: null
    rawData: IRowData
}

// UserTable.tsx
export type TypeTanStackTableHeader = {
    colSpan: number
    depth: number
    getContext: () => {}
    setPageIndex: (page: number) => {}
    setPageSize: (pageSize: number) => {}
    previousPage: () => {}
    nextPage: () => {}
    getPageCount: () => number
    getLeafHeaders: () => {}
    getResizeHandler: () => {}
    getSize: () => {}
    getStart: () => {}
    getHeaderGroups: () => [{
        id: string | number
        headers: [{
            id: string | number
            getContext: () => {}
            column: {
                columnDef: {
                    header: any
                }
            }
        }]
    }]
    getRowModel: () => ({
        rows: [{
            id: string | number
            getVisibleCells: () => ([{
                id: string | number
                column: {
                    columnDef: {
                        cell: any
                    }
                }
                getContext: any
            }])
            original: IUser
        }]

    })
    headerGroup: object
    id: string
    index: number
    isPlaceholder: boolean
    placeholderId: string | number | undefined
    rowSpan: number
    subHeaders: []
    column: {
        getIsSorted: () => {},
        getToggleSortingHandler: () => () => {}
    }
}

export type TypeSort = {
    asc: string
    desc: string
}


// Table.tsx
export type IDOMDimensions = {
    colWidth?: number
    isScrollable?: boolean
    isShortPagination?: boolean
}

export type TypeSorting = {
    desc: boolean
    id: (data: IUser) => string
}

// info row UsersTable
export type TypeInfoSectionData = {
    name: string,
    value: string
}

// generate info
export type TypeDataGenerate = (section: string, data: IUser) => Array<TypeInfoSectionData | TypeInfoSectionData[]>
