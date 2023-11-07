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
    areAssetsSubjectToControl?: boolean | null
    areProceedsClaimed?: boolean | null
    changeNumber: number
    collateralClassType: string
    collateralDescription: string
    collateralSummary: string
    collateralType: string
    givingOfNoticeIdentifier: string
    grantorSummary: string
    grantors: Array<TypeOrganisationGrantor & TypeIndividualGrantor>
    hasAttachment: boolean
    isInventory?: boolean | null
    isPmsi?: boolean | null
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
    updatedAt: string
    searchRequestId: string
    isInventory: boolean | null
    linkedPpsrRegistrationNumber: null
    manufacturersModel: null
    manufacturersName: null
    rawData: IRowData
    registrationEndTimeString: string
    type: string
    serialNumber: string | number | null
    serialNumberType: string | number | null
    vehicleDescriptiveText: string | null
    vehicleRegistrationNumber: string | number | null
    "udf1": string | number | null
    "udf2": string | number | null
    "udf3": string | number | null
    "udf4": string | number | null
    "udf5": string | number | null
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
