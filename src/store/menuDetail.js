import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux';

export const initMenuDetail = createAsyncThunk("menuDetail/initMenuDetail", async() =>{
    return {menuDetailID: null,menuDetail:{},menuOptionGroupCode:"",menuOptionList:[],menuOptionSelected:[],};
})

export const setMenuDetail = createAsyncThunk("menuDetail/setMenuDetail", async(index) =>{
    return index;
})
export const getSingleMenu = createAsyncThunk("menuDetail/getSingleMenu", async(itemID,{getState}) =>{
    const {displayMenu} = getState().menu;
    const selectedMenuDetail = displayMenu.filter(el=>el.ITEM_ID == itemID);
    return selectedMenuDetail[0];
});
export const getSingleMenuFromAllItems = createAsyncThunk("menuDetail/getSingleMenuFromAllItems", async(itemID,{getState}) =>{
    const {allItems} = getState().menu;
    const selectedMenuDetail = allItems.filter(el=>el.ITEM_ID == itemID);
    return selectedMenuDetail[0];
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
    console.log("reducer gropu code: ",data);
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
        getSingleMenuFromAllItems
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
    }
});

