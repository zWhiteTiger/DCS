import React from "react"
import { NavLink } from "react-router-dom"

export const MyNavLink = React.forwardRef<any, any>((props, ref) => (
    <div style={{ overflow: 'hidden' }}> {/* Apply overflow: hidden to the container */}
        <NavLink
            ref={ref}
            to={props.to}
            className={({ isActive }) =>
                `${props.className} ${isActive ? "bg-[#4318FF] duration-300 rounded-l-lg mx-5 max-w-[300px]" : ""}`
            }
        >
            {props.children}
        </NavLink>
    </div>
))