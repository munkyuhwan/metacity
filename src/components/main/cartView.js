import React, { useEffect, useState } from 'react'
import { 
    Alert,
    Animated,
    Dimensions,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { ArrowImage, CartFlatList, CartScrollView, CartViewWrapper, Handle, OrderWrapper, PayAmtNumber, PayAmtTitle, PayAmtUnit, PayAmtWrapper, PayBtn, PayIcon, PayTitle, PayWrapper } from '../../styles/main/cartStyle';
import CartListItem from '../cartComponents/cartListItem';
import { LANGUAGE } from '../../resources/strings';
import { setCartView, setIconClick } from '../../store/cart';
import { IconWrapper } from '../../styles/main/topMenuStyle';
import TopButton from '../menuComponents/topButton';
import {  openTransperentPopup } from '../../utils/common';
import { initOrderList, postToMetaPos, postToPos } from '../../store/order';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isEmpty} from 'lodash';
import LogWriter from '../../utils/logWriter';
import {  initMenu } from '../../store/menu';
import { getMenuUpdateState } from '../../utils/api/metaApis';
import moment from 'moment';
import { KocesAppPay } from '../../utils/payment/kocesPay';
import { displayErrorPopup } from '../../utils/errorHandler/metaErrorHandler';
import { PAY_SEPRATE_AMT_LIMIT } from '../../resources/defaults';
import { setMonthPopup, setSelectedMonth } from '../../store/monthPopup';

