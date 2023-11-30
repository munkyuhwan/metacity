import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { MENU_DATA } from '../resources/menuData';
//import { SERVICE_ID, STORE_ID } from '../resources/apiResources';
import { addOrderToPos, getOrderByTable, postOrderToPos } from '../utils/apis';
import { getStoreID, grandTotalCalculate, openPopup } from '../utils/common';
import { isEqual, isEmpty } from 'lodash'
import { posErrorHandler } from '../utils/errorHandler/ErrorHandler';
import { setCartView } from './cart';
import LogWriter from '../utils/logWriter';

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
    console.log("tmpOrderList.length: ",tmpOrderList.length);
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
    const {STORE_ID, SERVICE_ID} = await getStoreID()
    .catch(err=>{
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'STORE_ID, SERVICE_ID를 입력 해 주세요.',MSG2:""})
    });

    let tmpOrderList = Object.assign([],orderList);
    const selectedMenu = tmpOrderList[index];
    let itemCnt = selectedMenu?.ITEM_CNT;
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
        var orderPayData = {
            "STORE_ID": STORE_ID,
            "SERVICE_ID": SERVICE_ID,
            "MCHT_ORDERNO": "130",
            "MEMB_TEL": "01012349876",
            "ORDER_MEMO": "태스트 ",
            "OEG_ORDER_PAY_AMT": `${totalResult.grandTotal}`,
            "ORDER_PAY_AMT": `${totalResult.grandTotal}`,
            "DISC_AMT": "0",
            "PREPAY_FLAG": "N",
            "OS_GBN": "AND",
            "FLR_CODE": tableInfo.FLR_CODE,
            "TBL_CODE": tableInfo.TBL_CODE,
            "REPT_PRT_FLAG": "Y",
            "ORDER_PRT_FLAG": "Y",
            "ORD_PAY_LIST":[],
            "ITEM_LIST":tmpOrderList,
        } 
        return {orderList:tmpOrderList,grandTotal:totalResult.grandTotal,totalItemCnt:totalResult.itemCnt, orderPayData:orderPayData };
        //return {orderList:tmpOrderList}
    }
    tmpOrderList[index] = Object.assign({},selectedMenu,{ITEM_CNT:itemCnt});
    const totalResult = grandTotalCalculate(tmpOrderList)
    var orderPayData = {
        "STORE_ID": STORE_ID,
        "SERVICE_ID": SERVICE_ID,
        "MCHT_ORDERNO": "130",
        "MEMB_TEL": "01012349876",
        "ORDER_MEMO": "태스트 ",
        "OEG_ORDER_PAY_AMT": `${totalResult.grandTotal}`,
        "ORDER_PAY_AMT": `${totalResult.grandTotal}`,
        "DISC_AMT": "0",
        "PREPAY_FLAG": "N",
        "OS_GBN": "AND",
        "FLR_CODE": tableInfo.FLR_CODE,
        "TBL_CODE": tableInfo.TBL_CODE,
        "REPT_PRT_FLAG": "Y",
        "ORDER_PRT_FLAG": "Y",
        "ORD_PAY_LIST":[],
        "ITEM_LIST":tmpOrderList,
    } 
    return {orderList:tmpOrderList,grandTotal:totalResult.grandTotal,totalItemCnt:totalResult.itemCnt, orderPayData:orderPayData };
})

