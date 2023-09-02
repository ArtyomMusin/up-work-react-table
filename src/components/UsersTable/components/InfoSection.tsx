import {FC, useState, useEffect} from 'react'
import'./InfoSection.css'
import {GRANTORS, SECURED_PARTIES} from '../vars.ts'
import dataGenerate from '../dataGenerate.ts'
import InfoCard from './InfoCard.tsx'

interface IProps{
    section: string
    data: object
}

interface IState{
    name: string
    entities: object
}

const InfoSection: FC<IProps> = ({ section, data }) => {
    const [state, setState] = useState<IState | null>(null)

    useEffect(() => {
        setState(dataGenerate(section, data))
    }, [])

    return (
        state &&
            <>
                <h5 className="InfoSection__Title">{section}</h5>
                {section === GRANTORS || section === SECURED_PARTIES ? (
                    state.map(item =>
                        <InfoCard key={Math.random()} data={item}/>
                    )
                ) : (
                    <InfoCard data={state}/>
                )}
            </>
    )
}

export default InfoSection
