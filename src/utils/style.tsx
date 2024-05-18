import { StylesConfig } from "react-select";

export type SelectOption = {
    value: string;
    label: string;
};

export const customStyles: StylesConfig<any> = {
    control: (styles, state) => {
        let borderColor = 'rgba(229,231,235,1)'
        if (state.isFocused) borderColor = 'rgba(168,85,247,1)'
        if (state.menuIsOpen) borderColor = 'rgba(168,85,247,1)'

        return ({
            ...styles, backgroundColor: 'white', borderColor, borderRadius: "0.75rem", '&:hover': {
                borderColor: 'rgba(168,85,247,1)'
            },
            
        });
    },
};
export const colourStyles: StylesConfig<SelectOption> = {
    control: (styles, state) => {
        let borderColor = 'rgba(229,231,235,1)'
        if (state.isFocused) borderColor = 'rgba(168,85,247,1)'
        if (state.menuIsOpen) borderColor = 'rgba(168,85,247,1)'

        return ({
            ...styles, backgroundColor: 'white', borderColor, borderRadius: "0.75rem", '&:hover': {
                borderColor: 'rgba(168,85,247,1)'
            },
            
        });
    },
    menu: provided => ({ ...provided, zIndex: 9999 })

};
export const multiColourStyles: StylesConfig<SelectOption> = {
    control: (styles, state) => {
        let borderColor = 'rgba(229,231,235,1)'
        if (state.isFocused) borderColor = 'rgba(168,85,247,1)'
        if (state.menuIsOpen) borderColor = 'rgba(168,85,247,1)'
        return ({
            ...styles, backgroundColor: 'white', borderColor, borderRadius: "0.75rem", '&:hover': {
                borderColor: 'rgba(168,85,247,1)'
            },
            
        });
    },
    menu: provided => ({ ...provided, zIndex: 9999 })

};
