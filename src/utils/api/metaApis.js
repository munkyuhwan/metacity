import axios from "axios";
import { posErrorHandler } from "./errorHandler/ErrorHandler";
import { POS_BASE_URL, POS_VERSION_CODE, POS_WORK_CD_MAIN_CAT, POS_WORK_CD_MID_CAT } from "../../resources/apiResources";
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
export const  getPosMidCategory = async(dispatch) =>{
    
    return await new Promise(function(resolve, reject){
        axios.post(
            `${POS_BASE_URL}`,
            {VERSION:POS_VERSION_CODE, WORK_CD:POS_WORK_CD_MID_CAT,PROD_L1_CD:"",PROD_L2_CD:"",PROD_L1_NM:""},
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