export const addToOrderList =  createAsyncThunk("order/addToOrderList", async(_,{dispatch, getState,extra}) =>{
    const {STORE_ID, SERVICE_ID} = await getStoreID()
    .catch(err=>{
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'STORE_ID, SERVICE_ID를 입력 해 주세요.',MSG2:""})
    });

    // 선택된 아이템 정보 받기
    const {displayMenu, allItems} = getState().menu;
    const {orderList} = getState().order;
    const {menuOptionSelected} = _;
    const {tableInfo} = getState().tableInfo;

    if(isEmpty(tableInfo)) {
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'테이블 지정 후 이용하실 수 있습니다.',MSG2:"직원호출을 해 주세요."})
        return
    }

    const menuDetail = allItems.filter(el=>el.ITEM_ID == _.itemID);
    // 기존 주문에 같은 메뉴 있는지 확인
    // 옵션필드 추가
    let additiveList = [];
    if(menuOptionSelected) {
        if(menuOptionSelected.length>0) additiveList=menuOptionSelected;
    }
    //console.log("menuOptionSelected: ",menuOptionSelected)
    var selectedMenuDetail = Object.assign({},menuDetail[0],{"ADDITIVE_ITEM_LIST":additiveList});
    //console.log("selectedMenuDetail:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: ")
    //console.log("selectedMenuDetail: ",selectedMenuDetail)
    //console.log("selectedMenuDetail: ",selectedMenuDetail.ADDITIVE_ITEM_LIST)
    var newOrderList = []; // 새 오더 정렬;
   // 중복메뉴
    let duplicatedItem = orderList.filter(el=> (
        el.ITEM_NAME == selectedMenuDetail.ITEM_NAME && 
        el.ITEM_ID==selectedMenuDetail.ITEM_ID && 
        el.SALE_PRICE==selectedMenuDetail.ITEM_AMT &&
        el.SALE_AMT==selectedMenuDetail.ITEM_AMT &&
        el.ITEM_MENO==selectedMenuDetail.ITEM_MENO &&
        el.ITEM_SET_GBN==selectedMenuDetail.ITEM_SET_GBN &&
        el.ITEM_USE_FLA==selectedMenuDetail.ITEM_USE_FLA &&
        isEqual(el.ADDITIVE_ITEM_LIST,selectedMenuDetail.ADDITIVE_ITEM_LIST)
    ));    
    var addedOrder = {};
    if(duplicatedItem.length>0) {
        //newOrderList = orderList
        addedOrder = Object.assign({},duplicatedItem[0],{"ITEM_CNT":(Number(duplicatedItem[0].ITEM_CNT)+1),"ADDITIVE_ITEM_LIST":additiveList});       
        newOrderList = Object.assign([],orderList);
        let additivePrice = 0;
        if(additiveList.length > 0 ) {
            additiveList?.map(el=>{
                additivePrice = additivePrice+el?.menuOptionSelected.ADDITIVE_PRICE
            })
        }
        addedOrder["SALE_PRICE"] = `${Number(addedOrder["ITEM_AMT"])+additivePrice}`;
        addedOrder["SALE_AMT"] = `${Number(addedOrder["ITEM_AMT"])+additivePrice}`;
        addedOrder["ITEM_MEMO"] = ``;
        addedOrder["ITEM_SEQ"] = `${newOrderList.length}`;
        
        newOrderList[orderList.indexOf(duplicatedItem[0])] = addedOrder;
    }else {
        //addedOrder = Object.assign({},selectedMenuDetail,{"ITEM_CNT":(Number(selectedMenuDetail.ITEM_CNT)+1),"ADDITIVE_ITEM_LIST":[]});
        addedOrder = Object.assign({},selectedMenuDetail,{"ITEM_CNT":1,"ADDITIVE_ITEM_LIST":additiveList});
        let additivePrice = 0;
        if(additiveList.length > 0 ) {
            additiveList?.map(el=>{
                additivePrice = additivePrice+el?.menuOptionSelected.ADDITIVE_PRICE
            })
        }
        addedOrder["SALE_PRICE"] = `${Number(addedOrder["ITEM_AMT"])+additivePrice}`;
        addedOrder["SALE_AMT"] = `${Number(addedOrder["ITEM_AMT"])+additivePrice}`;
        addedOrder["ITEM_MEMO"] = ``;
        addedOrder["ITEM_SEQ"] = `${newOrderList.length}`;

        newOrderList = Object.assign([],orderList);;
        newOrderList.push(addedOrder);    
    }
    // 카트 여닫기
    if(newOrderList.length <= 0) {
        dispatch(setCartView(false));
    }else {
        dispatch(setCartView(true));
    }
    const totalResult = grandTotalCalculate(newOrderList)

    let orderPayData = {
        "STORE_ID": STORE_ID,
        "SERVICE_ID": SERVICE_ID,
        "MCHT_ORDERNO": "130",
        "MEMB_TEL": "0215664551",
        "ORDER_MEMO": " ",
        "OEG_ORDER_PAY_AMT": `${totalResult.grandTotal}`,
        "ORDER_PAY_AMT": `${totalResult.grandTotal}`,
        "DISC_AMT": "0",
        "PREPAY_FLAG": "N",
        "OS_GBN": "AND",
        "FLR_CODE": tableInfo.FLR_CODE,
        "TBL_CODE": tableInfo.TBL_CODE,
        "REPT_PRT_FLAG": "Y",
        "ORDER_PRT_FLAG": "Y",
        "ORD_PAY_LIST":[],
        "ITEM_LIST":newOrderList,
    }
    openPopup(dispatch,{innerView:"AutoClose", isPopupVisible:true,param:{msg:"장바구니에 추가했습니다."}});
    newOrderList.reverse();
    //orderPayData.reverse();
    return {orderList:newOrderList,grandTotal:totalResult.grandTotal,totalItemCnt:totalResult.itemCnt, orderPayData:orderPayData };
})
// 새로 메뉴 등록
export const postToPos =  createAsyncThunk("order/postToPos", async(_,{dispatch, getState,extra}) =>{
    const {orderPayData} = getState().order;
    const {paymentResult, isPrepay} = _;

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
    const {tableInfo} = getState().tableInfo;
    const {orderData} = _;
    return await getOrderByTable(dispatch, {tableInfo ,orderData})
    .catch(err=>{
        console.log("error: ",err)
    });
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

    }
});
