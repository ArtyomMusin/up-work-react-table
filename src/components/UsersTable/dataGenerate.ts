import { DETAILS, GRANTORS, SECURED_PARTIES, COLLATERAL } from "./vars.ts"
import {getDate, getTime} from "./utils.ts"

type IProps = {
    section: string,
    data: {
        registrationNumber: string
        registrationStartTime: string
        registrationEndTime: string
        changeNumber: number
        collateralSummary: string
        isSubordinate: boolean
        isPmsi: boolean
        proceedsClaimedDescription: string
    }
}

const getField = (name, value) => ({ name, value: value || '-' })
const dataGenerate = (section, data): IProps => {
    let entities: object[] = []
    switch (section) {
        case DETAILS:
            entities.push(getField('Registration Number', data.registrationNumber))
            entities.push(getField('Registration Date', `${getDate(data.registrationStartTime)} ${getTime(data.registrationStartTime)}`))
            entities.push(getField('Expiry Date', `${getDate(data.registrationEndTime)} ${getTime(data.registrationEndTime)}`))
            entities.push(getField('Change Number', data.changeNumber))
            break
        case GRANTORS:
            entities = data.grantors.map(grantor => grantor.grantorType === 'Individual'
                ? ([
                    getField('Type', grantor?.grantorType),
                    getField('Name', `${grantor.individualGivenNames} ${grantor?.individualFamilyName}`)
                ]) : ([
                    getField('Organisation', grantor?.organisationName),
                    getField('ACN', grantor?.organisationNumber)
                ]))
            break
        case SECURED_PARTIES:
            entities = data.securedParties
                .map(part => part.securedPartyType === 'Individual' ? ([
                    getField('Type', part?.securedPartyType),
                    getField('Name', `${part.individualGivenNames} ${part?.individualFamilyName}`)
                ]) : ([
                    getField('Type', part?.securedPartyType),
                    getField('Name', part?.organisationName),
                    getField('ACN', part?.organisationNumber)
                ]))
            break
        case COLLATERAL:
            entities.push(getField('Collateral Type & Class', data.collateralSummary))
            entities.push(getField('Is subordinate', data.isSubordinate ? 'Yes' : 'No'))
            entities.push(getField('Is PMSI', data.isPmsi ? 'Yes' : 'No'))
            entities.push(getField('May be Inventory', data.isInventory ? 'Yes' : 'No'))
            entities.push(getField('Proceeds are claimed', data.isSerialized ? 'Yes' : 'No'))
            entities.push(getField('Proceeds Claimed Description', data.proceedsClaimedDescription))
            entities.push(getField('Collateral Description', data.rawData.collateralDescription))
            break
    }
    return entities
}

export default dataGenerate
