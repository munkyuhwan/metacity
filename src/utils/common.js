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
            amt += el.SALE_PRICE*el.ITEM_CNT;
            itemCnt += el.ITEM_CNT;
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

/* 
 */