import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { MENU_DATA } from '../resources/menuData';
//import { SERVICE_ID, STORE_ID } from '../resources/apiResources';
import { addOrderToPos, getOrderByTable, postOrderToPos } from '../utils/apis';
import { getStoreID, getTableInfo, grandTotalCalculate, numberPad, openPopup, openTransperentPopup, orderListDuplicateCheck, setOrderData } from '../utils/common';
import { isEqual, isEmpty } from 'lodash'
import { posErrorHandler } from '../utils/errorHandler/ErrorHandler';
import { setCartView } from './cart';
import LogWriter from '../utils/logWriter';
import { POS_VERSION_CODE, POS_WORK_CD_POSTPAY_ORDER, POS_WORK_CD_VERSION } from '../resources/apiResources';
import { getTableOrderList, postMetaPosOrder } from '../utils/api/metaApis';
import { META_SET_MENU_SEPARATE_CODE_LIST } from '../resources/defaults';

export const initOrderList = createAsyncThunk("order/initOrderList", async() =>{
    return  {
        grandTotal:0,
        totalItemCnt:0,
        orderList:[],
        orderPayData:{},
    };
})

export const setOrderList = createAsyncThunk("order/setOrderList", async(data) =>{
    return data;
})

export const deleteItem = createAsyncThunk("order/deleteItem", async(_,{dispatch, getState,extra}) =>{
    const {grandTotal, orderList} = getState().order;
    let tmpOrderList = Object.assign([],orderList);
    tmpOrderList.remove(_.index)
    // 카트 여닫기
    if(tmpOrderList.length <= 0) {
        dispatch(setCartView(false));
    }
    const totalResult = grandTotalCalculate(tmpOrderList)
    return {orderList:tmpOrderList,grandTotal:totalResult.grandTotal,totalItemCnt:totalResult.itemCnt };
})


export const resetAmtOrderList = createAsyncThunk("order/resetAmtOrderList", async(_,{dispatch, getState,extra}) =>{
    
    const {grandTotal, orderList} = getState().order;
    const {amt, index, operand} = _;
    const {tableInfo} = getState().tableInfo;
    const {allItems} = getState().menu;

    const {STORE_ID, SERVICE_ID} = await getStoreID()
    .catch(err=>{
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'STORE_ID, SERVICE_ID를 입력 해 주세요.',MSG2:""})
    });

    let tmpOrderList = Object.assign([],orderList);
    const selectedMenu = tmpOrderList[index];
    // 포스 메뉴 정보
    const menuPosDetail = allItems.filter(el=>el.PROD_CD == selectedMenu?.ITEM_CD);
    if( META_SET_MENU_SEPARATE_CODE_LIST.indexOf(menuPosDetail[0]?.PROD_GB)>=0) {
        // 선택하부금액
        // 선택하부금액은 메인 금액일아 하부 메뉴 금액이랑 같이 올려줘야함
        let itemCnt = selectedMenu?.ITEM_QTY;
        let singleItemAmt = selectedMenu?.ITEM_AMT/itemCnt;
        if(operand=="plus") {
            itemCnt +=1;
        }else if(operand=="minus")  {
            itemCnt -=1;
        }else {
            itemCnt = 0;
        }
         
        if(itemCnt<=0) {
            tmpOrderList.splice(index,1);
            if(tmpOrderList.length <= 0) {
                dispatch(setCartView(false));
            }
            const totalResult = grandTotalCalculate(tmpOrderList)
            //console.log("tmpOrderList:",tmpOrderList);
            return {orderList:tmpOrderList,grandTotal:totalResult.grandTotal,totalItemCnt:totalResult.itemCnt, orderPayData:[] };
            //return {orderList:tmpOrderList}
        }
        // 하부메뉴금액 수량 수정
        let subSetItems = Object.assign([],selectedMenu?.SETITEM_INFO);
        
        let newSubSetItems = [];
        let subItemTotal = 0;
        for(var i=0;i<subSetItems.length;i++) {
            const calculatedData = {
                "AMT": (subSetItems[i].AMT/subSetItems[i].QTY)*itemCnt, 
                "ITEM_SEQ": subSetItems[i].ITEM_SEQ, 
                "PROD_I_CD": subSetItems[i].PROD_I_CD, 
                "PROD_I_NM": subSetItems[i].PROD_I_NM, 
                "QTY": itemCnt, 
                "SET_SEQ": subSetItems[i].SET_SEQ,
                "VAT": (subSetItems[i].VAT/subSetItems[i].QTY)*itemCnt,
            }
            subItemTotal += (subSetItems[i].AMT/subSetItems[i].QTY)*itemCnt
            newSubSetItems.push(calculatedData);
        }
        
        tmpOrderList[index] = Object.assign({},selectedMenu,{ITEM_AMT:singleItemAmt*itemCnt, ITEM_QTY:itemCnt,SETITEM_INFO:newSubSetItems});
        const totalResult = grandTotalCalculate(tmpOrderList)
       
        return {orderList:tmpOrderList,grandTotal:totalResult.grandTotal+subItemTotal,totalItemCnt:totalResult.itemCnt, orderPayData:[] };
         
    }else {

        let itemCnt = selectedMenu?.ITEM_QTY;
        let singleItemAmt = selectedMenu?.ITEM_AMT/itemCnt;
        if(operand=="plus") {
            itemCnt +=1;
        }else if(operand=="minus")  {
            itemCnt -=1;
        }else {
            itemCnt = 0;
        }
         
        if(itemCnt<=0) {
            tmpOrderList.splice(index,1);
            if(tmpOrderList.length <= 0) {
                dispatch(setCartView(false));
            }
            const totalResult = grandTotalCalculate(tmpOrderList)
            //console.log("tmpOrderList:",tmpOrderList);
           
            return {orderList:tmpOrderList,grandTotal:totalResult.grandTotal,totalItemCnt:totalResult.itemCnt, orderPayData:[] };
            //return {orderList:tmpOrderList}
        }
        tmpOrderList[index] = Object.assign({},selectedMenu,{ITEM_AMT:singleItemAmt*itemCnt, ITEM_QTY:itemCnt});
        const totalResult = grandTotalCalculate(tmpOrderList)
       
        return {orderList:tmpOrderList,grandTotal:totalResult.grandTotal,totalItemCnt:totalResult.itemCnt, orderPayData:[] };
         
    }

})

