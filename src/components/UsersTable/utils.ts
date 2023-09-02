// mini utils
interface Date {
    getDate: () => {}
    getMonth: () => {}
    getFullYear: () => {}
    getHours: () => {}
    getMinutes: () => {}
}

export const dateFormatting = (value: string) => {
    return value.length === 1 ? `0${value}` : value
}

export const getDate = (data: string) => {
    const date: Date = new Date(data)
    const dateArray = [date.getDate(), date.getMonth(), date.getFullYear()].map(item => dateFormatting(String(item)))
    return dateArray.join('/')
}
export const getTime = (data: string) => {
    const date: Date = new Date(data)
    const timeArray = [date.getHours(), date.getMinutes()].map(item => dateFormatting(String(item)))
    return timeArray.join(':')
}
