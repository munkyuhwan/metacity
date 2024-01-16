import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openPopup } from "../../utils/common";
import { ErrorTitle, ErrorWrapper } from "../../styles/common/errorStyle";

const AutoClosePopup = () => {

    const dispatch = useDispatch();
    const {popupMsg, param} = useSelector(state=>state.popup);
    useState(()=>{
        const to = setInterval(() => {
            clearInterval(to);
            openPopup(dispatch,{innerView:"", isPopupVisible:false});
        }, 7000);
    },[])

    return(
        <>
            {param?.msg &&
                <ErrorTitle>{param?.msg}</ErrorTitle>
            }
        </>
    )
}
export default AutoClosePopup;