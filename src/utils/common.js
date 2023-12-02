import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFullPopupContent, setFullPopupVisibility, setPopupContent, setPopupVisibility, setTransPopupContent, setTransPopupVisibility } from '../store/popup';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function openPopup (dispatch, {innerView, isPopupVisible, param}) {
    if(isPopupVisible) {
        dispatch(setPopupContent({innerView:innerView,param:param})); 
        dispatch(setPopupVisibility({isPopupVisible:isPopupVisible}));    
    }else {
        dispatch(setPopupVisibility({isPopupVisible:isPopupVisible}));        
        dispatch(setPopupContent({innerView:innerView})); 
    }
}
export function openTransperentPopup (dispatch, {innerView, isPopupVisible}) {
    if(isPopupVisible) {
        dispatch(setTransPopupContent({innerView:innerView})); 
        dispatch(setTransPopupVisibility({isPopupVisible:isPopupVisible}));    
    }else {
        dispatch(setTransPopupVisibility({isPopupVisible:isPopupVisible}));    
        const disapearTimeout = setInterval(()=>{
            dispatch(setTransPopupContent({innerView:innerView})); 
            clearInterval(disapearTimeout);
        },500)
    } 
    dispatch(setTransPopupVisibility({isPopupVisible:isPopupVisible}));    
}

export function openFullSizePopup (dispatch, {innerFullView, isFullPopupVisible}) {
    if(isFullPopupVisible) {
        dispatch(setFullPopupContent({innerFullView:innerFullView})); 
        dispatch(setFullPopupVisibility({isFullPopupVisible:isFullPopupVisible}));    
    }else {
        dispatch(setFullPopupVisibility({isFullPopupVisible:isFullPopupVisible}));    
        const disapearTimeout = setInterval(()=>{
            dispatch(setFullPopupContent({innerFullView:innerFullView})); 
            clearInterval(disapearTimeout);
        },500)
    } 
    dispatch(setFullPopupVisibility({isFullPopupVisible:isFullPopupVisible}));    
}

export function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

export function grandTotalCalculate(data) {
    let amt = 0;
    let itemCnt = 0;
    if(data) {
        data?.map(el=>{
            amt += el.ITEM_AMT*el.ITEM_QTY;
            itemCnt += el.ITEM_QTY;
        })
    }
    return {grandTotal:amt, itemCnt:itemCnt};
}

export function numberPad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

export async function getStoreID() {
    return await new Promise(function(resolve, reject){
        AsyncStorage.getItem("STORE_ID")
        .then((STORE_ID)=>{
            if(STORE_ID) {
                AsyncStorage.getItem("SERVICE_ID")
                .then((SERVICE_ID)=>{
                    if(SERVICE_ID) {
                        resolve({STORE_ID,SERVICE_ID})
                    }else {
                        reject();
                    }
                })
            }else {
                reject();                
            }
            
        })
        
    })
}

export function setOrderData (data, orderList) {
    if(data?.length<0) return;
    
    let setMenuData = 
        {
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
            [
            ] 
          }
    
          setMenuData.ITEM_SEQ=orderList.length+1;
          setMenuData.ITEM_CD = data?.PROD_CD;
          setMenuData.ITEM_NM= data?.PROD_NM;
          setMenuData.ITEM_QTY=  1;
          setMenuData.ITEM_AMT=  data?.SAL_TOT_AMT;
          setMenuData.ITEM_VAT=  data?.SAL_VAT;
          setMenuData.ITEM_DC = 0;
          setMenuData.ITEM_CANCEL_YN= "N";
          setMenuData.ITEM_GB =  "N"; //포장 여부 포장"T"
          setMenuData.ITEM_MSG = "";
          setMenuData.SETITEM_CNT = 0;
          setMenuData.SETITEM_INFO=[];
      
    return setMenuData;
}

// 주문 리스트 중복 체크
export function orderListDuplicateCheck (orderList, orderData) {
    console.log("orderListDuplicateCheck========================================================");
    //console.log(orderList);
    if(orderList.length>0) {
        // 중복 체크
        orderList.map(el=>{
            console.log("el: ", el)
        })

    }
    
    return orderList;
}


/* 
 */