export const addToOrderList =  createAsyncThunk("order/addToOrderList", async(_,{dispatch, getState,extra}) =>{

    const {item,menuOptionSelected} = _;
    const {orderList} = getState().order;
    const {menuDetail} = getState().menuDetail;
    let currentOrderList = Object.assign([],orderList);
    let orderData = setOrderData(item, orderList);

    if(META_SET_MENU_SEPARATE_CODE_LIST.indexOf(menuDetail?.PROD_GB) >= 0) {
        // 메뉴 선택하부금액 
        // 선택한 옵션의 가격이 들어감
        // 세트 메인 품목의 가격은 그대로 하위 품목들의 가격이 들어가고 그에따라 수량이 늘아날떄 가격과 수량이 같이 올라가야함
        // 메뉴 데이터 주문데이터에 맞게 변경
        let optionTrim = [];
        let optionPrice = 0;
        for(var i=0;i<menuOptionSelected.length;i++) {
            optionPrice = optionPrice+(menuOptionSelected[i].AMT+menuOptionSelected[i].VAT)*menuOptionSelected[i].QTY
            optionTrim.push({...menuOptionSelected[i],...{ITEM_SEQ:orderData.ITEM_SEQ,AMT:menuOptionSelected[i].AMT*menuOptionSelected[i].QTY+menuOptionSelected[i].VAT*menuOptionSelected[i].QTY, VAT:menuOptionSelected[i].VAT*menuOptionSelected[i].QTY}});
        }
        // 세트 메뉴 추가
        orderData["SETITEM_INFO"] = optionTrim;
        orderData["SETITEM_CNT"] = optionTrim.length;
        orderData["ITEM_AMT"] = orderData["ITEM_AMT"];
        // 중복 체크 후 수량 변경
        let newOrderList = orderListDuplicateCheck(currentOrderList, orderData);
        //newOrderList.reverse();
    
        if(newOrderList.length <= 0) {
            dispatch(setCartView(false));
        }else {
            dispatch(setCartView(true));
        }
        // 금액계산
        const totalResult = grandTotalCalculate(newOrderList);
        //openPopup(dispatch,{innerView:"AutoClose", isPopupVisible:true,param:{msg:"장바구니에 추가했습니다."}});
        openTransperentPopup(dispatch, {innerView:"OrderComplete", isPopupVisible:true,param:{msg:"장바구니에 추가했습니다."}});
        
        return {orderList:newOrderList,grandTotal:totalResult.grandTotal+optionPrice,totalItemCnt:totalResult.itemCnt, orderPayData:[] };
  


    }else {
        // 다른 메뉴들
        // 세트메뉴 경우 그냥 세트 품목들 0원 세트 메인 상품의 가격에 세트메뉴 가격을 추가함
                 
        // 메뉴 데이터 주문데이터에 맞게 변경
        let optionTrim = [];
        let optionPrice = 0;
        for(var i=0;i<menuOptionSelected.length;i++) {
            optionPrice = optionPrice+(menuOptionSelected[i].AMT+menuOptionSelected[i].VAT)*menuOptionSelected[i].QTY
            optionTrim.push({...menuOptionSelected[i],...{ITEM_SEQ:orderData.ITEM_SEQ,AMT:menuOptionSelected[i].AMT*menuOptionSelected[i].QTY,VAT:menuOptionSelected[i].VAT*menuOptionSelected[i].QTY}});
        }
        // 세트 메뉴 추가
        orderData["SETITEM_INFO"] = optionTrim;
        orderData["SETITEM_CNT"] = optionTrim.length;
        orderData["ITEM_AMT"] = orderData["ITEM_AMT"]+optionPrice;
        // 중복 체크 후 수량 변경
        let newOrderList = orderListDuplicateCheck(currentOrderList, orderData);
        //newOrderList.reverse();
    
        if(newOrderList.length <= 0) {
            dispatch(setCartView(false));
        }else {
            dispatch(setCartView(true));
        }
        // 금액계산
        const totalResult = grandTotalCalculate(newOrderList)
        //openPopup(dispatch,{innerView:"AutoClose", isPopupVisible:true,param:{msg:"장바구니에 추가했습니다."}});
        openTransperentPopup(dispatch, {innerView:"OrderComplete", isPopupVisible:true,param:{msg:"장바구니에 추가했습니다."}});
        
        return {orderList:newOrderList,grandTotal:totalResult.grandTotal,totalItemCnt:totalResult.itemCnt, orderPayData:[] };
    }

    
    
})
// metacity 주문
export const postToMetaPos =  createAsyncThunk("order/postToPos", async(_,{dispatch, getState,extra}) =>{
    const {orderList} = getState().order;
    const date = new Date();
    const tableNo = await getTableInfo().catch(err=>{posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:"테이블 설정",MSG2:"테이블 번호를 설정 해 주세요."});});
    if(isEmpty(tableNo)) {
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:"테이블 설정",MSG2:"테이블 번호를 설정 해 주세요."});

        return 
    }
    const orderNo = `${date.getFullYear()}${numberPad(date.getMonth()+1,2)}${numberPad(date.getDate(),2)}${date.getMilliseconds()}`;
    let orderData = {
        "VERSION" : POS_VERSION_CODE,
        "WORK_CD" : POS_WORK_CD_POSTPAY_ORDER,
        "ORDER_NO" : orderNo,
        "TBL_NO" : `${tableNo.TABLE_INFO}`, 
        "PRINT_YN" : "Y",
        "USER_PRINT_YN" : "Y",
        "PRINT_ORDER_NO" : "101", 
        "TOT_INWON" : 4,
        "ITEM_CNT" : orderList.length,
        "ITEM_INFO" :orderList
    }    
    const result = await postMetaPosOrder(dispatch, orderData).catch(err=>{posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:"주문오류",MSG2:"주문을 진행할 수 없습니다."}); return; });
    dispatch(setCartView(false));
    dispatch(initOrderList());
    //openTransperentPopup(dispatch, {innerView:"OrderComplete", isPopupVisible:true,param:{msg:"주문을 완료했습니다."}});
    openTransperentPopup(dispatch, {innerView:"OrderList", isPopupVisible:true, param:{timeOut:10000} });
    return result;
})

