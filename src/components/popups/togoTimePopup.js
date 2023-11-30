import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TogoTimePickerWrapper, TogoWrapper } from '../../styles/popup/togoPopupStype';
import { LANGUAGE, LANGUAGE_LIST } from '../../resources/strings';
import { PopupBottomButtonBlack, PopupBottomButtonText, PopupBottomButtonWrapper, PopupSubtitleText, PopupTitleText, PopupTitleWrapper } from '../../styles/common/coreStyle';
import DatePicker from 'react-native-date-picker'
import { TouchableWithoutFeedback, View } from 'react-native';
import { setPopupVisibility } from '../../store/popup';
import { numberPad, openPopup } from '../../utils/common';
import { setOrderList } from '../../store/order';

const TogoPopup = (props) =>{
    const dispatch = useDispatch();
    const {language} = useSelector(state=>state.languages);
    const {orderList} = useSelector(state=>state.order);
    const [timeSelected, setTimeSelected] = useState("");
    
    const param = props?.param;
    // 1009, 1002
    function onComplete () {
        const index = param?.index;
        let tmpOrdList = [...orderList];
        /* 
        let itemAdditiveGroupList = tmpOrdList[0].ADDITIVE_GROUP_LIST;
        let togoAdditiveGroup = itemAdditiveGroupList.filter(el=>el.ADDITIVE_GROUP_CODE == "1009");
        console.log("togoAdditive: ",togoAdditiveGroup[0]);
        let togoAdditiveList = togoAdditiveGroup[0].ADDITIVE_ITEM_LIST;
        */
       const additiveData = {"menuOptionGroupCode": "1009", "menuOptionSelected": {
            "ADDITIVE_ID": '1002',
            "ADDITIVE_NAME": '포장',
            "RULE_ID": '1009',
            "ADDITIVE_PRICE": "0",
            "ADDITIVE_CNT": "1"
        }}
        var additiveList = Object.assign([], tmpOrdList[index].ADDITIVE_ITEM_LIST);
        additiveList.push(additiveData);
         
        tmpOrdList[index] = {...tmpOrdList[index],  ADDITIVE_ITEM_LIST:additiveList};
        dispatch(setOrderList(tmpOrdList))
        openPopup(dispatch,{innerView:"", isPopupVisible:false}); 
    }

    return(
        <>
            <TogoWrapper>
                <PopupTitleWrapper>
                    <PopupTitleText>{LANGUAGE[language]?.togoView.title}</PopupTitleText>
                </PopupTitleWrapper>
                <TogoTimePickerWrapper>
                    <DatePicker mode={"time"} date={new Date()} androidVariant='nativeAndroid' is24hourSource="locale" onDateChange={(time)=>{ setTimeSelected(numberPad(time.getHours(),2)+":"+numberPad(time.getMinutes(),2));  }} />
                </TogoTimePickerWrapper>
                <View style={{marginTop:45}} />
                <PopupBottomButtonWrapper>
                    <TouchableWithoutFeedback onPress={()=>{ onComplete(); /* dispatch(setPopupVisibility({isPopupVisible:false})); */ }}>
                        <PopupBottomButtonBlack>
                            <PopupBottomButtonText>{LANGUAGE[language]?.popup.okTitle}</PopupBottomButtonText>
                        </PopupBottomButtonBlack>
                    </TouchableWithoutFeedback>
                </PopupBottomButtonWrapper>
            </TogoWrapper>
        </>
    )
}
export default TogoPopup;