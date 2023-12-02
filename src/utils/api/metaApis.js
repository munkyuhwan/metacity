import axios from "axios";
import { posErrorHandler } from "./errorHandler/ErrorHandler";
import { POS_BASE_URL, POS_VERSION_CODE, POS_WORK_CD_MAIN_CAT, POS_WORK_CD_MENU_ITEMS, POS_WORK_CD_MID_CAT, POS_WORK_CD_SET_GROUP_INFO } from "../../resources/apiResources";
import { displayErrorPopup, metaErrorHandler } from "../errorHandler/metaErrorHandler";

const posOrderHeader = {Accept: 'application/json','Content-Type': 'application/json'}
const adminOrderHeader = {'Content-Type' : "text/plain"};

// 포스 메인카테고리
export const  getPosMainCategory = async(dispatch) =>{
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL}`,
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
    const selectedMainCategory = data?.selectedMainCategory;
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL}`,
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
    const {selectedMainCategory,selectedSubCategory,menuDetailID} = data;
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL}`,
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
    const {menuDetailID} = data;
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL}`,
            {VERSION:POS_VERSION_CODE, WORK_CD:POS_WORK_CD_SET_GROUP_INFO, PROD_CD:menuDetailID?menuDetailID:""},
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

// 주문하기 
export const postMetaPosOrder = async(dispatch, data) =>{

    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL}`,
            data,
            posOrderHeader,
        ) 
        .then((response => {
            if(metaErrorHandler(dispatch, response?.data)) {
                resolve()
            }    
        })) 
        .catch(error=>{
            displayErrorPopup(dispatch,"XXXX",`포스에 연동할 수 없습니다.`);
            reject(error.response.data)
        });
    }) 
}


