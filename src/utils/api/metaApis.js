import axios from "axios";
import { posErrorHandler } from "../errorHandler/ErrorHandler";

import { POS_BASE_URL, POS_VERSION_CODE, POS_WORK_CD_MAIN_CAT, POS_WORK_CD_MENU_ITEMS, POS_WORK_CD_MID_CAT, POS_WORK_CD_SET_GROUP_INFO, POS_WORK_CD_SET_GROUP_ITEM_INFO, POS_WORK_CD_TABLE_ORDER_LIST, POS_WORK_CD_VERSION } from "../../resources/apiResources";
import { displayErrorPopup, metaErrorHandler } from "../errorHandler/metaErrorHandler";
import { getIP, getStoreID, getTableInfo, openPopup } from "../common";
import { EventRegister } from "react-native-event-listeners";
import {isEmpty} from 'lodash';

const posOrderHeader = {Accept: 'application/json','Content-Type': 'application/json'}
const adminOrderHeader = {'Content-Type' : "text/plain"};

// 포스 메인카테고리
export const  getPosMainCategory = async(dispatch) =>{
    const {POS_IP} = await getIP()
    if(isEmpty(POS_IP)) {
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'포스 IP를 입력 해 주세요.',MSG2:""})
        return;
    }
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL(POS_IP)}`,
            {VERSION:POS_VERSION_CODE, WORK_CD:POS_WORK_CD_MAIN_CAT,PROD_L1_CD:"",PROD_L1_NM:""},
            posOrderHeader,
        ) 
        .then((response => {
            if(metaErrorHandler(dispatch, response?.data)) {
                const data = response?.data;
                const catMainList = data.PROD_L1_LIST;
                resolve(catMainList);
            }     
        })) 
        .catch(error=>{
            displayErrorPopup(dispatch,"XXXX",`포스에 연동할 수 없습니다.`);
            reject(error.response.data)
        });
    }) 
}
// 포스 중 카테고리
export const  getPosMidCategory = async(dispatch, data) =>{
    const {POS_IP} = await getIP()
    if(isEmpty(POS_IP)) {
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'포스 IP를 입력 해 주세요.',MSG2:""})
        return;
    }
    const selectedMainCategory = data?.selectedMainCategory;
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL(POS_IP)}`,
            {VERSION:POS_VERSION_CODE, WORK_CD:POS_WORK_CD_MID_CAT, PROD_L1_CD:selectedMainCategory, PROD_L2_CD:"", PROD_L2_NM:""},
            posOrderHeader,
        ) 
        .then((response => {
            if(metaErrorHandler(dispatch, response?.data)) {
                const data = response?.data;
                const catMidList = data.PROD_L2_LIST;
                resolve(catMidList);
            }    
        })) 
        .catch(error=>{
            displayErrorPopup(dispatch,"XXXX",`포스에 연동할 수 없습니다.`);
            reject(error.response.data)
        });
    }) 
}
// 포스 카테고리별 메뉴 받아오기
export const getPosItemsWithCategory = async(dispatch, data) =>{
    const {POS_IP} = await getIP()
    if(isEmpty(POS_IP)) {
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'포스 IP를 입력 해 주세요.',MSG2:""})
        return;
    }
    const {selectedMainCategory,selectedSubCategory,menuDetailID} = data;
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL(POS_IP)}`,
            {VERSION:POS_VERSION_CODE, WORK_CD:POS_WORK_CD_MENU_ITEMS, PROD_L1_CD:selectedMainCategory, PROD_L2_CD:selectedSubCategory=="0000"?"":selectedSubCategory,PROD_L3_CD:"", PROD_CD:menuDetailID?menuDetailID:"",PROD_NM:""},
            posOrderHeader,
        ) 
        .then((response => {
            if(metaErrorHandler(dispatch, response?.data)) {
                const data = response?.data;
                const itemList = data.PROD_LIST;
                resolve(itemList);
            }    
        })) 
        .catch(error=>{
            displayErrorPopup(dispatch,"XXXX",`포스에 연동할 수 없습니다.`);
            reject(error.response.data)
        });
    }) 
}

// 세트 그룹 받기
export const getPosSetGroup = async(dispatch, data) =>{
    const {POS_IP} = await getIP()
    if(isEmpty(POS_IP)) {
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'포스 IP를 입력 해 주세요.',MSG2:""})
        return;
    }
    const {menuDetailID} = data;
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL(POS_IP)}`,
            {VERSION:POS_VERSION_CODE, WORK_CD:POS_WORK_CD_SET_GROUP_INFO, PROD_CD:menuDetailID?menuDetailID:""},
            posOrderHeader,
        ) 
        .then((response => {
            if(metaErrorHandler(dispatch, response?.data)) {
                const data = response?.data;
                const setgrpInfo = data.SETGRP_INFO;
                resolve(setgrpInfo);
            }    
        })) 
        .catch(error=>{
            displayErrorPopup(dispatch,"XXXX",`포스에 연동할 수 없습니다.`);
            reject(error.response.data)
        });
    }) 
}

