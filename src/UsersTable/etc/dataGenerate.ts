import { DETAILS, GRANTORS, SECURED_PARTIES, COLLATERAL } from './vars'
import { getDate, getTime } from './utils'
import { TypeDataGenerate, TypeInfoSectionData } from './types'

const getEntity = (name: string, value: string | number): TypeInfoSectionData => ({ name, value: String(value) || '-' })

const dataGenerate: TypeDataGenerate = (section, data) => {
    let entities: (Array<TypeInfoSectionData | TypeInfoSectionData[]>) = []
    switch (section) {
        case DETAILS:
            entities.push(getEntity('Registration Number', data.registrationNumber))
            entities.push(getEntity('Registration Date', `${getDate(data.registrationStartTime)} ${getTime(data.registrationStartTime)}`))
            entities.push(getEntity('Expiry Date', `${getDate(data.registrationEndTime)} ${getTime(data.registrationEndTime)}`))
            entities.push(getEntity('Change Number', data.changeNumber))
            break
        case GRANTORS:
            entities = data.grantors.map((grantor) => grantor.grantorType === 'Individual'
                ? ([
                    getEntity('Type', grantor?.grantorType),
                    getEntity('Name', `${grantor.individualGivenNames} ${grantor?.individualFamilyName}`)
                ]) : ([
                    getEntity('Organisation', grantor?.organisationName),
                    getEntity('ACN', grantor?.organisationNumber)
                ]))
            break
        case SECURED_PARTIES:
            entities = data.securedParties.map(part => part.securedPartyType === 'Individual' ?
                [
                    getEntity('Type', part?.securedPartyType),
                    getEntity('Name', `${part.individualGivenNames} ${part?.individualFamilyName}`)
                ] : [
                    getEntity('Type', part?.securedPartyType),
                    getEntity('Name', part?.organisationName),
                    getEntity('ACN', part?.organisationNumber)
                ])
            break
        case COLLATERAL:
            entities.push(getEntity('Collateral Type & Class', data.collateralSummary))
            entities.push(getEntity('Is subordinate', data.isSubordinate ? 'Yes' : 'No'))
            entities.push(getEntity('Is PMSI', data.isPmsi ? 'Yes' : 'No'))
            entities.push(getEntity('May be Inventory', data.isInventory ? 'Yes' : 'No'))
            entities.push(getEntity('Proceeds are claimed', data.isSerialised ? 'Yes' : 'No'))
            entities.push(getEntity('Proceeds Claimed Description', data.proceedsClaimedDescription))
            entities.push(getEntity('Collateral Description', data.rawData.collateralDescription))
            break
    }
    return entities
}

export default dataGenerate
