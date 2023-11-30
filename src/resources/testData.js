export const REQUEST_PAY_DATA = {
    "STORE_ID": "3100396007",           // 가맹점 코드
    "SERVICE_ID": "3001",               // 서비스 코드 협의후 제공
    "MCHT_ORDERNO": "120",              // 가맹점 주문번호 
    "MEMB_TEL": "01012349876",          // 회원전화번호
    "ORDER_MEMO": "(안종혁)TORDER 선불 주문 테스트 현금 카드 결제",
    "ORG_ORDER_PAY_AMT": "18000",       // 원주문금액 -> 총액 - 할인금액 = 결제금액
    "ORDER_PAY_AMT": "18000",           // 실주문금액 -> 최종결제금액
    "DISC_AMT": "0",                    // 할인금액
    "PREPAY_FLAG": "Y",                 // 선결제 여부
    "OS_GBN": "Microsoft Windows [Version 10.0.17763.1935]", // os구분 AND||IOS
    "FLR_CODE": "0001",                 // 층 코드
    "TBL_CODE": "0005",                 // 테이블 코드
    "REPT_PRT_FLAG": "Y",               // 영수증 출력여부 Y/N default:Y
    "ORDER_PRT_FLAG": "Y",              // 주문 출력여부 Y/N default:Y
    "ORD_PAY_LIST": [                   // 결제승인 정보리스트
        {
            "PAY_TYPE": "cash",         // 결제유형 card,cash,eticket,mobile,etc
            "CAN_FLAG": "N",            // 취소어부 N:정상, Y:취소,반품
            "CAN_PAY_SEQ": "",          // 취소결제 순번 결제변경취소 원결제 순번
            "TML_NO": "",               // 터미널 번호, 스마트로 밴 승인 ID - CAT ID
            "SALE_AMT": "5000",         // 실결제금액
            "SALE_VAT_AMT": "0",        // 판매부가세금액
            "SVC_AMT": "0",             // 봉사료
            "ISTM_TERM": "",            // 할부기간 : 00 일시불, 03 3개월, 12 12개월 두자리수로 
            "AUTH_NO": "",              // 승인 번호
            "AUTH_DATE": "",            // 승인 일자
            "AUTH_TIME": "",            // 승인 시간
            "CARD_ACQHID": "",          // 카드매입사코드
            "CARD_ACQ_NAME": "",        // 카드매입사명
            "CARD_ACSHID": "",          // 카드발급사 코드
            "CRD_HID_NAME": "",         // 카드발급사명
            "CARD_NO": "",              // 카드번호      -> 카드번호,현금영수증정보, 상품권번호등 활용    
            "CARD_MCHTNO": "",          // 카드가맹점번호  -> VCAT 카드 결제요청 후  응답값 중 "merchant-no" 카드사 가맹번호 값
            "CARD_PAY_TYPE": "",        // 카드결제유형   -> M:MS, I:IC, R:RF, X:사용안함
            "CASH_AUTH_TYPE": "",       // 현금승인유형   -> 개인:P 법인:C
            "DDCEDI": ""                // 매입구분      -> D:DDC, E:EDI, C:EDC N:전표매입 S:전자서명
        },
        {
            "PAY_TYPE": "card",         
            "CAN_FLAG": "N",
            "CAN_PAY_SEQ": "",
            "TML_NO": "CATID_01",
            "SALE_AMT": "13000",
            "SALE_VAT_AMT": "0",
            "SVC_AMT": "0",
            "ISTM_TERM": "01",
            "AUTH_NO": "A012",
            "AUTH_DATE": "2021123",
            "AUTH_TIME": "141921",
            "CARD_ACQHID": "ac01",
            "CARD_ACQ_NAME": "매입사02",
            "CARD_ACSHID": "acs02",
            "CRD_HID_NAME": "발급사명필수",
            "CARD_NO": "0122330345",
            "CARD_MCHTNO": "CMCHTNO_888",
            "CARD_PAY_TYPE": "I",
            "CASH_AUTH_TYPE": "",
            "DDCEDI": "E"
        }
    ],
    "ITEM_LIST": [                          // 상품리스트
        {
            "ITEM_SEQ": "1",                // 상품순번 신규주문시:1
            "ITEM_NAME": "돼지불백",          // 상품명  
            "ITEM_ID": "2222245",           // 상품코드
            "SALE_PRICE": "5000",           // 판매단가   -> 상품금액+첨가물금액  첨가물 여부에따라 따로발생필요, 세트메뉴의 경우 상위상품금액만 전달
            "SALE_AMT": "5000",             // 판매단가 * 수량
            "ITEM_CNT": "1",                // 상품수량
            "ITEM_MENO": "돼지불백맞있게",      // 품목 메모
            "ITEM_SET_GBN": "N",            // 상품세트메뉴 구분
            "MCHT_MENU_NO":"",              // 가맹점 주문메뉴번호 -> 가맹점에서 관리되늰 주문메뉴번호
            "ADDITIVE_ITEM_LIST": [         // 첨가물 리스트
                {
                    "ADDITIVE_ID": "1001",  // 첨가물코드
                    "ADDITIVE_NAME": "시원함",// 첨가물명
                    "RULE_ID": "1000",      // 룰코드 -> 첨가물 그룹코드
                    "ADDITIVE_PRICE": "500",// 첨가물단가
                    "ADDITIVE_CNT": "1"     // 첨가물 수량
                }
            ]        
        },
        {
            "ITEM_SEQ": "1",
            "ITEM_NAME": "함흥냉면6",
            "ITEM_ID": "2222227",
            "SALE_PRICE": "12000",
            "SALE_AMT": "12000",
            "ITEM_CNT": "2",
            "ITEM_MENO": "함흥냉면차갑게",
            "ITEM_SET_GBN": "N",
            "ADDITIVE_ITEM_LIST": [
                {
                    "ADDITIVE_ID": "1001",
                    "ADDITIVE_NAME": "시원함",
                    "RULE_ID": "1000",
                    "ADDITIVE_PRICE": "500",
                    "ADDITIVE_CNT": "1"
                }
            ]
        }
    ]
}