// 세트 그룹 아이템 받기
export const getPosSetGroupItem = async(dispatch, data) =>{
    const {POS_IP} = await getIP()
    if(isEmpty(POS_IP)) {
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'포스 IP를 입력 해 주세요.',MSG2:""})
        return;
    }
    const {menuOptionGroupCode} = data;
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL(POS_IP)}`,
            {VERSION:POS_VERSION_CODE, WORK_CD:POS_WORK_CD_SET_GROUP_ITEM_INFO, GROUP_NO:menuOptionGroupCode?menuOptionGroupCode:""},
            posOrderHeader,
        ) 
        .then((response => {
            if(metaErrorHandler(dispatch, response?.data)) {
                const data = response?.data;
                const setgrpItemInfo = data.SETITEM_INFO;
                resolve(setgrpItemInfo);
            }    
        })) 
        .catch(error=>{
            displayErrorPopup(dispatch,"XXXX",`포스에 연동할 수 없습니다.`);
            reject(error.response.data)
        });
    }) 
}
// 주문하기 
export const postMetaPosOrder = async(dispatch, data) =>{
    const {POS_IP} = await getIP()
    if(isEmpty(POS_IP)) {
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'포스 IP를 입력 해 주세요.',MSG2:""})
        return;
    }
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL(POS_IP)}`,
            data,
            posOrderHeader,
        ) 
        .then((response => {
            if(metaErrorHandler(dispatch, response?.data)) {
                openPopup(dispatch,{innerView:"OrderComplete", isPopupVisible:true});
                resolve()
            }    
        })) 
        .catch(error=>{
            displayErrorPopup(dispatch,"XXXX",`포스에 연동할 수 없습니다.`);
            reject(error.response.data)
        });
    }) 
}
// 테이블 주문 목록 받기
export const getTableOrderList = async(dispatch, data) =>{
    const {POS_IP} = await getIP()
    if(isEmpty(POS_IP)) {
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'포스 IP를 입력 해 주세요.',MSG2:""})
        return;
    }
    const {TABLE_INFO} = await getTableInfo()
    if(isEmpty(TABLE_INFO)) {
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:'테이블 정보가 없습니다.',MSG2:""})
        return;
    }
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL(POS_IP)}`,
            {
                "VERSION" : POS_VERSION_CODE,
                "WORK_CD" : POS_WORK_CD_TABLE_ORDER_LIST,
                "TBL_NO" : TABLE_INFO
            },
            posOrderHeader,
        ) 
        .then((response => {
            if(metaErrorHandler(dispatch, response?.data)) {
                const itemInfo = response?.data?.ITEM_INFO;
                //openPopup(dispatch,{innerView:"OrderComplete", isPopupVisible:true});
                resolve(itemInfo)
            }    
        })) 
        .catch(error=>{
            displayErrorPopup(dispatch,"XXXX",`포스에 연동할 수 없습니다.`);
            reject(error.response.data)
        });
    }) 
}



