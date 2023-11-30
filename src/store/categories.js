import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { MENU_DATA } from '../resources/menuData';
import { stat } from 'react-native-fs';
import { getPosMainCategory, getPosMidCategory } from '../utils/api/metaApis';
import { getAdminMainCategory } from '../utils/api/adminApi';
import { setMenuCategories } from './menuExtra';

export const setCategories = createAsyncThunk("categories/setCategories", async(data) =>{
    return data;
})
// 어드민 카테고리 추가 정보 받아오기
export const getAdminCategoryData = createAsyncThunk("categories/getAdminCategoryData", async(_,{dispatch}) =>{
    const adminResult = await getAdminMainCategory(dispatch);
    dispatch(setMenuCategories(adminResult));
    return []; 
})
// 메인 카테고리 받기
export const getMainCategories = createAsyncThunk("categories/getMainCategories", async(_,{dispatch}) =>{
    const result = await getPosMainCategory(dispatch);
    return result;
})
// 서브 카테고리 받기
export const getSubCategories = createAsyncThunk("categories/getSubCategories", async(data,{dispatch,getState}) =>{
    const {selectedMainCategory} = getState().categories;
    console.log("selectedMainCategory: ",selectedMainCategory);
    const postMidCategories = await dispatch(getPosMidCategory(dispatch, {selectedMainCategory:selectedMainCategory}));

    return data
})
export const setMainCategories = createAsyncThunk("categories/setMainCategories", async(_)=>{
    return _;
});

export const setSelectedMainCategory = createAsyncThunk("categories/setSelectedMainCategory", async(index,{getState,dispatch}) =>{
    return index;
})
export const setSelectedSubCategory = createAsyncThunk("categories/setSelectedSubCategory", async(index) =>{
    return index
})
// Slice
export const cagegoriesSlice = createSlice({
    name: 'categories',
    initialState: {
        categoryData:[],
        mainCategories:[],
        selectedMainCategory:0,
        subCategories:[],
        selectedSubCategory:0,
    },
    extraReducers:(builder)=>{
        // set categories
        builder.addCase(setCategories.fulfilled,(state, action)=>{
            const payload = action.payload;
            const keys = Object.keys(payload)
            if(keys.length>0) {
                keys.map(el=>{
                    state[el] = action.payload[el];
                })
            }
        })
        // 메인 카테고리 받기
        builder.addCase(getMainCategories.fulfilled,(state, action)=>{
            state.mainCategories = action.payload;
        })
        // 메인 카테고리 업데이트
        builder.addCase(setMainCategories.fulfilled,(state, action)=>{
            state.mainCategories = action.payload;
        })
        // 메인 카테고리 선택
        builder.addCase(setSelectedMainCategory.fulfilled,(state, action)=>{
            //state.subCategories = MENU_DATA.categories[action.payload].subCategories||[]
            state.selectedMainCategory = action.payload;
        })
        // 서브 카테고리 받기
        builder.addCase(getSubCategories.fulfilled,(state, action)=>{
            state.subCategories = action.payload;
        })
        // 서브 카테고리 선택
        builder.addCase(setSelectedSubCategory.fulfilled,(state, action)=>{
            state.selectedSubCategory = action.payload;
        })
    }
});

