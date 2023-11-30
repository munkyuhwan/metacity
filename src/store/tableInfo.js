import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getAdminTableStatus, posTableList } from '../utils/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo, { getUniqueId, getManufacturer, getAndroidId } from 'react-native-device-info';

export const initTableInfo =  createAsyncThunk("tableInfo/initTableInfo", async() =>{
    const getTableInfo = await AsyncStorage.getItem("tableInfo");
    if(getTableInfo==null) {
        return{};
    }else {
        return JSON.parse(getTableInfo);
    }
})
export const clearTableInfo = createAsyncThunk("tableInfo/clearTableInfo", async() =>{
    return {};
})
export const setTableInfo = createAsyncThunk("tableInfo/setTableInfo", async(data) =>{
    const result = await AsyncStorage.setItem("tableInfo", JSON.stringify(data) );
    const uniqueId = await getAndroidId();

    return data;    
})
export const getTableList = createAsyncThunk("tableInfo/getTableList", async(data,{dispatch}) =>{
    return await posTableList(dispatch)
})
// 관리자 테이블 상테 받아오기
export const getTableStatus = createAsyncThunk("tableInfo/getTableStatus", async(data,{dispatch, getState}) =>{
    const {tableInfo} = getState().tableInfo;
    const t_id = tableInfo?.TBL_CODE;
    if(t_id) {
        const tableStatus = await getAdminTableStatus(dispatch, {t_id:t_id});
        const tableData = tableStatus?.data[0].table;
        const tStatus = tableData[0];
        return tStatus;
    }
})

// Slice
export const tableInfoSlice = createSlice({
    name: 'tableInfo',
    initialState: {
        tableInfo:{},
        tableList:[],
        tableStatus:{},
        tableCode:"0001",
    },
    extraReducers:(builder)=>{
        // 메인 카테고리 받기
        builder.addCase(setTableInfo.fulfilled,(state, action)=>{
            state.tableInfo = action.payload;
        })
        builder.addCase(getTableList.fulfilled,(state, action)=>{
            state.tableList = action.payload;
        })
        builder.addCase(clearTableInfo.fulfilled,(state, action)=>{
            state.tableInfo = action.payload;
        })
        builder.addCase(initTableInfo.fulfilled,(state, action)=>{
            state.tableInfo = action.payload;
        })
        builder.addCase(getTableStatus.fulfilled, (state,action)=>{
            state.tableStatus = action.payload
        })
        
    }
});

