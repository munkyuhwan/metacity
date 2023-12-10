import React, { useEffect, useRef, useState } from 'react'
import { 
    SafeAreaView,
    Text,
    TouchableWithoutFeedback
} from 'react-native'
import { HeaderLogo, HeaderWrapper } from '../../styles/header/header'
import { LogoTop, LogoWrapper, SideMenuItem, SideMenuItemWrapper, SideMenuWrapper } from '../../styles/main/sideMenuStyle'
import { SideMenuItemTouchable } from '../common/sideMenuItem'
import { TopMenuItemTouchable, TopMenuItemTouchableOff } from '../menuComponents/topMenuItem'
import { CategoryScrollView, CategoryWrapper, IconWrapper, TableName, TableNameBig, TableNameSmall, TopMenuWrapper, TouchIcon } from '../../styles/main/topMenuStyle'
 import TopButton from '../menuComponents/topButton'
import { useDispatch, useSelector } from 'react-redux'
import ItemDetail from '../detailComponents/itemDetail'
import { getSubCategories, setCategories, setSelectedSubCategory } from '../../store/categories'
import { getTableInfo, openFullSizePopup, openPopup, openTransperentPopup } from '../../utils/common'
import { colorWhite } from '../../assets/colors/color'
import TopMenuList from '../menuComponents/topMenuList'
import VersionCheck from 'react-native-version-check';
import { uploadFile } from '../../store/etcFunctions'
import AsyncStorage from '@react-native-async-storage/async-storage'

const TopMenu = () =>{
    const dispatch = useDispatch();
    const scrollViewRef = useRef();
    const {selectedMainCategory,subCategories, allCategories} = useSelector(state => state.categories);
    const [tableNoText, setTableNoText] = useState("");
    const {tableInfo} = useSelector(state => state.tableInfo);
    
    const [currentVersion, setCurrentVersion ] = useState("version");
    
    useEffect(()=>{
        scrollViewRef.current.scrollTo({x:0,animated: false});
    },[selectedMainCategory])

    useEffect(()=>{
        if(tableInfo) {
            setTableNoText(tableInfo.tableNo)
        }
    },[tableInfo])

    useEffect(()=>{ 
        setCurrentVersion(VersionCheck.getCurrentVersion());
        /* getTableInfo()
        .then(result=>{
            setTableNoText(result.TABLE_INFO);
        }) */
        AsyncStorage.getItem("TABLE_NM")
        .then((TABLE_NM)=>{
            if(TABLE_NM) {
                console.log("TABLE_NM: ",TABLE_NM);
                setTableNoText(TABLE_NM)
            }else {
            }
        })
    },[])

    const onPressItem = (index) => {
        dispatch(setSelectedSubCategory(index)); 
    }
    
    return(
        <>
            <TopMenuWrapper>
                <SafeAreaView>
                    <CategoryScrollView ref={scrollViewRef} horizontal showsHorizontalScrollIndicator={false} >
                        <CategoryWrapper>
                            {
                                <TopMenuList
                                    data={subCategories}
                                    onSelectItem={(index)=>{ onPressItem(index); }}
                                    initSelect={0}
                                />
                            }
                       </CategoryWrapper>
                    </CategoryScrollView>
                </SafeAreaView>

                <TouchableWithoutFeedback onPress={()=>{openFullSizePopup(dispatch,{innerFullView:"Setting", isFullPopupVisible:true}); }} >
                    <Text style={{color:colorWhite }} >설정 {currentVersion}</Text>
                </TouchableWithoutFeedback>
                  {/*
                <TouchableWithoutFeedback onPress={()=>{ console.log("upload file"); dispatch(uploadFile()) }} >
                    <Text style={{color:colorWhite, fontSize:20}} >파일올리기 </Text>
                </TouchableWithoutFeedback>
                        */}
                <TableName>
                    {/* <TableNameSmall>{tableInfo?.TBL_CODE}</TableNameSmall> */}
                    <TableNameBig>{tableNoText}</TableNameBig>
                </TableName>
              
                
            </TopMenuWrapper>
        </>
    )
}

export default TopMenu