import React, { FC, useState, useEffect } from 'react'
import { GRANTORS, SECURED_PARTIES } from '../etc/vars'
import { IUser, TypeInfoSectionData } from '../etc/types'
import dataGenerate from '../etc/dataGenerate'
import InfoCard from './InfoCard'

interface IProps{
    section: string
    data: IUser
}

const InfoSection: FC<IProps> = ({ section, data }) => {
    const [state, setState] = useState<Array<TypeInfoSectionData[] | TypeInfoSectionData> | null>(null)

    useEffect(() => {
        setState(dataGenerate(section, data))
    }, [section, data])

    return (
        state &&
            <>
                <h5 className="text-lg mb-3 font-medium">{section}</h5>
                {section === GRANTORS || section === SECURED_PARTIES ? (
                    state.map(item =>
                        // @ts-ignore
                        <InfoCard key={Math.random()} data={item}/>
                    )
                ) : (
                    // @ts-ignore
                    <InfoCard data={state}/>
                )}
            </>
    )
}

export default InfoSection
