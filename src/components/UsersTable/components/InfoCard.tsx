import {FC, Fragment} from 'react'
import './InfoCard.css'

interface IProps {
    data: [{
        name: string,
        value: string | number
    }]
}

const InfoCard: FC<IProps> = ({ data }) => {
    return (
        <div className="InfoCard">
            <div className="InfoCard__Content">
                {data.map(item =>
                    <Fragment key={item.name}>
                        <div className="InfoCard__Field">{item.name}:&nbsp;</div>
                        <div className="InfoCard__Value">{item.value}</div>
                    </Fragment>
                )}
            </div>
        </div>
    )
}

export default InfoCard
