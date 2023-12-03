import React, { useEffect, useState } from 'react'
import { 
    Animated,
    Text,
    TouchableWithoutFeedback
} from 'react-native'
import { CartItemAmtController, CartItemAmtControllerImage, CartItemAmtControllerText, CartItemAmtText, CartItemAmtWrapper, CartItemCancelBtn, CartItemCancelWrapper, CartItemFastImage, CartItemImage, CartItemImageTogoWrapper, CartItemOpts, CartItemPrice, CartItemTitle, CartItemTitlePriceWrapper, CartItemTogoBtn, CartItemTogoIcon, CartItemTogoText, CartItemTogoWrapper, CartItemWrapper, OperandorText } from '../../styles/main/cartStyle';
import { setPopupContent, setPopupVisibility } from '../../store/popup';
import { useDispatch, useSelector } from 'react-redux';
import { numberWithCommas, openPopup } from '../../utils/common';
import { MENU_DATA } from '../../resources/menuData';
import { LANGUAGE } from '../../resources/strings';
import { resetAmtOrderList, setOrderList } from '../../store/order';

const CartListItem = (props) => {
    const dispatch = useDispatch();
    const {language} = useSelector(state=>state.languages);
    const {menuExtra} = useSelector(state=>state.menuExtra);
    const {orderList} = useSelector(state=>state.order);
    // 메뉴 옵션 추가 정보
    const {optionExtra} = useSelector(state=>state.menuExtra);

    const index = props?.index;
    const order = props?.item;
    //console.log("order: ",order)
    const additiveItemList = order?.ADDITIVE_ITEM_LIST;
    // 이미지 찾기
    const itemExtra = menuExtra.filter(el=>el.pos_code == order?.ITEM_CD);
    const ItemTitle = () => {
        let selTitleLanguage = "";
        const selExtra = itemExtra.filter(el=>el.pos_code==order?.ITEM_CD);
        if(language=="korean") {
            selTitleLanguage = order.ITEM_NM;
        }
        else if(language=="japanese") {
            selTitleLanguage = selExtra[0]?.gname_jp||order.ITEM_NM;
        }
        else if(language=="chinese") {
            selTitleLanguage = selExtra[0]?.gname_cn||order.ITEM_NM;
        }
        else if(language=="english") {
            selTitleLanguage = selExtra[0]?.gname_en||order.ITEM_NM;
        }

        return selTitleLanguage;
    }

    const ItemOptionTitle = (additiveId,index) =>{
        let selOptTitleLanguage = "";
        const selExtra = optionExtra.filter(el=>el.pos_code==additiveId);
        if(language=="korean") {
            selOptTitleLanguage = additiveItemList[index]?.menuOptionSelected.ADDITIVE_NAME;
        }
        else if(language=="japanese") {
            selOptTitleLanguage = selExtra[0]?.op_name_jp||additiveItemList[index]?.menuOptionSelected.ADDITIVE_NAME;
        }
        else if(language=="chinese") {
            selOptTitleLanguage = selExtra[0]?.op_name_cn||additiveItemList[index]?.menuOptionSelected.ADDITIVE_NAME;
        }
        else if(language=="english") {
            selOptTitleLanguage = selExtra[0]?.op_name_en||additiveItemList[index]?.menuOptionSelected.ADDITIVE_NAME;
        }
        return selOptTitleLanguage;
    }

    const calculateAmt = (operand, amt) =>{
        // plus, minus, cancel
        dispatch(resetAmtOrderList({operand,amt,index}))
    }
    function onTogoTouch() {
        if(order?.ITEM_GB == "T") {
            let tmpOrdList = Object.assign([],orderList);
            let ordToChange = Object.assign({},tmpOrdList[index]);
            ordToChange.ITEM_GB = "N";
            ordToChange.ITEM_MSG = "";
            tmpOrdList[index] = ordToChange;
            dispatch(setOrderList(tmpOrdList))
        }else {
            openPopup(dispatch,{innerView:"TogoPopup", isPopupVisible:true,param:{index:index}}); 
        }
        
    }

    return(
        <>
            <CartItemWrapper>
                <CartItemImageTogoWrapper>
                    <CartItemImage source={{uri:"https:"+itemExtra[0]?.gimg_chg}} />
                    <TouchableWithoutFeedback onPress={()=>{ onTogoTouch(); }} >
                        <CartItemTogoWrapper>
                            <CartItemTogoText>{order?.ITEM_GB == "T"?LANGUAGE[language]?.cartView.togoCancel:LANGUAGE[language]?.cartView.togo}</CartItemTogoText>
                            <CartItemTogoIcon source={require("../../assets/icons/togo.png")}  />
                        </CartItemTogoWrapper>
                    </TouchableWithoutFeedback> 
                </CartItemImageTogoWrapper>
                
                <CartItemTitlePriceWrapper>
                    <CartItemTitle>{ItemTitle()||order.ITEM_NM}</CartItemTitle>
                    <CartItemOpts>
                        {/*additiveItemList.length>0 &&
                            additiveItemList.map((el,index)=>{
                                return `${ItemOptionTitle(el.menuOptionSelected.ADDITIVE_ID,index)||el.menuOptionSelected.ADDITIVE_NAME}`+`${index<(additiveItemList.length-1)?", ":""}`;
                            
                            })
                        */}
                    </CartItemOpts>
                    <CartItemPrice>{numberWithCommas(order?.ITEM_AMT||0)}원</CartItemPrice>
                    <CartItemAmtWrapper>
                        <TouchableWithoutFeedback  onPress={()=>{calculateAmt("minus",1)}} >
                            <CartItemAmtController>
                               {/*  <CartItemAmtControllerImage source={require("../../assets/icons/minusIcon.png")}  /> */}
                               <OperandorText>-</OperandorText>
                            </CartItemAmtController>
                        </TouchableWithoutFeedback>
                        <CartItemAmtText>{order?.ITEM_QTY}</CartItemAmtText>
                        <TouchableWithoutFeedback  onPress={()=>{calculateAmt("plus",1)}} >
                            <CartItemAmtController>
                                <OperandorText>+</OperandorText>
                                {/* <CartItemAmtControllerImage  source={require("../../assets/icons/plusIcon.png")} /> */}
                            </CartItemAmtController>
                        </TouchableWithoutFeedback>
                    </CartItemAmtWrapper>
                </CartItemTitlePriceWrapper>
                <TouchableWithoutFeedback onPress={()=>{calculateAmt("cancel",0)}}>
                    <CartItemCancelWrapper>
                        <CartItemCancelBtn source={require("../../assets/icons/close_grey.png")} />
                    </CartItemCancelWrapper>
                </TouchableWithoutFeedback>

            </CartItemWrapper>
        </>
    )
}

export default CartListItem;