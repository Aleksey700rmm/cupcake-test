// файл с глобальной декаларацией типов чтобы тс не ругался напрмер на импортируемую переменную когда используешь css модули

declare module '*.scss' {
    interface IClassNames {
      [className: string]: string
    }
    const classNames: IClassNames;
    export = classNames;
}

