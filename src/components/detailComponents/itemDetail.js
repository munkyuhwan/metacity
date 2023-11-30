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
import { setMenuDetail, getSingleMenu, setMenuOptionSelect, setMenuOptionGroupCode, initMenuDetail, getSingleMenuFromAllItems } from '../../store/menuDetail';
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
    const {menuDetailID, menuDetail, menuOptionSelected} = useSelector((state)=>state.menuDetail);
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
    
    const onOptionSelect = (groupCode) =>{
        const selectedGroup = additiveGroupList.filter(el=>el.ADDITIVE_GROUP_CODE == groupCode);
        dispatch(setMenuOptionGroupCode(selectedGroup[0].ADDITIVE_GROUP_CODE));
        dispatch(setMenuOptionSelect(selectedGroup[0].ADDITIVE_ITEM_LIST));
        openPopup(dispatch,{innerView:"Option", isPopupVisible:true});
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
        dispatch(addToOrderList({itemID,menuOptionSelected}));
        closeDetail();
    }

    const closeDetail = () =>{
        props.setDetailShow(false); 
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
        }else {
            onSelectHandleAnimation(0);
        }
    },[menuDetailID])

    useEffect(()=>{
        if(isDetailShow) {
            setDetailZIndex(999)
            onSelectHandleAnimation(1);
            var tmpAdditiveList = [];
            if(menuDetail?.ADDITIVE_GROUP_LIST) {
                tmpAdditiveList = menuDetail?.ADDITIVE_GROUP_LIST.filter(el=>el.ADDITIVE_GROUP_USE_FLAG=="N");
            }
            setAdditiveGroupList(tmpAdditiveList);
        }
    },[isDetailShow, menuDetail])
//console.log("menu: ",menu[0].ITEM_LIST);
    const ItemTitle = () =>{
        let selTitleLanguage = "";
        if(itemExtra) {
            const selExtra = itemExtra?.filter(el=>el.pos_code==menuDetail?.ITEM_ID);
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
            const selExtra = itemExtra.filter(el=>el.pos_code==menuDetail?.ITEM_ID);
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
            const selExtra = itemExtra.filter(el=>el.pos_code==menuDetail?.ITEM_ID);
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
                                            <DetailItemInfoFastImage source={{uri:"https:"+itemExtra[0]?.gimg_chg}} /> 
                                        }
                                        {itemExtra&&
                                        !itemExtra[0]?.gimg_chg &&
                                            <MenuImageDefault source={require("../../assets/icons/logo.png")} />
                                        }   
                                    </DetailItemInfoImageWrapper>
                                    <DetailItemInfoWrapper>
                                        <DetailItemInfoTitleWrapper>
                                            <DetailItemInfoTitle>{ItemTitle()||menuDetail?.ITEM_NAME}</DetailItemInfoTitle>
                                            {itemExtra&&
                                        itemExtra[0]?.is_new=='Y'&&
                                                 <DetailItemInfoTitleEtc source={require("../../assets/icons/new.png")}/>
                                            }
                                            {itemExtra&&
                                        itemExtra[0]?.is_best=='Y'&&
                                                <DetailItemInfoTitleEtc source={require("../../assets/icons/best.png")}/>
                                            }
                                        </DetailItemInfoTitleWrapper>
                                        <DetailItemInfoSource>{ItemWonsanji()}</DetailItemInfoSource>
                                        <DetailPriceMoreWrapper>
                                            <DetailItemInfoPriceWrapper>
                                                <DetailItemInfoPrice isBold={true} >{ menuDetail?.ITEM_AMT?numberWithCommas(menuDetail?.ITEM_AMT):""}</DetailItemInfoPrice><DetailItemInfoPrice isBold={false}> 원</DetailItemInfoPrice>
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
                                        <OptList horizontal showsHorizontalScrollIndicator={false} >
                                            {additiveGroupList!=null &&
                                                additiveGroupList.map((el,index)=>{
                                                    if(el.ADDITIVE_GROUP_USE_FLAG == "N") {
                                                        return(
                                                            <OptItem key={"optItem_"+index} isSelected={additiveGroupList.indexOf(index)>=0} optionData={el} menuData={menuDetail} onPress={()=>{onOptionSelect(el.ADDITIVE_GROUP_CODE);} } />    
                                                        );
                                                    }else {
                                                        return(<></>);
                                                    }
                                                })
                                            }
                                            {selectedOptions==null &&
                                                <OptItem key={"optItem_0"} optionData={{imgUrl:require("../../assets/icons/logo.png"),name:"loading...",price:0}} menuData={menuDetail}/>    
                                            }
                                        </OptList>
                                    </OptListWrapper>
                                    <OptListWrapper>
                                        <OptTitleText>{LANGUAGE[language]?.detailView.recommendMenu}</OptTitleText>
                                        <OptList horizontal showsHorizontalScrollIndicator={false} >
                                            {/*recommendMenu!=null&&
                                                recommendMenu.map((el,index)=>{
                                                    const recommendItem = MENU_DATA.menuAll[el]
                                                    return(
                                                        <RecommendItem key={"recoItem_"+index} isSelected={selectedRecommend.indexOf(recommendItem.index)>=0}  recommendData={el} menuData={menuDetail} onPress={()=>{onRecommendSelect(recommendItem.index)}}/>    
                                                    );
                                                })
                                            */}
                                            {itemExtra&&
                                            itemExtra[0]?.related &&
                                                itemExtra[0]?.related.length > 0 &&
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
        paddingTop:108,
     }

})

export default ItemDetail;