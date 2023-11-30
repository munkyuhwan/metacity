import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openPopup } from "../../utils/common";
import { ErrorTitle, ErrorWrapper } from "../../styles/common/errorStyle";

const OrderCompletePopup = () => {

    const dispatch = useDispatch();
    const {popupMsg} = useSelector(state=>state.popup);

    useState(()=>{
        const to = setInterval(() => {
            clearInterval(to);
            openPopup(dispatch,{innerView:"", isPopupVisible:false});
        }, 3000);
    },[])

    return(
        <>
            <ErrorTitle>주문이 완료되었습니다.</ErrorTitle>
        </>
    )
}
export default OrderCompletePopup;