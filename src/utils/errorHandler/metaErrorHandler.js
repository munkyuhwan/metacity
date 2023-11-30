import { POS_SUCCESS_CD } from "../../resources/apiResources";
import { setErrorData } from "../../store/error";
import { openPopup } from "../common";


export const metaErrorHandler = (dispatch, response) => {
    const ERROR_CD = response?.ERROR_CD;
    const ERROR_MSG = response?.ERROR_MSG;

    if(ERROR_CD == POS_SUCCESS_CD) {
        return true;
    }else {
        displayErrorPopup(data.ERRCODE,data.MSG+`\n${data.MSG2}`);
        return false;
    }
}
export const displayErrorPopup = (dispatch, errCode, msg) => {
    dispatch(setErrorData({errorCode:errCode,errorMsg:msg})); 
    openPopup(dispatch,{innerView:"AutoClose", isPopupVisible:true,param:{msg:msg}});   
}