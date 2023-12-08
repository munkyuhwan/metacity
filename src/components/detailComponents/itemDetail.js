import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { BottomButton, BottomButtonIcon, BottomButtonText, BottomButtonWrapper, ButtonWrapper, DetailInfoWrapper, DetailItemInfoFastImage, DetailItemInfoImage, DetailItemInfoImageWrapper, DetailItemInfoMore, DetailItemInfoPrice, DetailItemInfoPriceWrapper, DetailItemInfoSource, DetailItemInfoTitle, DetailItemInfoTitleEtc, DetailItemInfoTitleWrapper, DetailItemInfoWrapper, DetailPriceMoreWrapper, DetailWhiteWrapper, DetailWrapper, OptList, OptListWrapper, OptRecommendWrapper, OptTitleText } from '../../styles/main/detailStyle';
import { ActivityIndicator, Animated, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { colorBlack, colorRed } from '../../assets/colors/color';
import { LANGUAGE } from '../../resources/strings';
import OptItem from './optItem';
import CommonIndicator from '../common/waitIndicator';
import WaitIndicator from '../common/waitIndicator';
import RecommendItem from './recommendItem';
import { setMenuDetail, getSingleMenu, setMenuOptionSelect, setMenuOptionGroupCode, initMenuDetail, getSingleMenuFromAllItems, getItemSetGroup, getSingleMenuForRecommend, getSetItems, setMenuOptionSelected } from '../../store/menuDetail';
import { numberWithCommas, openPopup } from '../../utils/common';
import { MENU_DATA } from '../../resources/menuData';
import { addToOrderList } from '../../store/order';
import { MenuImageDefault } from '../../styles/main/menuListStyle';
import { useFocusEffect } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { RADIUS, RADIUS_DOUBLE } from '../../styles/values';
import {isEmpty} from "lodash";
/* 메뉴 상세 */
const ItemDetail = (props) => {
    const language = props.language;
    const isDetailShow = props.isDetailShow;
    const dispatch = useDispatch();
    const {menu} = useSelector((state)=>state.menu);
    const {menuDetailID, menuDetail, menuOptionSelected, menuOptionList, setGroupItem} = useSelector((state)=>state.menuDetail);
    const [detailZIndex, setDetailZIndex] = useState(0);
    // 메뉴 추가정보 찾기
    const {menuExtra} = useSelector(state=>state.menuExtra);
    const itemExtra = menuExtra?.filter(el=>el.pos_code == menuDetailID);
    // 옵션스테이트
    const [additiveGroupList, setAdditiveGroupList] = useState([]);
    const [additiveItemList, setAdditiveItemList] = useState([]);
    // 선택된 옵션
    const [selectedOptions, setSelectedOptions] = useState([]);
    // 함께먹기 좋은 메뉴
    const [selectedRecommend, setSelectedRecommend] = useState([]);

    //const optionSelect = menuDetail?.ADDITIVE_GROUP_LIST[0]?.ADDITIVE_ITEM_LIST;
    //const additiveData = menuDetail?.ADDITIVE_GROUP_LIST[1];
    const recommendMenu = menuDetail?.recommend;

    // animation set
    const [widthAnimation, setWidthAnimation] = useState(new Animated.Value(0));
    // width interpolation
    const animatedWidthScale = widthAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0,1],
    });
    const animatedWidthTranslate = widthAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0,30],
    });
    
    // height interpolation 
    const animatedHeightScale = widthAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0,1],
    });
    const animatedHeightTranslate = widthAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0,1],
    })

    const boxWidthStyle = {
        transform: [
            {scaleX:animatedWidthScale},
            {translateX:animatedWidthTranslate},
            {scaleY:animatedHeightScale}, 
            {translateY:animatedHeightTranslate}], 
        
    };
    const onSelectHandleAnimation = async (popOpen) => {
        Animated.timing(widthAnimation, {
            toValue:popOpen,
            duration: 150,
            useNativeDriver:true,
        }).start(()=>{             
            if(!isDetailShow) {
                setDetailZIndex(0)
            }
        }) 
    }
    
    const onOptionSelect = (itemData) =>{
        let setItem =  {
            "ITEM_SEQ" : 0,
            "SET_SEQ" : menuOptionSelected.length+1,
            "PROD_I_CD" : itemData?.PROD_CD,
            "PROD_I_NM" : itemData?.PROD_NM,
            "QTY" : 1,
            "AMT" : itemData?.SAL_AMT,
            "VAT" : itemData?.SAL_VAT,
        }; 
        dispatch(setMenuOptionSelected(setItem));
        //dispatch(setMenuOptionGroupCode(groupCode));
        //openPopup(dispatch,{innerView:"Option", isPopupVisible:true});
        /* 
            dispatch(setMenuOptionGroupCode(selectedGroup[0].ADDITIVE_GROUP_CODE));
            dispatch(setMenuOptionSelect(selectedGroup[0].ADDITIVE_ITEM_LIST));
            openPopup(dispatch,{innerView:"Option", isPopupVisible:true});
        */
    }
    const onRecommendSelect = (index) =>{
        var tmpArr = selectedRecommend;
        if(!tmpArr.includes(index)) {
            tmpArr.push(index);
        }else {
            tmpArr.splice(tmpArr.indexOf(index),1);
        }
        tmpArr.sort();        
        setSelectedRecommend([...tmpArr])
    }
    const addToCart = () => {
        //dispatch(addToOrderList({menuDetail, menuDetailID, selectedOptions,selectedRecommend}))
        const itemID = menuDetailID
        dispatch(addToOrderList({item:menuDetail,menuOptionSelected:menuOptionSelected}));
        closeDetail();
    }

    const closeDetail = () =>{
        //props.setDetailShow(false); 
        dispatch(setMenuDetail(null)); 
        init();
    }

    const init = () => {
        setSelectedOptions([]);
        setSelectedRecommend([]);
        setAdditiveGroupList([]);
        dispatch(initMenuDetail());
    }

    useEffect(()=>{
        if(menuDetailID!= null) {
            dispatch(getSingleMenuFromAllItems(menuDetailID))
            dispatch(getItemSetGroup());
            if(itemExtra[0]?.related) {
                if(itemExtra[0]?.related.length>0) {
                    dispatch(getSingleMenuForRecommend({related:itemExtra[0]?.related}));
                }
            } 
        }else {
            onSelectHandleAnimation(0);
        }
        
    },[menuDetailID])

    useEffect(()=>{
        if(isDetailShow) {
            setDetailZIndex(999)
            onSelectHandleAnimation(1);
            //dispatch(getItemSetGroup());
            /* 
            var tmpAdditiveList = [];
            if(menuDetail?.ADDITIVE_GROUP_LIST) {
                tmpAdditiveList = menuDetail?.ADDITIVE_GROUP_LIST.filter(el=>el.ADDITIVE_GROUP_USE_FLAG=="N");
            }
            setAdditiveGroupList(tmpAdditiveList);
             */
        }
    },[isDetailShow, menuDetail])