// 새로 메뉴 등록
export const postToPos =  createAsyncThunk("order/postToPos", async(_,{dispatch, getState,extra}) =>{
    const {orderPayData} = getState().order;
    const {paymentResult, isPrepay} = _;
    let payData = {
        "ITEM_SEQ" : 0,
        "ITEM_CD" : "",
        "ITEM_NM" : "",
        "ITEM_QTY" : 0,
        "ITEM_AMT" : 0,
        "ITEM_VAT" : 0,
        "ITEM_DC" : 0,
        "ITEM_CANCEL_YN" : "N",
        "ITEM_GB" : "N",
        "ITEM_MSG" : "",
        "SETITEM_CNT" : 0,
        "SETITEM_INFO" : 
        []
    }
    let orderPayList = [];

    /* paymentResult = {
        "acquire-info": "0300신한카드사", 
        "additional-device-name": "SIFM", 
        "additional-device-serial": "S522121235", 
        "approval-date": "231026", 
        "approval-no": "37466524", 
        "approval-time": "004108", 
        "business-address": "서울 영등포구 선유로3길 10 하우스디 비즈 706호", 
        "business-name": "주식회사 우리포스",
        "business-no": "2118806806", 
        "business-owner-name": "김정엽", 
        "business-phone-no": "02  15664551", 
        "card-no": "94119400********", 
        "cat-id": "7109912041",
        "deal": "approval", 
        "device-auth-info": "####SMT-R231", 
        "device-auth-ver": "1001", 
        "device-name": "SMT-R231", 
        "device-serial": "S522121235", 
        "display-msg": "정상승인거래", 
        "external-name": "SIFM", 
        "external-serial": "S522121235", 
        "issuer-info": "0300마이홈플러스신한", 
        "merchant-no": "0105512446", 
        "persional-id": "01040618432",
        "receipt-msg": "정상승인거래", 
        "response-code": "00", 
        "service": "payment", 
        "service-result": "0000", 
        "total-amount": 20, 
        "type": "credit",
        "unique-no": "710610231843",
        "van-tran-seq": "231026004105"}
         */
    if(isPrepay) {
        const orderPayItem = {
            "AUTH_DATE": `20${paymentResult['approval-date']||"" }`, 
            "AUTH_NO": `${paymentResult['approval-no']||"" }`, 
            "AUTH_TIME": `${paymentResult['approval-time']||""}`, 
            "CAN_FLAG": "N", 
            "CAN_PAY_SEQ": "", 
            "CARD_ACQHID": `${paymentResult['acquire-info']?.substring(0,4)||""}`, 
            "CARD_ACQ_NAME": `${paymentResult['acquire-info']?.substring(4,paymentResult['acquire-info'].length-1)||""}`, 
            "CARD_ACSHID": `${paymentResult['issuer-info']?.substring(0,4)||""}`, 
            "CARD_MCHTNO": `${paymentResult['merchant-no']||""}`, 
            "CARD_NO": `${paymentResult['card-no']}`, 
            "CARD_PAY_TYPE": "I", 
            "CASH_AUTH_TYPE": "P", 
            "CRD_HID_NAME": `${paymentResult['issuer-info']?.substring(4,paymentResult['issuer-info']?.length-1)||""}`, 
            "DDCEDI": "E", 
            "ISTM_TERM": "01", 
            "PAY_TYPE": "card", 
            "SALE_AMT":`${paymentResult['total-amount']||""}`, 
            "SALE_VAT_AMT": "0", 
            "SVC_AMT": "0", 
            "TML_NO":`${paymentResult['cat-id']||""}`,
        };
        orderPayList.push(orderPayItem);
    }

    let submitOrderPayData = Object.assign({},orderPayData);
    submitOrderPayData['PREPAY_FLAG'] = isPrepay?"Y":"N";
    submitOrderPayData['ORD_PAY_LIST'] = orderPayList;
     
    const lw = new LogWriter();
    const logPos = `\nPOST POS DATA==================================\ndata:${JSON.stringify(submitOrderPayData)}\n`
    lw.writeLog(logPos);

    return await postOrderToPos(dispatch, submitOrderPayData)
    .catch(err=>{
        //posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:"주문 오류",MSG2:"주문을 진행할 수 없습니다."});
        console.log("error: ",err)
        const lw = new LogWriter();
        const logPos = `\nPOST POS DATA ERROR==================================\ndata:${JSON.stringify(err)}\n`
        lw.writeLog(logPos);
    });
     
})
// 매뉴 추가 등록
export const postAddToPos =  createAsyncThunk("order/postAddToPos", async(_,{dispatch, getState,extra}) =>{
    const {orderPayData} = getState().order;
    const {orderResult} = _;
    let tmpData = Object.assign({},orderPayData);
    // 추가 주문에 결제 정보 빼야함.
    tmpData["ORD_PAY_LIST"]=[];
    tmpData = {...tmpData,...(orderResult)};
    //console.log("tmpData: ",tmpData);
    const lw = new LogWriter();
    const logPos = `\nPOST POS ADD DATA==================================\ndata:${JSON.stringify(tmpData)}\n`
    lw.writeLog(logPos);
    
    return await addOrderToPos(dispatch, tmpData)
    .catch(err=>{
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:"주문 오류",MSG2:"주문을 진행할 수 없습니다."});
        //console.log("error: ",err)
    });  

})
// 테이블 주문 히스토리
export const getOrderStatus = createAsyncThunk("order/getOrderStatus", async(_,{dispatch, getState,extra}) =>{
    const result = await getTableOrderList();
    return result;
})
// 테이블 주문 히스토리 지우기
export const clearOrderStatus = createAsyncThunk("order/clearOrderStatus", async(_,{dispatch, getState,extra}) =>{
    return [];
})

