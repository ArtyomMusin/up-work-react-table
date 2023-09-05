// mini etc
interface IDate {
    getDate: () => {}
    getMonth: () => {}
    getFullYear: () => {}
    getHours: () => {}
    getMinutes: () => {}
}

export const dateFormatting = (value: string): string => {
    return value.length === 1 ? `0${value}` : value
}

export const getDate = (data: (string | number)): string => {
    const date: IDate = new Date(data)
    const dateArray = [date.getDate(), date.getMonth(), date.getFullYear()].map(item => dateFormatting(String(item)))
    return dateArray.join('/')
}
export const getTime = (data: string | number): string => {
    const date: IDate = new Date(data)
    const timeArray = [date.getHours(), date.getMinutes()].map(item => dateFormatting(String(item)))
    return timeArray.join(':')
}

export const generateArray = (length: number): number[] => {
    const array = []
    for (let i = 0; i < length; i++) {
        array.push(i)
    }
    return array
}
