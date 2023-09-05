import React, { FC, Fragment } from 'react'
import { TypeInfoSectionData } from '../etc/types'

interface IProps {
    data: Array<TypeInfoSectionData>
}

const InfoCard: FC<IProps> = ({ data }) => {
    return (
        <div className="w-full text-gray-600 font-medium mb-5">
            <div className="w-full grid border-2 border-indigo-100 rounded p-4 gap-x-2" style={{ gridTemplateColumns: '1fr 3fr' }}>
                {data.map(item =>
                    <Fragment key={item.name}>
                        <div className="whitespace-nowrap">{item.name}:&nbsp;</div>
                        <div>{item.value}</div>
                    </Fragment>
                )}
            </div>
        </div>
    )
}

export default InfoCard
