import { StylesConfig } from "react-select";

export type SelectOption = {
    value: string;
    label: string;
};
export interface TreeNode {
    value: string | undefined;
    label: React.ReactNode;
    children?: TreeNode[];
    data?: any
}
export const customStyles: StylesConfig<any> = {
    control: (styles, state) => {
        let borderColor = 'rgba(229,231,235,1)'
        if (state.isFocused) borderColor = '#3498ff'
        if (state.menuIsOpen) borderColor = '#3498ff'

        return ({
            ...styles, backgroundColor: 'white', borderColor, borderRadius: "0.75rem", '&:hover': {
                borderColor: '#3498ff'
            },
            
        });
    },
};
export const colourStyles: StylesConfig<SelectOption> = {
    control: (styles, state) => {
        let borderColor = 'rgba(229,231,235,1)'
        if (state.isFocused) borderColor = '#3498ff'
        if (state.menuIsOpen) borderColor = '#3498ff'

        return ({
            ...styles, backgroundColor: 'white', borderColor, borderRadius: "0.75rem", '&:hover': {
                borderColor: '#3498ff'
            },
            
        });
    },
    menu: provided => ({ ...provided, zIndex: 9999 })

};
export const multiColourStyles: StylesConfig<SelectOption> = {
    control: (styles, state) => {
        let borderColor = 'rgba(229,231,235,1)'
        if (state.isFocused) borderColor = '#3498ff'
        if (state.menuIsOpen) borderColor = '#3498ff'
        return ({
            ...styles, backgroundColor: 'white', borderColor, borderRadius: "0.75rem", '&:hover': {
                borderColor: '#3498ff'
            },
            
        });
    },
    menu: provided => ({ ...provided, zIndex: 9999 })

};
