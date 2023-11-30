import React, { useState, useEffect } from 'react'
import { Text, TouchableWithoutFeedback } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { OrderListWrapper, OrderListPopupWrapper, OrderListTopSubtitle, OrderListTopTitle, OrdrListTopWrapper, OrderListTableWrapper, OrderListTableColumnNameWrapper, OrderListTableColumnName, OrderListTableList, OrderListTalbleGrandTotal, OrderListTalbleGrandTotalWrapper, OrderListTotalTitle, OrderListTotalAmount } from '../../styles/popup/orderListPopupStyle';
import { PopupBottomButtonBlack, PopupBottomButtonText, PopupBottomButtonWrapper } from '../../styles/common/coreStyle';
import { LANGUAGE } from '../../resources/strings';
import { BottomButton, BottomButtonIcon, BottomButtonText, BottomButtonWrapper } from '../../styles/main/detailStyle';
import { colorBlack, colorRed } from '../../assets/colors/color';
import { openTransperentPopup } from '../../utils/common';
import OrderListItem from '../orderListComponents/orderListItem';
import { getOrderStatus } from '../../store/order';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkTableOrder } from '../../utils/apis';
import {isEmpty} from 'lodash';

const OrderListPopup = () =>{
    const dispatch = useDispatch();
    const {language} = useSelector(state=>state.languages);
    const {orderStatus} = useSelector(state=>state.order);    
    const [orderTotalAmt, setOrderTotalAmt] = useState(0);
    const { tableInfo } = useSelector(state=>state.tableInfo);
    useEffect(()=>{
        //const orderStatus = await checkTableOrder(dispatch,{tableInfo}).catch(err=>{return});
       /*  AsyncStorage.getItem("orderResult")
        .then(result =>{
            console.log("order result: ",result);
            if(result) {
                dispatch(getOrderStatus({orderData:orderResult}));  
            }
        })
        .catch(error=>{

        })  */
        checkTableOrder(dispatch,{tableInfo})
        .then(orderStatus=>{
            const orderNo = orderStatus.orderNo;
            const mchatOrderNo = orderStatus.mchatOrderNo;
            const orgOrderNo = orderStatus.orgOrderNo
            const orderResult = {"ORG_ORDERNO":orgOrderNo,"MCHT_ORDERNO":mchatOrderNo,"ORDERNO":orderNo}
            dispatch(getOrderStatus({orderData:orderResult}));
        })
        .catch(err=>{}) 
        
    },[])
 
    useEffect(()=>{
        if(isEmpty(orderStatus)) {
            setOrderTotalAmt(0);
        }
        if(orderStatus[0]?.ITEM_LIST){
            let tmpPrice = 0;
            orderStatus[0].ITEM_LIST.map(el=>{
                tmpPrice += Number(el.SALE_PRICE);
            })
            setOrderTotalAmt(tmpPrice);
        }
    },[orderStatus])

    return(
        <>
            <OrderListPopupWrapper>
                <OrdrListTopWrapper>
                    <OrderListTopTitle>{LANGUAGE[language]?.orderListPopup.orderListTitle}</OrderListTopTitle>
                    <TouchableWithoutFeedback onPress={()=>{dispatch(getOrderStatus({}));}} >
                        <OrderListTopSubtitle>{LANGUAGE[language]?.orderListPopup.orderListSubtitle}</OrderListTopSubtitle>
                    </TouchableWithoutFeedback>

                </OrdrListTopWrapper>
                <OrderListWrapper>
                    <OrderListTableWrapper>
                        <OrderListTableColumnNameWrapper>
                            <OrderListTableColumnName flex={0.8} >{LANGUAGE[language]?.orderListPopup.tableColName}</OrderListTableColumnName>
                            <OrderListTableColumnName flex={0.2} >{LANGUAGE[language]?.orderListPopup.tableColAmt}</OrderListTableColumnName>
                            <OrderListTableColumnName flex={0.2} >{LANGUAGE[language]?.orderListPopup.tableColPrice}</OrderListTableColumnName>
                            <OrderListTableColumnName flex={0.3} >{LANGUAGE[language]?.orderListPopup.tableColTotal}</OrderListTableColumnName>
                        </OrderListTableColumnNameWrapper>
                       {orderStatus[0]?.ITEM_LIST &&
                            <OrderListTableList
                                data={orderStatus[0].ITEM_LIST}
                                renderItem={(item)=>{return <OrderListItem order={item} />}}
                            />
                        }
                    </OrderListTableWrapper>
                    <OrderListTalbleGrandTotalWrapper>
                        <OrderListTotalTitle>{LANGUAGE[language]?.orderListPopup.tableColGrandTotal}</OrderListTotalTitle>
                        <OrderListTotalAmount>{orderTotalAmt}{LANGUAGE[language]?.orderListPopup.totalAmtUnit}</OrderListTotalAmount>
                    </OrderListTalbleGrandTotalWrapper>
                </OrderListWrapper>
                <BottomButtonWrapper>
                    {/*!isPrepay &&
                       <BottomButton backgroundColor={colorRed} >
                            <BottomButtonText>{LANGUAGE[language]?.orderListPopup.orderListPay}</BottomButtonText>
                            <BottomButtonIcon source={require("../../assets/icons/card.png")} />
                        </BottomButton>
                    */}
                    <TouchableWithoutFeedback onPress={()=>{ openTransperentPopup(dispatch, {innerView:"", isPopupVisible:false}); }} >
                        <BottomButton backgroundColor={colorBlack} >
                            <BottomButtonText>{LANGUAGE[language]?.orderListPopup.orderListOK}</BottomButtonText>
                            <BottomButtonIcon source={require("../../assets/icons/cancel.png")} />
                        </BottomButton>
                    </TouchableWithoutFeedback>
                </BottomButtonWrapper>
            </OrderListPopupWrapper>
        </>
    )
}

export default OrderListPopup;