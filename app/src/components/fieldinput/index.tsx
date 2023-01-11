import { CloseCircleFilled, EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import React, { useState } from 'react';

export interface FieldInputProps {
    value: string;
    name: string;
    placeholder: string;
    type: React.HTMLInputTypeAttribute;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}
export type FieldInputType = React.FC<Partial<FieldInputProps>>

const FieldInput= React.forwardRef((props: Partial<FieldInputProps>, ref: React.Ref<HTMLInputElement> | undefined) => {
    return (
    <input
        ref={ref}
        name={props.name}
        className="bg-evergreen-60 w-96 my-4 text-xl py-2 px-4 rounded-lg" 
        type={props.type} 
        value={props.value} 
        onChange={props.onChange}
        placeholder={props.placeholder}/>);
});

export interface FieldInputGadgetProperties {
    location: "right" | "left";
}


export const VisibilityFieldInput = (props: Partial<FieldInputProps>) => {
        const [visible, setVisibility] = useState<boolean>(false);
        const currentVisibility = visible ? "text" : "password";
        const toggleVisibility = () => {
            setVisibility(visible => !visible);
        }
        return (
        <div className="relative flex items-center">
            <FieldInput 
                {...props} 
                type={currentVisibility} />
            <div className="absolute right-2 text-evergreen-100">
                <div onClick={toggleVisibility}>
                    {visible ? <EyeInvisibleFilled /> : <EyeFilled />}
                </div>
            </div>
        </div>);
    };

    export const ClearableFieldInput = (props: Partial<FieldInputProps>) => {
        const [value, setValue] = useState("");

        return (
        <div className="relative flex items-center">
            <FieldInput 
                {...props} 
                value={value}
                onChange={e => setValue(e.currentTarget.value)}  />
                <div className="absolute right-2">
                {value&&<div className="text-evergreen-100" onClick={() => {
                    setValue("");
                }}>
                    <CloseCircleFilled />
                </div>}
            </div>
        </div>);
    };
export default FieldInput;