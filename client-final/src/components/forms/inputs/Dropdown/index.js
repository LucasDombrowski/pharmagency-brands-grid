import ReactSelect, { components } from "react-select";

// Custom NoOptionsMessage component
const CustomNoOptionsMessage = ({ innerRef, children, ...props }) => (
    <components.NoOptionsMessage {...props}>
        <div ref={innerRef}>
            {children}
        </div>
    </components.NoOptionsMessage>
);

export default function Dropdown({ options, placeholder, value = null, onChange, onInputChange = () => { }, noOptionsComponent = null, className, inputValue }) {
    return (
        <ReactSelect
            options={options}
            placeholder={placeholder}
            value={value}
            className={className}
            onChange={(selectedOption) => {
                onChange(selectedOption.value);
            }}
            onInputChange={onInputChange}
            inputValue={inputValue}
            components={{
                NoOptionsMessage: (innerProps) => (
                    <CustomNoOptionsMessage {...innerProps}>
                        {noOptionsComponent ? noOptionsComponent : <p>Pas d'options disponibles</p>}
                    </CustomNoOptionsMessage>
                )
            }}
        />
    );
}
