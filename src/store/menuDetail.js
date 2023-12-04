import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux';
import { getPosItemsWithCategory, getPosSetGroup, getPosSetGroupItem } from '../utils/api/metaApis';
import { posErrorHandler } from '../utils/errorHandler/ErrorHandler';

export const initMenuDetail = createAsyncThunk("menuDetail/initMenuDetail", async() =>{
    return {menuDetailID: null,menuDetail:{},menuOptionGroupCode:"",menuOptionList:[],menuOptionSelected:[],};
})

export const setMenuDetail = createAsyncThunk("menuDetail/setMenuDetail", async(_) =>{
    const index = _.itemID;
    return index;
})
export const getSingleMenu = createAsyncThunk("menuDetail/getSingleMenu", async(itemID,{getState}) =>{
    const {displayMenu} = getState().menu;
    const selectedMenuDetail = displayMenu.filter(el=>el.ITEM_ID == itemID);
    return selectedMenuDetail[0];
});
export const getSingleMenuFromAllItems = createAsyncThunk("menuDetail/getSingleMenuFromAllItems", async(itemID,{dispatch, getState}) =>{
    const {selectedMainCategory,selectedSubCategory} = getState().categories
    const {menuDetailID} = getState().menuDetail;
    if(selectedMainCategory == "0" || selectedMainCategory == undefined ) {
        return
    }
    if(selectedSubCategory == "0" || selectedSubCategory == undefined ) {
        return
    } 
    const singleItemResult = await getPosItemsWithCategory(dispatch, {selectedMainCategory,selectedSubCategory,menuDetailID});
    return singleItemResult[0];
});
// 추천 메뉴를 위한 단일 메뉴 받기

export const getSingleMenuForRecommend = createAsyncThunk("menuDetail/getSingleMenuForRecommend", async(_,{dispatch, getState}) =>{
    const {selectedMainCategory,selectedSubCategory} = getState().categories
    const {menuDetailID} = getState().menuDetail;
    const {related} = _;
    if(selectedMainCategory == "0" || selectedMainCategory == undefined ) {
        return
    }
    if(selectedSubCategory == "0" || selectedSubCategory == undefined ) {
        return
    } 
    //const singleItemResult = await getPosItemsWithCategory(dispatch, {selectedMainCategory,selectedSubCategory,menuDetailID});
    //return singleItemResult[0];
    //const {allItems} = getState().menu;
    //const selectedMenuDetail = allItems.filter(el=>el.ITEM_ID == itemID);
    //return selectedMenuDetail[0];
});

// 세트 그룹 받기
export const getItemSetGroup = createAsyncThunk("menuDetail/getItemSetGroup", async(data,{dispatch,getState}) =>{
    const {menuDetailID} = getState().menuDetail;
    const setGroup = await getPosSetGroup(dispatch,{menuDetailID} );
    return setGroup;
});
// 세트 그룹 아이템 받기
export const getSetItems = createAsyncThunk("menuDetail/getSetItems", async(data,{dispatch,getState}) =>{
    const {menuOptionGroupCode} = getState().menuDetail;
    const {selectedMainCategory,selectedSubCategory} = getState().categories
    const setGroupItem = await getPosSetGroupItem(dispatch,{menuOptionGroupCode}).catch(err=>{ posErrorHandler(dispatch, {ERRCODE:"XXXX",MSG:"통신",MSG2:"아이템을 받아올 수 없습니다."}); return;});
    //const setGroup = await getPosSetGroup(dispatch,{menuDetailID} );
    const displaySetItem = [];
    if(setGroupItem) {
        if(setGroupItem.length > 0) {
            for(var i=0;i<setGroupItem.length;i++) {
                const groupItemDetail = await getPosItemsWithCategory(dispatch,{selectedMainCategory:"",selectedSubCategory:"",menuDetailID:setGroupItem[i].PROD_I_CD});
                displaySetItem.push(groupItemDetail[0]);
            }
        }
    }
    return displaySetItem;
});

export const setMenuOptionSelect = createAsyncThunk("menuDetail/setMenuOptionSelect", async(data) =>{
    return data;
});
export const setMenuOptionSelectInit = createAsyncThunk("menuDetail/setMenuOptionSelectInit", async() =>{
    return {menuOptionSelect: []};
});
export const setMenuOptionSelected = createAsyncThunk("menuDetail/setMenuOptionSelected", async(data,{getState}) =>{
    const {menuOptionSelected, menuOptionGroupCode} = getState().menuDetail;
    let newOptSelect= menuOptionSelected.filter(el=>el.menuOptionGroupCode!=menuOptionGroupCode);
    newOptSelect.push({menuOptionGroupCode:menuOptionGroupCode,menuOptionSelected:data})
    return newOptSelect;
});
export const setMenuOptionGroupCode = createAsyncThunk("menuDetail/setMenuOptionGroupCode", async(data) =>{
    return data;
});

// Slice
export const menuDetailSlice = createSlice({
    name: 'menuDetail',
    initialState: {
        menuDetailID: null,
        menuDetail:{},
        menuOptionGroupCode:"",
        menuOptionList:[],
        menuOptionSelected:[],
        setGroupItem:[],
        menuRecommendItems:[],
    },
    extraReducers:(builder)=>{
        initMenuDetail
        // 메뉴 상세 초기화
        builder.addCase(initMenuDetail.fulfilled,(state, action)=>{
            state.menuDetailID = action.payload.menuDetailID;
            state.menuDetail = action.payload.menuDetail;
            state.menuOptionGroupCode = action.payload.menuOptionGroupCode;
            state.menuOptionList = action.payload.menuOptionList;
            state.menuOptionSelected = action.payload.menuOptionSelected;
        })
        // 메인 카테고리 받기
        builder.addCase(setMenuDetail.fulfilled,(state, action)=>{
            state.menuDetailID = action.payload;
        })
        // 메뉴 상세 받기
        builder.addCase(getSingleMenu.fulfilled,(state, action)=>{
            state.menuDetail = action.payload;
        })
        // 메뉴 상세 받기 전체 메 스테이트에서
        builder.addCase(getSingleMenuFromAllItems.fulfilled,(state, action)=>{
            state.menuDetail = action.payload;
        })
        // 메뉴 옵션 셋
        builder.addCase(setMenuOptionSelect.fulfilled,(state, action)=>{
            state.menuOptionList = action.payload;
        })
        // 메뉴 옵션 초기화
        builder.addCase(setMenuOptionSelectInit.fulfilled,(state, action)=>{
            state.menuOptionList = action.payload;
        })
        // 메뉴 옵션 선택
        builder.addCase(setMenuOptionSelected.fulfilled,(state, action)=>{
            state.menuOptionSelected = action.payload;
        })
        
        // 메뉴 옵션 그룹
        builder.addCase(setMenuOptionGroupCode.fulfilled,(state, action)=>{
            state.menuOptionGroupCode = action.payload;
        })

        // 메뉴 세트 그룹 
        builder.addCase(getItemSetGroup.fulfilled,(state, action)=>{
            state.menuOptionList = action.payload;
        })
        // 메뉴 세트 그룹 아이템 
        builder.addCase(getSetItems.fulfilled,(state, action)=>{
            state.setGroupItem = action.payload;
        })
        // 추천 메뉴
        builder.addCase(getSingleMenuForRecommend.fulfilled,(state, action)=>{
            state.menuRecommendItems = action.payload;
        })
        
    }
});

