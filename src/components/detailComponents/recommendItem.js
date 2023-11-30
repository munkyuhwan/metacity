import React, { useEffect, useRef, useState } from 'react'
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RecommendItemDim, RecommendItemImage, RecommendItemImageWrapper, RecommendItemInfoChecked, RecommendItemInfoPrice, RecommendItemInfoTitle, RecommendItemInfoWrapper, RecommendItemWrapper } from '../../styles/main/detailStyle';
import { MENU_DATA } from '../../resources/menuData';
import {isEmpty} from "lodash";
import { getSingleMenu, getSingleMenuFromAllItems, setMenuDetail } from '../../store/menuDetail';
import { addToOrderList } from '../../store/order';

const RecommendItem = (props) => {
    const recommentItemID = props?.recommendData
    const {allItems} = useSelector(state=>state.menu);
    const {menuExtra} = useSelector(state=>state.menuExtra);
    const {language} =  useSelector(state=>state.languages);
    const dispatch = useDispatch();

    //console.log("menu:",allItems);
    const recItem = allItems.filter(item => item.ITEM_ID == recommentItemID);
    //const recommendData = props?.recommendData;
    //const menuData = props?.menuData;
    // 메뉴 추가정보 찾기
    //console.log(menuExtra); 
    const itemExtra = menuExtra.filter(el=>el.pos_code == recommentItemID);
    //console.log("itemExtra: ",itemExtra);
    
    if(isEmpty(recItem)) return(<></>)

    const ItemTitle = () =>{
        let selTitleLanguage = "";
        const selExtra = menuExtra.filter(el=>el.pos_code==recommentItemID);
        if(language=="korean") {
            selTitleLanguage = recItem[0]?.ITEM_NAME;
        }
        else if(language=="japanese") {
            selTitleLanguage = selExtra[0]?.gname_jp;
        }
        else if(language=="chinese") {
            selTitleLanguage = selExtra[0]?.gname_cn;
        }
        else if(language=="english") {
            selTitleLanguage = selExtra[0]?.gname_en;
        }
        return selTitleLanguage;
    }
    
    return(
        <>
            <TouchableWithoutFeedback onPress={()=>{dispatch(addToOrderList({itemID:recommentItemID})); /* dispatch(setMenuDetail(recommentItemID)); */ }}>
                <RecommendItemWrapper>
                    <RecommendItemImageWrapper>
                        <RecommendItemImage  source={{uri:`${"https:"+itemExtra[0]?.gimg_chg}`}}/>

                        <RecommendItemDim isSelected={props?.isSelected}/>
                        {props?.isSelected &&
                            <RecommendItemInfoChecked isSelected={props?.isSelected} source={require("../../assets/icons/check_red.png")}/>
                        }
                    </RecommendItemImageWrapper>
                    <RecommendItemInfoWrapper>
                        <RecommendItemInfoTitle>{ItemTitle()||recItem[0]?.ITEM_NAME}</RecommendItemInfoTitle>
                        <RecommendItemInfoPrice>{recItem[0]?.ITEM_AMT==null?"":Number(recItem[0]?.ITEM_AMT ).toLocaleString(undefined,{maximumFractionDigits:0}) } 원</RecommendItemInfoPrice>
                    </RecommendItemInfoWrapper>
                </RecommendItemWrapper>
            </TouchableWithoutFeedback>
        </>
    )
     
}
export default RecommendItem;