const windowWidth = Dimensions.get('window').width;
const CartView = () =>{
    const lw = new LogWriter();
    const {language} = useSelector(state=>state.languages);

    const dispatch = useDispatch();
    const {isOn} = useSelector((state)=>state.cartView);
    const {orderList,vatTotal} = useSelector((state)=>state.order);
    const { tableInfo, tableStatus } = useSelector(state=>state.tableInfo);
    const {isMonthSelectShow, monthSelected} = useSelector(state=>state.monthSelect)
    //console.log("orderList: ",orderList);
    const [totalAmt, setTotalAmt] = useState();
    const [totalCnt, setTotalCnt] = useState();
    const [slideAnimation, setSlideAnimation] = useState(new Animated.Value(0));
    const slideInterpolate = slideAnimation.interpolate({
        inputRange:[0,1],
        outputRange:[(windowWidth*0.278),(windowWidth*0.004)]
        //outputRange:[314,5]
    })
    const boxStyle = {
        transform: [{translateX:slideInterpolate},],
    };
    const isPrepay = tableStatus?.now_later=="선불"?true:false;

    const drawerController = (isOpen) =>{
        Animated.parallel([
            Animated.timing(slideAnimation,{
                toValue:isOpen?1:0,
                duration:200,
                useNativeDriver:true
            })
        ]).start();
    }
   
    const addToPos = async () => {
        const paymentResult = {"acquire-info": "0300신한카드사", "additional-device-name": "SIFM", "additional-device-serial": "S522121235", "approval-date": "231026", "approval-no": "37466524", "approval-time": "004108", "business-address": "서울 영등포구 선유로3길 10 하우스디 비즈 706호", "business-name": "주식회사 우리포스", "business-no": "2118806806", "business-owner-name": "김정엽", "business-phone-no": "02  15664551", "card-no": "94119400********", "cat-id": "7109912041", "deal": "approval", "device-auth-info": "####SMT-R231", "device-auth-ver": "1001", "device-name": "SMT-R231", "device-serial": "S522121235", "display-msg": "정상승인거래", "external-name": "SIFM", "external-serial": "S522121235", "issuer-info": "0300마이홈플러스신한", "merchant-no": "0105512446", "persional-id": "01040618432", "receipt-msg": "정상승인거래", "response-code": "00", "service": "payment", "service-result": "0000", "total-amount": 20, "type": "credit", "unique-no": "710610231843", "van-tran-seq": "231026004105"}
        dispatch(postToPos({paymentResult}));
        //lw.writeLog("Teset test test")
    } 

    useEffect(()=>{
        if(!isMonthSelectShow) {
            if(totalAmt>0) {
                if(monthSelected!="") {
                    makePayment();
                    dispatch(setSelectedMonth(""));
                }
            }
        }

    },[isMonthSelectShow,monthSelected])

    const makePayment = () =>{
        if( tableStatus?.now_later == "선불") {
            //dispatch(postToMetaPos({payData:SAMPLE_PAY_RESULT_DATA}));
            
            let payAmt = totalAmt - vatTotal;
            
            var kocessAppPay = new KocesAppPay();
            //kocessAppPay.storeDownload();
            //console.log({amt:payAmt, taxAmt:vatTotal, months:monthSelected});
            
            kocessAppPay.makePayment({amt:payAmt, taxAmt:vatTotal, months:monthSelected});
            //kocessAppPay.cancelPayment({amt:1004, taxAmt:0,auDate:"231227",auNo:"02173730",tradeNo:"000000800951"});
            kocessAppPay.requestKoces()
            .then(result=>{
                console.log("request result: ", result);
                dispatch(postToMetaPos({payData:result}));
            })
            .catch((err)=>{
                displayErrorPopup(dispatch, "XXXX", err?.Message)
                console.log("error: ",err)
            })
            
        }else {
            dispatch(postToMetaPos({payData:{}}));
        }

    }

    const doPayment = async () =>{

        const resultData = await getMenuUpdateState(dispatch).catch(err=>{return []});
        if(!resultData) {
            
        }else {
            const isUpdated = resultData?.ERROR_CD == "E0000" ;
            const updateDateTime = resultData?.UPD_DT;
            const msg = resultData?.ERROR_MSG;
            if(isUpdated) {
                
                // 날짜 기준 메뉴 업트가 있으면 새로 받아 온다.
                const lastUpdateDate = await AsyncStorage.getItem("lastUpdate");      
                const currentDate = moment(lastUpdateDate).format("x");
                const updateDate = moment(updateDateTime).format("x");
                if(updateDate>currentDate) {
                    Alert.alert(
                        "업데이트",
                        "메뉴 업데이트가 되었습니다. 업데이트 후 주문하실 수 있습니다.",
                        [{
                            text:'확인',
                        }]
                    );
                    dispatch(initMenu());
                    const saveDate = moment().format("YYYY-MM-DD HH:mm:ss");
                    AsyncStorage.setItem("lastUpdate",saveDate);
                    dispatch(setCartView(false));
                    dispatch(initOrderList());
                }else {
                    if(totalAmt >= PAY_SEPRATE_AMT_LIMIT) {
                        dispatch(setMonthPopup({isMonthSelectShow:true}))
                    }else {
                        makePayment();
                    }
                    //dispatch(postToMetaPos());
                }
    
            }else {
                if(totalAmt >= PAY_SEPRATE_AMT_LIMIT) {
                    dispatch(setMonthPopup({isMonthSelectShow:true}))
                }else {
                    makePayment();
                }
                //dispatch(postToMetaPos());
            }
        } 
        
    }
    useEffect(()=>{
        drawerController(isOn); 
    },[isOn])

    useEffect(()=>{
        let totalAmt = 0;
        let totalCnt = 0
        if(orderList) {
            if(orderList?.length>0) {
                orderList?.map((el)=>{
                    totalAmt += Number(el.ITEM_AMT);
                    totalCnt++;
                    for(var i=0;i<el.SETITEM_INFO.length;i++) {
                        totalAmt += el.SETITEM_INFO[i].AMT
                    }
                })
            }
            setTotalAmt(totalAmt);
            setTotalCnt(totalCnt);
            
        }else {
            setTotalAmt(totalAmt);
            setTotalCnt(totalCnt);
        }
    },[orderList])
  
    return(
        <>  
            <IconWrapper>
                {//!isPrepay &&
                    <TopButton onPress={()=>{ openTransperentPopup(dispatch, {innerView:"OrderList", isPopupVisible:true}); }} isSlideMenu={false} lr={"left"} onSource={require("../../assets/icons/orderlist_trans.png")} offSource={require("../../assets/icons/orderlist_grey.png")} />
                }
                <TopButton onPress={()=>{  dispatch(setCartView(!isOn));  }} isSlideMenu={true} lr={"right"} onSource={require("../../assets/icons/cart_trans.png")} offSource={require("../../assets/icons/cart_grey.png")} />
            </IconWrapper>
            <CartViewWrapper style={[{...boxStyle}]} >
                
                <TouchableWithoutFeedback onPress={()=>{   dispatch(setCartView(!isOn));  }}>
                    <Handle>
                        {isOn&&
                            <ArrowImage source={require("../../assets/icons/close_arrow.png")} />
                        }
                        {!isOn&&
                            <ArrowImage style={{transform:[{scaleX:-1}]}} source={require("../../assets/icons/close_arrow.png")} />
                        }
                    </Handle>
                </TouchableWithoutFeedback>
                {orderList &&
                    <CartFlatList
                        data={orderList}
                        renderItem={(item )=>{
                            return(
                                <CartListItem {...item} />
                            )
                        }}
                    >
                    </CartFlatList>
                } 
                <OrderWrapper>
                    <PayWrapper>
                        <PayAmtWrapper isBordered={true}>
                            <PayAmtTitle>{LANGUAGE[language]?.cartView?.orderAmt}</PayAmtTitle>
                            <PayAmtNumber>{totalCnt}</PayAmtNumber>
                            <PayAmtUnit> {LANGUAGE[language]?.cartView?.orderAmtUnit}</PayAmtUnit>
                        </PayAmtWrapper>
                    </PayWrapper>
                    <PayWrapper>
                        <PayAmtWrapper >
                            <PayAmtTitle>{LANGUAGE[language]?.cartView.totalAmt}</PayAmtTitle>
                            <PayAmtNumber>{totalAmt}</PayAmtNumber>
                            <PayAmtUnit> {LANGUAGE[language]?.cartView.totalAmtUnit}</PayAmtUnit>
                        </PayAmtWrapper>
                    </PayWrapper>
                    <TouchableWithoutFeedback onPress={()=>{ doPayment();  }} >
                        <PayBtn>
                            {
                                !isPrepay&&
                                <PayTitle>{LANGUAGE[language]?.cartView.makeOrder}</PayTitle>
                            }
                            {
                                isPrepay&&
                                <PayTitle>{LANGUAGE[language]?.cartView.payOrder}</PayTitle>
                            }
                            <PayIcon source={require("../../assets/icons/order.png")} />
                        </PayBtn>
                     </TouchableWithoutFeedback>
                </OrderWrapper>
            </CartViewWrapper>  
           
        </>
    )
}


export default CartView;