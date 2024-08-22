import cls from './Cell.module.scss'

interface CellProps {
    value: string | number
    isMinValue?: boolean
}

const Cell = ({value, isMinValue}: CellProps) => {
    return (
        <div className={`${cls.Cell} ${isMinValue && cls.minValueCell}`}>
            {value}
        </div>
    )
}

export default Cell