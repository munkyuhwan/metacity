import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Animated,FlatList,Image,Text,TouchableWithoutFeedback } from 'react-native'
import { MenuImageDefault, MenuImageDefaultWrapper, MenuItemBottomWRapper, MenuItemButton, MenuItemButtonInnerWrapper, MenuItemButtonInnerWrapperLeft, MenuItemButtonInnerWrapperRight, MenuItemButtonWrapper, MenuItemHotness, MenuItemHotnessWrapper, MenuItemImage, MenuItemImageWrapper, MenuItemInfoWRapper, MenuItemName, MenuItemPrice, MenuItemTopWrapper, MenuItemWrapper, SoldOutDimLayer, SoldOutDimLayerAbs, SoldOutLayer, SoldOutText } from '../../styles/main/menuListStyle';
import FastImage from 'react-native-fast-image';
import { RADIUS, RADIUS_DOUBLE } from '../../styles/values';
import { setMenuDetail } from '../../store/menuDetail';
import { addToOrderList } from '../../store/order';
import { MENU_DATA } from '../../resources/menuData';
import { colorWhite } from '../../assets/colors/color';
import {isEmpty} from 'lodash'
/* 메인메뉴 메뉴 아이템 */
const MenuItem = ({item,index,setDetailShow}) => {
    //<MenuItemImage />    
    //console.log("item: ",item);
    // 포스 api ITEM_ID 는 관리자 api에서 pos_code임
    const dispatch = useDispatch();
    const {menuExtra} = useSelector(state=>state.menuExtra);
    const {language} =  useSelector(state=>state.languages);
    if(isEmpty(item)) {
        return <></>
    }
    if(isEmpty(menuExtra)) {
        return <></>
    }
    // 이미지 찾기
    const itemExtra = menuExtra?.filter(el=>el.pos_code == item.ITEM_ID);
    const itemID = item.ITEM_ID;
    const imgUrl = "https:"+itemExtra[0]?.gimg_chg;
    //const itemTitle=>{} item.ITEM_NAME;
    const itemTitle = () => {
        let selTitleLanguage = "";
        if(itemExtra) {
        const selExtra = itemExtra?.filter(el=>el.pos_code==item.ITEM_ID);
            if(language=="korean") {
                selTitleLanguage = item.ITEM_NAME;
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
        }else {
            selTitleLanguage = item.ITEM_NAME;
        }
        return selTitleLanguage;
    }
    const itemPrice= item.ITEM_AMT;


    return(
        <>
            <MenuItemWrapper>
                <MenuItemTopWrapper>
                    {imgUrl &&
                        <>
                            <TouchableWithoutFeedback onPress={()=>{setDetailShow(true); dispatch(setMenuDetail(itemID)); }} >
                                <FastImage style={{ width:'100%',height:183,resizeMode:"background",borderRadius:RADIUS_DOUBLE}} source={{uri:imgUrl}}/>
                            </TouchableWithoutFeedback>
                        </>
                    }
                    {!imgUrl &&
                        <TouchableWithoutFeedback onPress={()=>{setDetailShow(true); dispatch(setMenuDetail(itemID)); }} >
                            <MenuImageDefaultWrapper>
                                <MenuImageDefault source={require("../../assets/icons/logo.png")}/>
                            </MenuImageDefaultWrapper>
                        </TouchableWithoutFeedback>
                    }
                    
                    <MenuItemImageWrapper>
                        <MenuItemHotnessWrapper>
                        {itemExtra[0]?.is_new=='Y'&&
                            <MenuItemHotness source={require('../../assets/icons/new.png')} />
                        }
                        {itemExtra[0]?.is_best=='Y'&&
                            <MenuItemHotness source={require('../../assets/icons/best.png')} />
                        }
                        </MenuItemHotnessWrapper>
                        <MenuItemButtonWrapper>
                            <TouchableWithoutFeedback onPress={()=>{setDetailShow(true);  dispatch(setMenuDetail(itemID)); }} >
                                <MenuItemButtonInnerWrapperRight>
                                    <MenuItemButton source={require('../../assets/icons/more.png')}/>
                                </MenuItemButtonInnerWrapperRight>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{ dispatch(addToOrderList({itemID}));/* dispatch(addToOrderList({menuDetail,menuDetailIndex})) */  }} >
                                <MenuItemButtonInnerWrapperLeft>
                                    <MenuItemButton source={require('../../assets/icons/add.png')}/>
                                </MenuItemButtonInnerWrapperLeft>
                            </TouchableWithoutFeedback>
                        </MenuItemButtonWrapper>
                    </MenuItemImageWrapper>
                    {itemExtra[0]?.soldout=='Y'&&
                        <SoldOutLayer>
                            <SoldOutText>SOLD OUT</SoldOutText>    
                            <SoldOutDimLayer/>
                        </SoldOutLayer>
                    }

                </MenuItemTopWrapper>
                <MenuItemBottomWRapper>
                    <MenuItemName>{itemTitle()||item.ITEM_NAME}</MenuItemName>
                    <MenuItemPrice>{itemPrice}원</MenuItemPrice>
                </MenuItemBottomWRapper>
            </MenuItemWrapper>

        </>
    );
}

export default MenuItem;
