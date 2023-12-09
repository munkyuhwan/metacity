import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux';
import { MENU_DATA } from '../resources/menuData';
import axios from 'axios';
import { adminMenuEdit, adminOptionEdit, getAdminCategories, posMenuEdit, posMenuState, posOrderNew } from '../utils/apis';
import { getAdminCategoryData, getMainCategories, setAllCategories, setMainCategories, setSelectedMainCategory } from './categories';
import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAdminMenuItems, setMenuCategories, setMenuExtra, setOptionExtra } from './menuExtra';
import { CALL_SERVICE_GROUP_CODE } from '../resources/apiResources';
import { setCallServerList } from './callServer';
import { DEFAULT_CATEGORY_ALL_CODE } from '../resources/defaults';
import { getPosItemsAll, getPosItemsWithCategory, getPosMainCategory, getPosMidCategory } from '../utils/api/metaApis';
import { scanFile } from 'react-native-fs';

export const initMenu = createAsyncThunk("menu/initMenu", async(_,{dispatch,getState}) =>{
    // 포스 메인 카테고리
    const mainCategories = await getPosMainCategory(dispatch).catch(err=>{return []});
    let allCategories = Object.assign([],mainCategories);
    if(allCategories?.length > 0 ) {
        // 메인 카테고리 하위 메뉴 받기
        for(var i=0;i<allCategories?.length;i++) {
            const subCategoryResult = await getPosMidCategory(dispatch,{selectedMainCategory:allCategories[i].PROD_L1_CD})
            allCategories[i]["PROD_L2_LIST"] = Object.assign([],subCategoryResult);
        }
        dispatch(setAllCategories({allCategories}));
    }
    
    // 관리자 카테고리 추가 정보
    dispatch(getAdminCategoryData());
    // 관리자 메뉴 정보 받아오기;
    dispatch(getAdminMenuItems());
    // 전체 메뉴 받아오기
    dispatch(getAllItems());
    console.log("allCategories[0]: ",allCategories[0]);
    dispatch(setSelectedMainCategory(allCategories[0]?.PROD_L1_CD));
    return [];
})

export const getDisplayMenu = createAsyncThunk("menu/getDisplayMenu", async(_, {dispatch, getState}) =>{
    const {selectedMainCategory,selectedSubCategory, mainCategories} = getState().categories
    const {allItems} = getState().menu;

    let mCat ="";
    let sCat = "";
    if(selectedMainCategory == "0" || selectedMainCategory == undefined ) {
        mCat=mainCategories[0];
    }
    if(selectedSubCategory == "0" || selectedSubCategory == undefined ) {
        sCat= "0000"
    } 

    let itemResult = [];
    itemResult = await getPosItemsWithCategory(dispatch, {selectedMainCategory:mCat,selectedSubCategory:sCat});
    
    let selectedItems = []
    if(selectedSubCategory == "0000") {
        selectedItems = allItems.filter(el=>el.PROD_L1_CD == selectedMainCategory); 
    }else {
        selectedItems = allItems.filter(el=>el.PROD_L1_CD == selectedMainCategory && el.PROD_L2_CD == selectedSubCategory ); 
    }
    return selectedItems;
})

export const updateMenu = createAsyncThunk("menu/updateMenu", async(_,{rejectWithValue}) =>{
    return await posOrderNew();
})
// 전체 아이템 받아오기
export const getAllItems = createAsyncThunk("menu/getAllItems",async(_,{dispatcy,getstate})=>{
    const result = await getPosItemsAll().catch(err=>{return;});
    return result;
})

export const getMenuState = createAsyncThunk("menu/menuState", async(_,{dispatch}) =>{
    const resultData = await posMenuState(dispatch);
    if(!resultData) {
        return
    }else {
        const isUpdated = resultData?.OBJ.UPDATE_YN;
        const updateDateTime = resultData?.OBJ.UPDATE_DTIME.slice(0,14);

        if(isUpdated=="Y") {
            // 날짜 기준 메뉴 업트가 있으면 새로 받아 온다.
            AsyncStorage.setItem("lastUpdate",updateDateTime);
         
        }
    }
})
// Slice
export const menuSlice = createSlice({
    name: 'menu',
    initialState: {
        menu: [],
        displayMenu:[],
        allItems:[],
    },
    extraReducers:(builder)=>{
        // 메인 카테고리 받기
        builder.addCase(getDisplayMenu.fulfilled,(state, action)=>{
            if(action.payload) {
                state.displayMenu = action.payload;
            }
        })
        builder.addCase(initMenu.fulfilled,(state, action)=>{
            state.menu = action.payload;
        })

        builder.addCase(updateMenu.fulfilled,(state, action)=>{
            //console.log("update fulfilled: ",action.payload);
            //const payload = action.payload;
            //console.log("data: ",payload.data) 
            //console.log("status: ",payload.status)
            //console.log("state: ",state);
            /* if(payload.ERRCODE != "") { 
                state.menu = action.payload;
            }else {
                state.errorCode = action.payload.ERRORCODE
                state.errorCode = action.payload.MSG
            } */
        })
        builder.addCase(getMenuState.fulfilled,(state, action)=>{

        })
        builder.addCase(getAllItems.fulfilled,(state, action)=>{
            state.allItems = action.payload;
        })
        /* 
        builder.addCase(getMenuEdit.fulfilled,(state, action)=>{
            state.menu = action.payload.menu;
            state.allItems = action.payload.allItems;
        })
 */
    }
});

