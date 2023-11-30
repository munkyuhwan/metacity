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

    const additiveItemList = order.ADDITIVE_ITEM_LIST;
    // 이미지 찾기
    const itemExtra = menuExtra.filter(el=>el.pos_code == order.ITEM_ID);
    const ItemTitle = () => {
        let selTitleLanguage = "";
        const selExtra = itemExtra.filter(el=>el.pos_code==order.ITEM_ID);
        if(language=="korean") {
            selTitleLanguage = order.ITEM_NAME;
        }
        else if(language=="japanese") {
            selTitleLanguage = selExtra[0]?.gname_jp;
        }
        else if(language=="chinese") {
            selTitleLanguage = selExtra[0]?.gname_cn;
        }
        else if(language=="english") {
            selTitleLanguage = selExtra[0]?.gname_en;
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
        //ADDITIVE_ITEM_LIST
        let additiveList = additiveItemList;
        let togoCheck = additiveList.filter(el=>el.menuOptionSelected.ADDITIVE_ID=="1002");

        if(togoCheck.length > 0) {
            // additive listd에서 포장을 빼야함
            let tmpOrdList = [...orderList];
            
            // additive list에서 포장을 제외한 배열 만들기
            let additiveListWithoutTogo = additiveList.filter(el=>el.menuOptionSelected.ADDITIVE_ID!="1002");
            tmpOrdList[index] = {...tmpOrdList[index],  ADDITIVE_ITEM_LIST:additiveListWithoutTogo};
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
                   {/*  <TouchableWithoutFeedback onPress={()=>{ onTogoTouch(); }} >
                        <CartItemTogoWrapper>
                            <CartItemTogoText>{additiveItemList?.filter(el=>el.menuOptionSelected.ADDITIVE_ID=="1002").length>0?LANGUAGE[language]?.cartView.togoCancel:LANGUAGE[language]?.cartView.togo}</CartItemTogoText>
                            <CartItemTogoIcon source={require("../../assets/icons/togo.png")}  />
                        </CartItemTogoWrapper>
                    </TouchableWithoutFeedback> */}
                </CartItemImageTogoWrapper>
                
                <CartItemTitlePriceWrapper>
                    <CartItemTitle>{ItemTitle()||order.ITEM_NAME}</CartItemTitle>
                    <CartItemOpts>
                        {additiveItemList.length>0 &&
                            additiveItemList.map((el,index)=>{
                                return `${ItemOptionTitle(el.menuOptionSelected.ADDITIVE_ID,index)||el.menuOptionSelected.ADDITIVE_NAME}`+`${index<(additiveItemList.length-1)?", ":""}`;

                                //return el.menuOptionSelected.ADDITIVE_NAME+`${index<(additiveItemList.length-1)?", ":""}`;
                            
                            })
                         }
                    </CartItemOpts>
                    <CartItemPrice>{numberWithCommas(order?.SALE_PRICE||0)}원</CartItemPrice>
                    <CartItemAmtWrapper>
                        <TouchableWithoutFeedback  onPress={()=>{calculateAmt("minus",1)}} >
                            <CartItemAmtController>
                               {/*  <CartItemAmtControllerImage source={require("../../assets/icons/minusIcon.png")}  /> */}
                               <OperandorText>-</OperandorText>
                            </CartItemAmtController>
                        </TouchableWithoutFeedback>
                        <CartItemAmtText>{order?.ITEM_CNT}</CartItemAmtText>
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