import React from "react";

interface ButtonProps {
    value: string;
    classNames: string;
    type: "button" | "submit" | "reset";
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<Partial<ButtonProps>> = (props) => {
    return (
    <button
        className={`${props.classNames ?? ""} py-2 px-10 w-96 rounded-xl text-xl`}
        value={props.value}
        type={props.type}
        onClick={props.onClick}>
            {props.value}
    </button>);
}

export default Button;