/* 
export const addToOrderList =  createAsyncThunk("order/addToOrderList", async(_,{getState,extra}) =>{
    console.log("menuDetail: ",_.menuDetail);
    const menuDetail = _.menuDetail;
    const {grandTotal, orderList} = getState().order;
    const selectedOptions = _.selectedOptions||[];
    const selectedRecommend = _.selectedRecommend||[];
    let currentOrderList = orderList;
    // 최초 카트에 추가할떄
    var orderAmt = 1;
    var orderData = {menuIndex:_.menuDetailIndex,selectedOptions:selectedOptions, amount:orderAmt};

    // 기존에 카트에 있는지 체크
    const requestedOrderData = {menuIndex:_.menuDetailIndex,selectedOptions:selectedOptions}
    if(currentOrderList.length>0) {
        currentOrderList.map((el, index)=>{
            let prevEl = el;
            // amount 빼고 같은값이 있나 비교
            const {amount, ...obj} = prevEl;
            prevEl = obj;
            if(JSON.stringify(prevEl) == JSON.stringify(requestedOrderData) ) {
                const prevOrderAmt = el.amount;
                return {menuIndex:el.menuIndex,selectedOptions:el.selectedOptions, amount:Number(prevOrderAmt)+1};
            }else {
                console.log('중복 아님');
                return {menuIndex:_.menuDetailIndex,selectedOptions:selectedOptions, amount:orderAmt};
            }
        })   
    }
    console.log("currentOrderList: ",currentOrderList);

    var totalPrice = Number(menuDetail.price)+grandTotal;
    for(var i=0;i<selectedOptions.length;i++) {
        // 총합계 계산
        totalPrice+=Number(MENU_DATA.options[selectedOptions[i]].price);
    }
    //const optData= MENU_DATA.options[el];
    var orderMenu = [orderData];
    for(var i=0;i<selectedRecommend.length;i++) {
        // 메뉴 추가
        orderMenu.push({menuIndex:selectedRecommend[i],selectedOptions:[]})
        // 총합계 계산
        totalPrice+=Number(MENU_DATA.menuAll[selectedRecommend[i]].price);
    }
    
    return {orderList:orderMenu, grandTotal:totalPrice};
}) 
*/
// Slice
export const orderSlice = createSlice({
    name: 'order',
    initialState: {
        grandTotal:0,
        totalItemCnt:0,
        orderList:[],
        orderPayData:{},
        orderStatus:[],
        orgOrderNo:"",
        orderNo:"",
    },
    extraReducers:(builder)=>{
        // 주문 셋
        builder.addCase(setOrderList.fulfilled,(state, action)=>{
            state.orderList = action.payload;
        })
        // 주문 추가
        builder.addCase(addToOrderList.fulfilled,(state, action)=>{
            //console.log("addToOrderList========",action.payload);
            if(action.payload){
                state.orderList = action.payload.orderList;
                state.grandTotal = action.payload.grandTotal;
                state.totalItemCnt = action.payload.totalItemCnt;
                state.orderPayData = action.payload.orderPayData;
            }
        })
        // 주문 수량 수정
        builder.addCase(resetAmtOrderList.fulfilled,(state, action)=>{
            if(action.payload){
                state.orderList = action.payload.orderList;
                state.grandTotal = action.payload.grandTotal;
                state.totalItemCnt = action.payload.totalItemCnt;
                state.orderPayData = action.payload.orderPayData;
            }
        })
         // 주문 삭제
         builder.addCase(deleteItem.fulfilled,(state, action)=>{
            if(action.payload){
                state.orderList = action.payload.orderList;
                state.grandTotal = action.payload.grandTotal;
                state.totalItemCnt = action.payload.totalItemCnt;
            }
        })
        // 주문 초기화
         builder.addCase(initOrderList.fulfilled,(state, action)=>{
            if(action.payload){
                state.orderList = action.payload.orderList;
                state.grandTotal = action.payload.grandTotal;
                state.totalItemCnt = action.payload.totalItemCnt;
                state.orderPayData = action.payload.orderPayData;
            }
        })
        // 새주문 등록
        builder.addCase(postToPos.fulfilled,(state, action)=>{
            
        })
        // 주문 추가등록
        builder.addCase(postAddToPos.fulfilled,(state, action)=>{
            
        })
        // 주문 목록
        builder.addCase(getOrderStatus.fulfilled,(state, action)=>{
            if(action.payload){
                state.orderStatus = action.payload;
            }
        })
        // 주문 목록 클리어
        builder.addCase(clearOrderStatus.fulfilled,(state, action)=>{
                state.orderStatus = [];
        })


        
    }
});