//console.log("menu: ",menu[0].ITEM_LIST);
    const ItemTitle = () =>{
        let selTitleLanguage = "";
        if(itemExtra) {
            const selExtra = itemExtra?.filter(el=>el.pos_code==menuDetailID);
            if(language=="korean") {
                selTitleLanguage = menuDetail?.ITEM_NAME;
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
            selTitleLanguage = menuDetail?.ITEM_NAME;
        }
        return selTitleLanguage;
    }
    const ItemInfo = () =>{
        let selInfoLanguage = "";
        if(itemExtra) {
            const selExtra = itemExtra.filter(el=>el.pos_code==menuDetailID);
            if(language=="korean") {
                selInfoLanguage = selExtra[0]?.gmemo;
            }
            else if(language=="japanese") {
                selInfoLanguage = selExtra[0]?.gmemo_jp||selExtra[0]?.gmemo;
            }
            else if(language=="chinese") {
                selInfoLanguage = selExtra[0]?.gmemo_cn||selExtra[0]?.gmemo;
            }
            else if(language=="english") {
                selInfoLanguage = selExtra[0]?.gmemo_en||selExtra[0]?.gmemo;
            }
        }else {
            selInfoLanguage = "";
        }
        return selInfoLanguage;
    }
    const ItemWonsanji = () => {
        let selWonsanjiLanguage = "";
        if(itemExtra){
            const selExtra = itemExtra.filter(el=>el.pos_code==menuDetailID);
            if(language=="korean") {
                selWonsanjiLanguage = selExtra[0]?.wonsanji;
            }
            else if(language=="japanese") {
                selWonsanjiLanguage = selExtra[0]?.wonsanji_jp||selExtra[0]?.wonsanji;
            }
            else if(language=="chinese") {
                selWonsanjiLanguage = selExtra[0]?.wonsanji_cn||selExtra[0]?.wonsanji;
            }
            else if(language=="english") {
                selWonsanjiLanguage = selExtra[0]?.wonsanji_en||selExtra[0]?.wonsanji;
            }
        }else {
            selWonsanjiLanguage = "";
        }
        return selWonsanjiLanguage;
    }

    useEffect(()=>{
        if(menuOptionList.length>0) {    
            menuOptionList.map(el=>{
                if(el.USE_YN == "Y") {
                    dispatch(getSetItems({setGroup:el}));
                }
            })
        }
    },[menuOptionList]) 

    useEffect(()=>{
        //console.log("setGroupItem: ",setGroupItem);
    },[setGroupItem])
    
    return(
        <>
            <Animated.View  style={[{...PopStyle.animatedPop, ...boxWidthStyle,...{zIndex:detailZIndex} } ]} >
                    <DetailWrapper>
                        <DetailWhiteWrapper>
                            {menuDetailID==null &&
                                <WaitIndicator/>
                            }
                            {menuDetailID!=null &&
                            <>
                            {menuDetailID!=null &&
                                <DetailInfoWrapper>
                                    <DetailItemInfoImageWrapper>
                                        
                                        {itemExtra&& 
                                        itemExtra[0]?.gimg_chg &&
                                            <DetailItemInfoFastImage source={{uri:"https:"+itemExtra[0]?.gimg_chg,headers: { Authorization: 'AuthToken' },priority: FastImage.priority.normal}} /> 
                                        }
                                        {itemExtra&&
                                        !itemExtra[0]?.gimg_chg &&
                                            <MenuImageDefault source={require("../../assets/icons/logo.png")} />
                                        }   
                                    </DetailItemInfoImageWrapper>
                                    <DetailItemInfoWrapper>
                                        <DetailItemInfoTitleWrapper>
                                            <DetailItemInfoTitle>{ItemTitle()||menuDetail?.PROD_NM}</DetailItemInfoTitle>
                                            {itemExtra&&
                                        itemExtra[0]?.is_new=='Y'&&
                                                 <DetailItemInfoTitleEtc source={require("../../assets/icons/new_menu.png")}/>
                                            }
                                            {itemExtra&&
                                        itemExtra[0]?.is_best=='Y'&&
                                                <DetailItemInfoTitleEtc source={require("../../assets/icons/best_menu.png")}/>
                                            }
                                            {itemExtra&&
                                        itemExtra[0]?.is_on=='Y'&&
                                                <DetailItemInfoTitleEtc source={require("../../assets/icons/hot_menu.png")}/>
                                            }
                                            
                                        </DetailItemInfoTitleWrapper>
                                        <DetailItemInfoSource>{ItemWonsanji()}</DetailItemInfoSource>
                                        <DetailPriceMoreWrapper>
                                            <DetailItemInfoPriceWrapper>
                                                <DetailItemInfoPrice isBold={true} >{ menuDetail?.SAL_TOT_AMT?numberWithCommas(menuDetail?.SAL_TOT_AMT):""}</DetailItemInfoPrice><DetailItemInfoPrice isBold={false}> 원</DetailItemInfoPrice>
                                            </DetailItemInfoPriceWrapper>
                                            <DetailItemInfoMore>{ItemInfo()}</DetailItemInfoMore>
                                        </DetailPriceMoreWrapper>
                                    </DetailItemInfoWrapper>
                                </DetailInfoWrapper>
                            }
                            {menuDetailID!=null &&
                                <OptRecommendWrapper>
                                    <OptListWrapper>
                                        <OptTitleText>{LANGUAGE[language]?.detailView.selectOpt}</OptTitleText>
                                        {
                                            menuOptionList &&
                                            menuOptionList.map((el,groupIdx)=>{
                                                return(
                                                    <>
                                                        <OptTitleText>{el.GROUP_NM}</OptTitleText>
                                                        <OptList horizontal showsHorizontalScrollIndicator={false} >
                                                        {
                                                            setGroupItem[groupIdx] &&
                                                            setGroupItem[groupIdx]?.map((itemEl,index)=>{
                                                                return(
                                                                    <OptItem key={"optItem_"+index} isSelected={menuOptionSelected.filter(menuEl=>menuEl.PROD_I_CD ==itemEl.PROD_CD).length>0 } optionData={itemEl} menuData={menuDetail} onPress={()=>{onOptionSelect(itemEl);} } />    
                                                                );
                                                                
                                                            })
                                                        }
                                                        </OptList> 
                                                    </>
                                                )
                                            })
                                        }
                                        
                                    </OptListWrapper>
                                    {itemExtra&&
                                            itemExtra[0]?.related &&
                                            itemExtra[0]?.related.length > 0 &&
                                            <>
                                                <OptListWrapper>
                                                    <OptTitleText>{LANGUAGE[language]?.detailView.recommendMenu}</OptTitleText>
                                                    <OptList horizontal showsHorizontalScrollIndicator={false} >
                                                        {
                                                            
                                                            itemExtra[0]?.related.map((el,index)=>{
                                                                if(isEmpty(el)) {
                                                                    return (<></>)
                                                                }else {
                                                                    return(
                                                                        <RecommendItem key={"recoItem_"+index}   recommendData={el} menuData={menuDetail}  />    
                                                                    );
                                                                }
                                                            })
                                                        }
                                                    </OptList>
                                                </OptListWrapper>
                                            </>
                                        }
                                </OptRecommendWrapper>
                            }   
                            <BottomButtonWrapper>
                                <TouchableWithoutFeedback onPress={()=>{closeDetail(); }}>
                                    <BottomButton backgroundColor={colorRed} >
                                        <BottomButtonText>{LANGUAGE[language]?.detailView.toMenu}</BottomButtonText>
                                        <BottomButtonIcon source={require("../../assets/icons/folk_nife.png")} />
                                    </BottomButton>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>{addToCart()}}>
                                    <BottomButton backgroundColor={colorBlack} >
                                        <BottomButtonText>{LANGUAGE[language]?.detailView.addToCart}</BottomButtonText>
                                        <BottomButtonIcon source={require("../../assets/icons/cart_select.png")} />
                                    </BottomButton>
                                </TouchableWithoutFeedback>

                            </BottomButtonWrapper>
                            </>
                            }
                        </DetailWhiteWrapper>
                    </DetailWrapper>
            </Animated.View>
        </>
    )  
}

const PopStyle = StyleSheet.create({
    animatedPop:{
        position:'absolute', 
        width:'100%',
        height:'100%',
        paddingTop:0,
        paddingLeft:0,
        left:-30,
        zIndex:99999,
     }

})

export default ItemDetail;