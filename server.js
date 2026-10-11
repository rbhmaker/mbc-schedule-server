const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 103개 전체 일정 데이터 (위도/경도 삭제, 전면 도로명 주소화)
let dbSchedules = [
    { id: "hq", title: "MBC 보도국 (본사)", date: "상시 근무", datesList: [], category: "서울 마포", address: "서울 마포구 성암로 267", reporter: "보도국 전체", camReporter: "-", newsReporter: "보도국", equipment: "ENG, Z90, FX3, 오즈모 등", desc: "상시 취재 및 보도 베이스", isMainHQ: true },
    { id: "s1", title: "코스피 5,700 종가 스케치", date: "2026-02-20", datesList: ["2026-02-20"], category: "서울 여의도", address: "서울 영등포구 여의나루로 76", reporter: "한재훈 PD / 김민형 취재기자", camReporter: "한재훈", newsReporter: "김민형", equipment: "6mm", desc: "한국거래소 종가, 정유/방산/금융주 전광판 스케치 및 스탠드업" },
    { id: "s2", title: "Bts 콘서트 대리구매 시민 반응 인터뷰", date: "2026-02-23", datesList: ["2026-02-23"], category: "서울 마포", address: "서울 마포구 어울마당로 143", reporter: "임지환 VJ / 이승지 취재기자", camReporter: "임지환", newsReporter: "이승지", equipment: "6mm", desc: "시민 반응 인터뷰 스케치" },
    { id: "s3", title: "김병기 차남 빗썸 채용 관련 압수수색", date: "2026-02-24", datesList: ["2026-02-24"], category: "서울 강남", address: "서울 강남구 테헤란로 124", reporter: "김창인 VJ / 조건희 취재기자", camReporter: "김창인", newsReporter: "조건희", equipment: "6mm", desc: "빗썸 14층 사무실 외부 및 로비 엘리베이터 스케치" },
    { id: "s4", title: "위안부 역사 왜곡 관련 전문가 인터뷰", date: "2026-02-25", datesList: ["2026-02-25"], category: "서울 구로", address: "서울 구로구 연동로 320", reporter: "이관호 VJ / 홍의표 취재기자", camReporter: "이관호", newsReporter: "홍의표", equipment: "6mm", desc: "새천년관 강성현 교수 인터뷰 및 자료집 스케치" },
    { id: "s5", title: "스포츠토토 운영사 취재", date: "2026-02-26", datesList: ["2026-02-26"], category: "서울 중구", address: "서울 중구 세종대로 124", reporter: "김백승 VJ / 박진준 취재기자", camReporter: "김백승", newsReporter: "박진준", equipment: "6mm", desc: "스포츠토토 5층 사무실 스케치 및 관계자 설명" },
    { id: "s6", title: "호사카유지 교수 인터뷰", date: "2026-02-27", datesList: ["2026-02-27"], category: "서울 광진", address: "서울 광진구 능동로 209", reporter: "김민승 VJ / 정혜인 취재기자", camReporter: "김민승", newsReporter: "정혜인", equipment: "6mm", desc: "호사카유지 교수 인터뷰 및 일본어 서적 스케치" },
    { id: "s7", title: "코스피 관련 전문가 인터뷰", date: "2026-03-03", datesList: ["2026-03-03"], category: "서울 중구", address: "서울 중구 을지로5길 26", reporter: "독고명 VJ / 구민지 취재기자", camReporter: "독고명", newsReporter: "구민지", equipment: "6mm", desc: "미래에셋증권 서상영 상무 인터뷰 및 스케치" },
    { id: "s8", title: "6.3 지방선거 대구 민심은? 르포 기사 인터뷰", date: "2026-03-04", datesList: ["2026-03-04"], category: "대구 중구", address: "대구 중구 큰장로26길 45", reporter: "김민승 VJ / 이문현 취재기자", camReporter: "김민승", newsReporter: "이문현", equipment: "6mm", desc: "대구 현지 주요 거점 민심 인터뷰 스케치" },
    { id: "s9", title: "종가 스케치 및 스탠드업", date: "2026-03-05", datesList: ["2026-03-05"], category: "서울 여의도", address: "서울 영등포구 여의나루로 76", reporter: "김백승 VJ / 구민지 취재기자", camReporter: "김백승", newsReporter: "구민지", equipment: "6mm", desc: "1층 로비 및 2층 KRX 스퀘어 종가 스케치" },
    { id: "s10", title: "차량 인도 돌진", date: "2026-03-06", datesList: ["2026-03-06"], category: "서울 은평", address: "서울 은평구 통일로 715", reporter: "이원석 VJ / 조건희 취재기자", camReporter: "이원석", newsReporter: "조건희", equipment: "6mm", desc: "안경점 사고 현장 및 사고 차량 견인 스케치" },
    { id: "s11", title: "중학생 성폭행 인터뷰", date: "2026-03-09", datesList: ["2026-03-09"], category: "광주 서구", address: "광주 서구 상무민주로76번길 8", reporter: "황주연 VJ / 조건희 취재기자", camReporter: "황주연", newsReporter: "조건희", equipment: "6mm", desc: "피해자 어머님 익명 인터뷰" },
    { id: "s12", title: "합수본, 신천지 총회본부 재압수수색", date: "2026-03-11", datesList: ["2026-03-11"], category: "경기 과천", address: "경기 과천시 별양상가3로 11", reporter: "김민승 VJ / 김지성 취재기자", camReporter: "김민승", newsReporter: "김지성", equipment: "6mm", desc: "사무실 외부 압수수색 현장 스케치" },
    { id: "s13", title: "유가 최고 지정제 실시", date: "2026-03-12", datesList: ["2026-03-12"], category: "경기 고양", address: "경기 고양시 덕양구 중앙로 113", reporter: "이원석 VJ / 오해정 취재기자", camReporter: "이원석", newsReporter: "오해정", equipment: "6mm", desc: "주유소 현장 스케치 및 시민 인터뷰" },
    { id: "s14", title: "코스피 장중 스케치", date: "2026-03-12", datesList: ["2026-03-12"], category: "서울 여의도", address: "서울 영등포구 여의나루로 76", reporter: "한재훈 PD / 남효정 취재기자", camReporter: "한재훈", newsReporter: "남효정", equipment: "6mm", desc: "코스피 코스닥 장중 전광판 스케치" },
    { id: "s15", title: "기자의 눈 스탠드업", date: "2026-03-16", datesList: ["2026-03-16"], category: "경기 남양주", address: "경기 남양주시 진접읍 금강로 1354", reporter: "김백승 VJ / 원석진 취재기자", camReporter: "김백승", newsReporter: "원석진", equipment: "6mm", desc: "취재기자 스탠드업 및 피해 차량 스케치" },
    { id: "s16", title: "주가 지수 및 환율 스케치", date: "2026-03-16", datesList: ["2026-03-16"], category: "서울 여의도", address: "서울 영등포구 여의나루로 76", reporter: "김백승 영상기자 / 이종혁 취재기자", camReporter: "김백승", newsReporter: "이종혁", equipment: "6mm", desc: "코스피, 코스닥, 주요 증시 및 환율 스케치" },
    { id: "s17", title: "남양주 살인 피해자 직장 취재", date: "2026-03-17", datesList: ["2026-03-17"], category: "경기 남양주", address: "경기 남양주시 오남읍 팔현로 12", reporter: "김백승 VJ / 이정숙 취재기자", camReporter: "김백승", newsReporter: "이정숙", equipment: "6mm", desc: "피해자 직장 외경 및 근처 주민 인터뷰" },
    { id: "s18", title: "우이초등학교 등굣길 스케치", date: "2026-03-17", datesList: ["2026-03-17"], category: "서울 강북", address: "서울 강북구 삼양로112길 34", reporter: "김백승 VJ / 이정숙 취재기자", camReporter: "김백승", newsReporter: "이정숙", equipment: "6mm", desc: "어린이 보호구역 및 등굣길 학부모 인터뷰" },
    { id: "s19", title: "Bts 공연 유통가 특수 인터뷰", date: "2026-03-18", datesList: ["2026-03-18"], category: "서울 중구", address: "서울 중구 퇴계로 77", reporter: "전효석 PD / 지윤수 취재기자", camReporter: "전효석", newsReporter: "지윤수", equipment: "ENG", desc: "K-POP 굿즈 스토어 및 쇼핑 인파 스케치" },
    { id: "s20", title: "BTS 광화문 공연_통제선 안쪽_인파 스케치", date: "2026-03-21", datesList: ["2026-03-21"], category: "서울 종로", address: "서울 종로구 세종대로 172", reporter: "윤대일 영상기자 / 김흥준 취재기자", camReporter: "윤대일", newsReporter: "김흥준", equipment: "ENG", desc: "광화문 공연 통제선 안쪽 관람 인파 현장 스케치" },
    { id: "s21", title: "K-경제안보 전략과 핵심과제 공개포럼", date: "2026-03-25", datesList: ["2026-03-25"], category: "서울 종로", address: "서울 종로구 우정국로 26", reporter: "윤병순 PD / 변윤재 취재기자", camReporter: "윤병순", newsReporter: "변윤재", equipment: "6mm", desc: "공개포럼 개회사, 축사 및 주제발표 토론 스케치" },
    { id: "s22", title: "YTN 정상화 촉구 기자회견", date: "2026-03-26", datesList: ["2026-03-26"], category: "서울 종로", address: "서울 종로구 효자로 13", reporter: "이관호 VJ / 도윤선 취재기자", camReporter: "이관호", newsReporter: "도윤선", equipment: "6mm", desc: "기자회견 현장 구호제창 및 발언 싱크" },
    { id: "s23", title: "코스피 코스닥 종가 스케치", date: "2026-04-06", datesList: ["2026-04-06"], category: "서울 여의도", address: "서울 영등포구 여의나루로 76", reporter: "김창인 VJ / 이종혁 취재기자", camReporter: "김창인", newsReporter: "이종혁", equipment: "6mm", desc: "증권거래소 종가 전광판 및 환율 스케치" },
    { id: "s24", title: "부동산 취재", date: "2026-04-06", datesList: ["2026-04-06"], category: "서울 용산", address: "서울 용산구 이촌로 290", reporter: "김민승 VJ / 이해선 취재기자", camReporter: "김민승", newsReporter: "이해선", equipment: "6mm", desc: "공인중개사 내부 스케치 및 대표 인터뷰" },
    { id: "s25", title: "BTS 월드투어 첫날 콘서트장 외부 스케치", date: "2026-04-09", datesList: ["2026-04-09"], category: "경기 고양", address: "경기 고양시 일산서구 중앙로 1601", reporter: "강재훈 VJ / 임소정 취재기자", camReporter: "강재훈", newsReporter: "임소정", equipment: "6mm", desc: "응원봉 수령 행렬 및 현장 인파 스케치" },
    { id: "s26", title: "SPC 삼립시화공장 노동자 손가락 절단 사고", date: "2026-04-10", datesList: ["2026-04-10"], category: "경기 시흥", address: "경기 시흥시 공단1대로 101", reporter: "정영진 VJ / 김흥준 취재기자", camReporter: "정영진", newsReporter: "김흥준", equipment: "6mm", desc: "공장 건물 외경, 작업 현장 및 노동부 차량 퇴장 스케치" },
    { id: "s27", title: "미담장학회 관련 취재", date: "2026-04-14", datesList: ["2026-04-14"], category: "서울 양천", address: "서울 양천구 목동동로 81", reporter: "윤병순 PD / 박진준 취재기자", camReporter: "윤병순", newsReporter: "박진준", equipment: "6mm", desc: "센터 내부 진입 및 센터장 인터뷰" },
    { id: "s28", title: "외교부-스탠덥 촬영", date: "2026-04-14", datesList: ["2026-04-14"], category: "서울 종로", address: "서울 종로구 사직로8길 60", reporter: "황주연 VJ / 김윤미 취재기자", camReporter: "황주연", newsReporter: "김윤미", equipment: "6mm", desc: "기자 스탠드업 스케치 및 오디오 녹음" },
    { id: "s29", title: "2026 홍수대응 모의훈련", date: "2026-04-15", datesList: ["2026-04-15"], category: "서울 서초", address: "서울 서초구 동작대로 328", reporter: "전효석 PD / 김민욱 취재기자", camReporter: "전효석", newsReporter: "김민욱", equipment: "6mm", desc: "상황실 입구 및 장관 모두말씀 브리핑" },
    { id: "s30", title: "대전 소재 대학교 자동차 전문가 인터뷰", date: "2026-04-16", datesList: ["2026-04-16"], category: "대전 유성", address: "대전 유성구 가정북로 68", reporter: "강종수 PD / 이승연 취재기자", camReporter: "강종수", newsReporter: "이승연", equipment: "6mm", desc: "미래자동차학과 이호근 교수 인터뷰" },
    { id: "s31", title: "양주 아동학대 피의자 송치 영상 커버", date: "2026-04-17", datesList: ["2026-04-17"], category: "경기 의정부", address: "경기 의정부시 녹양로 65", reporter: "김창인 VJ / 이정숙 취재기자", camReporter: "김창인", newsReporter: "이정숙", equipment: "6mm", desc: "피의자 최은호 퇴장 모습 및 별관 외경" },
    { id: "s32", title: "서울체중 왕서윤 인터뷰", date: "2026-05-06", datesList: ["2026-05-06"], category: "서울 송파", address: "서울 송파구 강동대로 232", reporter: "독고명 VJ / 곽승규 취재기자", camReporter: "독고명", newsReporter: "곽승규", equipment: "6mm, CX10, 고프로", desc: "수업 및 훈련 스케치, 육상부 왕서윤 학생 인터뷰" },
    { id: "s33", title: "의정부 마약 피의자 도주", date: "2026-05-08", datesList: ["2026-05-08"], category: "경기 의정부", address: "경기 의정부시 호국로 1265", reporter: "김민승 VJ / 도윤선 취재기자", camReporter: "김민승", newsReporter: "도윤선", equipment: "6mm", desc: "도주로 담장 스케치 및 기자 스탠드업" },
    { id: "s34", title: "베니스의 상인 기자간담회", date: "2026-05-09", datesList: ["2026-05-09"], category: "서울 종로", address: "서울 종로구 동숭길 114", reporter: "강종수 PD / 임소정 취재기자", camReporter: "강종수", newsReporter: "임소정", equipment: "6mm", desc: "연출 및 배우 등장, 포토타임 질의응답" },
    { id: "s35", title: "홍장원 퇴장 뻗치기", date: "2026-05-22", datesList: ["2026-05-22"], category: "경기 과천", address: "경기 과천시 관문로 47", reporter: "박다원 영상기자 / 김지성 취재기자", camReporter: "박다원", newsReporter: "김지성", equipment: "ENG", desc: "홍장원 퇴장 스케치 및 답변 싱크" },
    { id: "s36", title: "환기미술관 은행나무 제초제 주입 논란", date: "2026-05-26", datesList: ["2026-05-26"], category: "서울 종로", address: "서울 종로구 자하문로40길 63", reporter: "전효석 PD / 김민욱 취재기자", camReporter: "전효석", newsReporter: "김민욱", equipment: "6mm", desc: "은행나무 스케치 및 부암동 주민 기자회견" },
    { id: "s37", title: "설악산 현장 인덱스 촬영", date: "2026-05-29", datesList: ["2026-05-29", "2026-05-30"], category: "강원 양양", address: "강원 양양군 서면 오색리 466", reporter: "담당 취재진", camReporter: "미상", newsReporter: "미상", equipment: "Z90, 오즈모", desc: "희귀식물 이식지역 및 전문가 인터뷰 스케치" },
    { id: "s38", title: "카카오 2차 노사 조정", date: "2026-05-27", datesList: ["2026-05-27"], category: "경기 수원", address: "경기 수원시 장안구 경수대로 970", reporter: "박다원 영상기자 / 제은효 취재기자", camReporter: "박다원", newsReporter: "제은효", equipment: "ENG", desc: "김왕 조정위원장 발언 싱크" },
    { id: "s39", title: "6월 3일 인천시장 유정복 후보 상황실", date: "2026-06-03", datesList: ["2026-06-03"], category: "인천 미추홀", address: "인천 미추홀구 미추홀대로 695", reporter: "한재훈 PD / 이종혁 취재기자", camReporter: "한재훈", newsReporter: "이종혁", equipment: "6mm", desc: "유정복 후보 소감 발표 및 퇴장 싱크" },
    { id: "s40", title: "잠실7동 제2투표소 상황 커버", date: "2026-06-04", datesList: ["2026-06-04"], category: "서울 송파", address: "서울 송파구 올림픽로 73", reporter: "독고명 VJ / 이종혁 취재기자", camReporter: "독고명", newsReporter: "이종혁", equipment: "스마트폰", desc: "투표소 현장 발언 스케치" },
    { id: "s41", title: "올림픽공원 앞 부정선거 시위대 스케치", date: "2026-06-06", datesList: ["2026-06-06"], category: "서울 송파", address: "서울 송파구 올림픽로 424", reporter: "황주연 VJ / 이민석 취재기자", camReporter: "황주연", newsReporter: "이민석", equipment: "스마트폰", desc: "플래시 애국가 제창 및 경찰 배치 스케치" },
    { id: "s42", title: "투표용지 부족 사태 선관위 고발인 조사", date: "2026-06-08", datesList: ["2026-06-08"], category: "서울 강동", address: "서울 강동구 성내로 57", reporter: "윤대일 영상기자 / 도윤선 취재기자", camReporter: "윤대일", newsReporter: "도윤선", equipment: "ENG", desc: "김순환 서민위 사무총장 주차장 진입 스케치" },
    { id: "s43", title: "올림픽공원 재선거 주장 시위대 현장 취재", date: "2026-06-08", datesList: ["2026-06-08"], category: "서울 송파", address: "서울 송파구 올림픽로 424", reporter: "윤대일 영상기자 / 김흥준 취재기자", camReporter: "윤대일", newsReporter: "김흥준", equipment: "스마트폰", desc: "시위대 대치 및 내부 말다툼 경찰 인솔 스케치" },
    { id: "s44", title: "AI 도입 후 번역사 타격 교수 인터뷰", date: "2026-06-09", datesList: ["2026-06-09"], category: "서울 마포", address: "서울 마포구 성암로 267", reporter: "김승우 영상기자 / 김민형 취재기자", camReporter: "김승우", newsReporter: "김민형", equipment: "ENG", desc: "이현경 교수 인터뷰 및 스케치" },
    { id: "s45", title: "AI 도입 후 변호사 등 고용 변화", date: "2026-06-09", datesList: ["2026-06-09"], category: "서울 서초", address: "서울 서초구 방배로43길 21", reporter: "김승우 영상기자 / 김민형 취재기자", camReporter: "김승우", newsReporter: "김민형", equipment: "ENG, FX3", desc: "홍석구 변호사 인터뷰 및 AI 판례검색 시연 스케치" },
    { id: "s46", title: "다회용기 사업 야구장 쓰레기통 문제 취재", date: "2026-06-10", datesList: ["2026-06-10"], category: "서울 송파", address: "서울 송파구 올림픽로 25", reporter: "윤대일 영상기자 / 류현준 취재기자", camReporter: "윤대일", newsReporter: "류현준", equipment: "ENG, 오즈모, 고프로", desc: "관객 일회용품 사용실태 및 분리수거함 타임랩스" },
    { id: "s47", title: "올림픽공원 봉쇄 현장 취재", date: "2026-06-11", datesList: ["2026-06-11"], category: "서울 송파", address: "서울 송파구 올림픽로 424", reporter: "김민승 VJ / 김흥준 취재기자", camReporter: "김민승", newsReporter: "김흥준", equipment: "VJ 핸디캠", desc: "집회 참가자 난동 및 밤 시위 현장 스케치" },
    { id: "s48", title: "올림픽공원 봉쇄 현장 취재 2", date: "2026-06-12", datesList: ["2026-06-12"], category: "서울 송파", address: "서울 송파구 올림픽로 424", reporter: "윤대일 영상기자 / 최다함 취재기자", camReporter: "윤대일", newsReporter: "최다함", equipment: "ENG", desc: "시위 현장 스케치 및 변호사 질의응답" },
    { id: "s49", title: "올림픽공원 핸드볼경기장 경찰 투입 현장 커버", date: "2026-06-16", datesList: ["2026-06-16"], category: "서울 송파", address: "서울 송파구 올림픽로 424", reporter: "이종혁 영상기자 / 윤대일 취재기자", camReporter: "이종혁", newsReporter: "윤대일", equipment: "스마트폰", desc: "진입 저지 시위대 및 경찰 투입 충돌 스케치" },
    { id: "s50", title: "한성백제역 가스유출", date: "2026-06-18", datesList: ["2026-06-18"], category: "서울 송파", address: "서울 송파구 백제고분로 508", reporter: "윤대일 영상기자 / 심가은 취재기자", camReporter: "윤대일", newsReporter: "심가은", equipment: "ENG", desc: "경찰 출입통제, 소방로봇 및 대피 시민 스케치" },
    { id: "s51", title: "편의점 상비약 현장 취재", date: "2026-06-22", datesList: ["2026-06-22"], category: "서울 강남", address: "서울 강남구 테헤란로77길 7", reporter: "윤대일 영상기자 / 백승우B 취재기자", camReporter: "윤대일", newsReporter: "백승우B", equipment: "ENG", desc: "안전상비의약품 매대 및 약품 패키징 스케치" },
    { id: "s52", title: "수원 마약 영상 현장취재", date: "2026-06-23", datesList: ["2026-06-23"], category: "경기 수원", address: "경기 수원시 권선구 권선로 635", reporter: "김백승 VJ / 심가은 취재기자", camReporter: "김백승", newsReporter: "심가은", equipment: "VJ 핸디캠", desc: "골목길 스케치 및 기자 스탠드업" },
    { id: "s53", title: "급식카드 부정사용 현장 취재", date: "2026-06-24", datesList: ["2026-06-24"], category: "경기 광명", address: "경기 광명시 범안로 1035", reporter: "강종수 PD / 이문현 취재기자", camReporter: "강종수", newsReporter: "이문현", equipment: "VJ 핸디캠", desc: "소형마트 밑대기 및 기자 스탠드업" },
    { id: "s54", title: "북중미월드컵 대한민국 vs 남아공 광화문 응원", date: "2026-06-25", datesList: ["2026-06-25"], category: "서울 종로", address: "서울 종로구 세종대로 172", reporter: "윤대일 영상기자 / 이종혁 취재기자", camReporter: "윤대일", newsReporter: "이종혁", equipment: "ENG", desc: "시민 길거리 응원 및 골 리액션 스케치" },
    { id: "s55", title: "가평 산사태 1년 현장 취재", date: "2026-06-26", datesList: ["2026-06-26"], category: "경기 가평", address: "경기 가평군 가평읍 태봉두밀로 421-24", reporter: "윤대일 영상기자 / 조건희 취재기자", camReporter: "윤대일", newsReporter: "조건희", equipment: "ENG, 고프로, 드론", desc: "글램핑장 위험구역 및 가평군청 드론 부감 촬영" },
    { id: "s56", title: "개장 후 코스피 코스닥 지수 스케치", date: "2026-07-01", datesList: ["2026-07-01"], category: "서울 여의도", address: "서울 영등포구 여의나루로 76", reporter: "이종혁 영상기자 / 윤대일 취재기자", camReporter: "이종혁", newsReporter: "윤대일", equipment: "ENG", desc: "지수 및 원달러 환율 스케치" },
    { id: "s57", title: "서울시교육감 취재", date: "2026-07-01", datesList: ["2026-07-01"], category: "서울 종로", address: "서울 종로구 송월길 48", reporter: "윤대일 영상기자 / 이혜리 취재기자", camReporter: "윤대일", newsReporter: "이혜리", equipment: "ENG", desc: "정근식 교육감 취임식 및 내빈 축사 스케치" },
    { id: "s58", title: "시민단체 축협 고발 기자회견", date: "2026-07-02", datesList: ["2026-07-02"], category: "서울 영등포", address: "서울 영등포구 국회대로74길 9", reporter: "윤대일 영상기자 / 이재인 취재기자", camReporter: "윤대일", newsReporter: "이재인", equipment: "ENG", desc: "서민위 고발장 접수 스케치" },
    { id: "s59", title: "경찰특공대 전술평가대회", date: "2026-07-03", datesList: ["2026-07-03"], category: "서울 관악", address: "서울 관악구 과천대로 790", reporter: "윤대일 영상기자 / 곽동건 취재기자", camReporter: "윤대일", newsReporter: "곽동건", equipment: "ENG, 고프로", desc: "저격수 및 부사수 전술 평가 스케치" },
    { id: "s60", title: "배재고 시교청 긴급브리핑", date: "2026-07-03", datesList: ["2026-07-03"], category: "서울 종로", address: "서울 종로구 송월길 48", reporter: "윤대일 영상기자 / 제은효 취재기자", camReporter: "윤대일", newsReporter: "제은효", equipment: "ENG", desc: "체육건강예술교육과장 브리핑 스케치" },
    { id: "s61", title: "부승찬 의원 인터뷰", date: "2026-07-07", datesList: ["2026-07-07"], category: "서울 영등포", address: "서울 영등포구 의사당대로 1", reporter: "윤대일 영상기자 / 구나연 취재기자", camReporter: "윤대일", newsReporter: "구나연", equipment: "ENG", desc: "부승찬 국회의원 단독 인터뷰" },
    { id: "s62", title: "삼성 이재용 출국", date: "2026-07-07", datesList: ["2026-07-07"], category: "서울 강서", address: "서울 강서구 하늘길 38", reporter: "윤대일 영상기자 / 지윤수 취재기자", camReporter: "윤대일", newsReporter: "지윤수", equipment: "ENG", desc: "이재용 회장 하차 스케치" },
    { id: "s63", title: "파주 와동동 아파트 화재 대응 1단계", date: "2026-07-07", datesList: ["2026-07-07"], category: "경기 파주", address: "경기 파주시 가람로 82", reporter: "윤대일 영상기자 / 도윤선 취재기자", camReporter: "윤대일", newsReporter: "도윤선", equipment: "ENG", desc: "화재 현장 전경, 브리핑 및 기자 스탠드업" },
    { id: "s64", title: "김용 최고위원 출마선언", date: "2026-07-08", datesList: ["2026-07-08"], category: "서울 영등포", address: "서울 영등포구 의사당대로 1", reporter: "장영근 영상기자", camReporter: "장영근", newsReporter: "-", equipment: "ENG", desc: "출마 기자회견 및 백브리핑 질의응답" },
    { id: "s65", title: "서울 구로 목감천 홍수주의보", date: "2026-07-09", datesList: ["2026-07-09"], category: "서울 구로", address: "서울 구로구 개봉로 15", reporter: "강재훈 VJ / 이승지 취재기자", camReporter: "강재훈", newsReporter: "이승지", equipment: "스마트폰", desc: "하천 범람 및 펜스 침수 현장 스케치" },
    { id: "s66", title: "인천 영종구 중산동 인근 정전 취재", date: "2026-07-14", datesList: ["2026-07-14"], category: "인천 중구", address: "인천 중구 하늘달빛로 50", reporter: "윤대일 영상기자 / 이민석 취재기자", camReporter: "윤대일", newsReporter: "이민석", equipment: "ENG", desc: "상가 정전, 폐사한 수족관 새우 스케치" },
    { id: "s67", title: "더위 스케치", date: "2026-07-13", datesList: ["2026-07-13"], category: "서울 동대문", address: "서울 동대문구 고산자로36길 3", reporter: "윤대일 영상기자 / 이재인 취재기자", camReporter: "윤대일", newsReporter: "이재인", equipment: "ENG", desc: "경동시장 얼음 판매 및 시민 폭염 스케치" },
    { id: "s68", title: "인천 쿠팡 물류센터 화재 현장 취재", date: "2026-07-20", datesList: ["2026-07-20"], category: "인천 서구", address: "인천 서구 봉수대로 370", reporter: "윤대일 영상기자 / 이민석 취재기자", camReporter: "윤대일", newsReporter: "이민석", equipment: "ENG", desc: "화재 진압 고가사다리차 물분사 스케치" },
    { id: "s69", title: "폭염 스케치", date: "2026-07-26", datesList: ["2026-07-26"], category: "서울 영등포", address: "서울 영등포구 여의동로 330", reporter: "윤대일 영상기자 / 제은효 취재기자", camReporter: "윤대일", newsReporter: "제은효", equipment: "ENG", desc: "공원 물놀이 및 열화상 모니터 스케치" },
    { id: "s70", title: "무더위 관련 현장 스케치", date: "2026-07-27", datesList: ["2026-07-27"], category: "서울 서대문", address: "서울 서대문구 연세로 13", reporter: "윤대일 영상기자 / 백승우B 취재기자", camReporter: "윤대일", newsReporter: "백승우B", equipment: "ENG, 고프로", desc: "광장 열화상 및 얼음 녹는 타임랩스" },
    { id: "s71", title: "쿠팡 인천센터 화재 합동감식", date: "2026-07-28", datesList: ["2026-07-28"], category: "인천 서구", address: "인천 서구 봉수대로 370", reporter: "전인제 영상기자 / 이재인 취재기자", camReporter: "전인제", newsReporter: "이재인", equipment: "ENG, 드론", desc: "국립소방연구원 합동 감식팀 드론 촬영" },
    { id: "s72", title: "지하철 찜통 객차 악순환 현장 취재", date: "2026-07-30", datesList: ["2026-07-30"], category: "서울 영등포", address: "서울 영등포구 당산로 121", reporter: "윤대일 영상기자 / 이민석 취재기자", camReporter: "윤대일", newsReporter: "이민석", equipment: "ENG, 고프로", desc: "출근길 지하철 열화상 카메라 혼잡도 촬영" },
    { id: "s73", title: "폭염 속 지하철 찜통 현장 취재 2", date: "2026-07-31", datesList: ["2026-07-31"], category: "서울 종로", address: "서울 종로구 율곡로 62", reporter: "윤대일 영상기자 / 류현준 취재기자", camReporter: "윤대일", newsReporter: "류현준", equipment: "ENG", desc: "역사 내부 스폿쿨러 및 온도계 비교 스케치" },
    { id: "s74", title: "서울 폭염 출근길 및 점심시간 스케치", date: "2026-08-03", datesList: ["2026-08-03"], category: "서울 용산", address: "서울 용산구 한강대로 23길 55", reporter: "윤대일 영상기자 / 이민석 취재기자", camReporter: "윤대일", newsReporter: "이민석", equipment: "ENG, 인스타360", desc: "스크린도어 개방 열화상 및 탑골공원 배식 부감" },
    { id: "s75", title: "폭염+가뭄, 복합 기후재난 남부 르포", date: "2026-08-04", datesList: ["2026-08-04", "2026-08-05"], category: "경남 밀양", address: "경남 밀양시 부북면 가례리 252", reporter: "윤대일 영상기자 / 김민욱 취재기자", camReporter: "윤대일", newsReporter: "김민욱", equipment: "ENG, 드론", desc: "마른 저수지, 잉어 양식장 드론 부감 스케치" },
    { id: "s76", title: "거제 한화시스템 무인수상선 취재", date: "2026-08-06", datesList: ["2026-08-06"], category: "경남 거제", address: "경남 거제시 장목면 장목1길 41", reporter: "윤대일 영상기자 / 지윤수 취재기자", camReporter: "윤대일", newsReporter: "지윤수", equipment: "ENG, 고프로, 인스타360", desc: "무인수상선 무인 운항 전환 및 드론 부감" },
    { id: "s77", title: "인천 존속살해 10대 영장실질심사", date: "2026-08-09", datesList: ["2026-08-09"], category: "인천 미추홀", address: "인천 미추홀구 소성로 163", reporter: "한재훈 PD / 차우형 취재기자", camReporter: "한재훈", newsReporter: "차우형", equipment: "6mm", desc: "피의자 법원 입장 스케치" },
    { id: "s78", title: "평택 인화물질 창고 화재", date: "2026-08-11", datesList: ["2026-08-11"], category: "경기 평택", address: "경기 평택시 청북읍 토진3길 61", reporter: "위동원 영상기자 / 이지은 취재기자", camReporter: "위동원", newsReporter: "이지은", equipment: "ENG", desc: "전소된 창고 철골 일그러진 모습 스케치" },
    { id: "s79", title: "가양4단지아파트 추가 취재", date: "2026-08-12", datesList: ["2026-08-12"], category: "서울 강서", address: "서울 강서구 양천로57길 37", reporter: "윤대일 영상기자 / 도윤선 취재기자", camReporter: "윤대일", newsReporter: "도윤선", equipment: "ENG", desc: "화재 복도 그을음 및 주민 인터뷰 스케치" },
    { id: "s80", title: "경기도 남양주 신규 택지 부지 커버", date: "2026-08-13", datesList: ["2026-08-13"], category: "경기 남양주", address: "경기 남양주시 와부읍 덕소로 264", reporter: "윤대일 영상기자 / 이종혁 취재기자", camReporter: "윤대일", newsReporter: "이종혁", equipment: "드론", desc: "신규 택지 부지 드론 부감 스케치" },
    { id: "s81", title: "경기도 광주 신규 택지 부지 커버", date: "2026-08-13", datesList: ["2026-08-13"], category: "경기 광주", address: "경기 광주시 회안대로 837", reporter: "윤대일 영상기자 / 이종혁 취재기자", camReporter: "윤대일", newsReporter: "이종혁", equipment: "ENG, 드론", desc: "부지 도로, 라이딩샷 및 드론 부감" },
    { id: "s82", title: "위안부 기림일 중계 반제 스케치", date: "2026-08-14", datesList: ["2026-08-14"], category: "서울 종로", address: "서울 종로구 율곡로2길 19", reporter: "이상용 PD / 이승연 취재기자", camReporter: "이상용", newsReporter: "이승연", equipment: "6mm", desc: "소녀상 풀샷 및 우중 무대 관객 스케치" },
    { id: "s83", title: "성남 보복살인 피의자 송치", date: "2026-08-19", datesList: ["2026-08-19"], category: "경기 성남", address: "경기 성남시 수정구 성남대로 1259", reporter: "윤대일 영상기자 / 문다영 취재기자", camReporter: "윤대일", newsReporter: "문다영", equipment: "ENG", desc: "피의자 퇴장 및 호송차량 탑승 스케치" },
    { id: "s84", title: "연세대 복면 성추행 취재", date: "2026-08-20", datesList: ["2026-08-20"], category: "서울 서대문", address: "서울 서대문구 연세로 50", reporter: "윤대일 영상기자 / 차우형 취재기자", camReporter: "윤대일", newsReporter: "차우형", equipment: "ENG, 스마트폰", desc: "기숙사 샛길 예상 도주로 수풀 스케치" },
    { id: "s85", title: "의정부 2명 사망 현장 취재", date: "2026-08-21", datesList: ["2026-08-21"], category: "경기 의정부", address: "경기 의정부시 신곡로 50", reporter: "윤대일 영상기자 / 조건희 취재기자", camReporter: "윤대일", newsReporter: "조건희", equipment: "ENG", desc: "사건 발생 호 수사 테이프 및 현장 스케치" },
    { id: "s86", title: "처서 지나 찾아온 더위 중계 인터뷰", date: "2026-08-24", datesList: ["2026-08-24"], category: "서울 종로", address: "서울 종로구 청계천로 1", reporter: "윤대일 영상기자 / 이승지 취재기자", camReporter: "윤대일", newsReporter: "이승지", equipment: "ENG", desc: "청계천 발 담그는 시민들 및 분수대 스케치" },
    { id: "s87", title: "대한수영연맹 수영 국가대표팀 미디어데이", date: "2026-08-25", datesList: ["2026-08-25"], category: "충북 진천", address: "충북 진천군 광혜원면 선수촌로 105", reporter: "윤대일 영상기자 / 이명노 취재기자", camReporter: "윤대일", newsReporter: "이명노", equipment: "ENG, 고프로", desc: "황선우, 김우민 선수 인터뷰 및 수중 훈련 스케치" },
    { id: "s88", title: "실종 수사 매뉴얼 스케치", date: "2026-08-26", datesList: ["2026-08-26"], category: "서울 마포", address: "서울 마포구 성암로 267", reporter: "윤대일 영상기자 / 윤수한 취재기자", camReporter: "윤대일", newsReporter: "윤수한", equipment: "ENG", desc: "실종 사건 처리 다이어그램 문서 스케치" },
    { id: "s89", title: "부천 중동 음주운전 의심 사고", date: "2026-08-29", datesList: ["2026-08-29"], category: "경기 부천", address: "경기 부천시 원미구 길주로 210", reporter: "김기덕 영상기자 / 이재인 취재기자", camReporter: "김기덕", newsReporter: "이재인", equipment: "ENG", desc: "문예사거리 사고 현장 기자 스탠드업" },
    { id: "s90", title: "인천 옥련동 주택 화재", date: "2026-08-29", datesList: ["2026-08-29"], category: "인천 연수", address: "인천 연수구 청룡로 50", reporter: "김기덕 영상기자 / 이재인 취재기자", camReporter: "김기덕", newsReporter: "이재인", equipment: "ENG", desc: "전소된 주택 계단 창문 및 방범창 스케치" },
    { id: "s91", title: "영화관 장애인 관람석 관련 인터뷰", date: "2026-09-01", datesList: ["2026-09-01"], category: "서울 구로", address: "서울 구로구 구로중앙로 152", reporter: "황주연 VJ / 차우형 취재기자", camReporter: "황주연", newsReporter: "차우형", equipment: "6mm, CX10", desc: "키오스크 예매 및 장애인 편의시설 인터뷰" },
    { id: "s92", title: "용산 아이맥스 오디세이 관람객 취재", date: "2026-09-01", datesList: ["2026-09-01"], category: "서울 용산", address: "서울 용산구 한강대로23길 55", reporter: "황주연 VJ / 차우형 취재기자", camReporter: "황주연", newsReporter: "차우형", equipment: "스마트폰", desc: "용산 아이맥스 전경 및 관람객 퇴장 인터뷰" },
    { id: "s93", title: "코스피 코스닥 종가 스케치", date: "2026-09-02", datesList: ["2026-09-02"], category: "서울 여의도", address: "서울 영등포구 여의나루로 76", reporter: "이종혁 영상기자 / 한재훈 PD", camReporter: "이종혁", newsReporter: "-", equipment: "6mm", desc: "삼성전자, 하이닉스 종가 전광판 스케치" },
    { id: "s94", title: "황정민 스토킹 여성 1심 선고", date: "2026-09-07", datesList: ["2026-09-07"], category: "경기 고양", address: "경기 고양시 일산동구 장백로 213", reporter: "윤대일 영상기자 / 심가은 취재기자", camReporter: "윤대일", newsReporter: "심가은", equipment: "ENG", desc: "변호인단 기자회견 및 고양지원 외경" },
    { id: "s95", title: "위기의 멸종위기종 보전 + 설악산 대청봉", date: "2026-09-09", datesList: ["2026-09-09"], category: "강원 원주", address: "강원 횡성군 갑천면 태기로 926", reporter: "윤대일 영상기자 / 김민욱 취재기자", camReporter: "윤대일", newsReporter: "김민욱", equipment: "ENG, Z90, 드론", desc: "붉은점모시나비 표본 및 대청봉 눈잣나무 스케치" },
    { id: "s96", title: "파주 냉동창고 살인사건 신명호 송치", date: "2026-09-14", datesList: ["2026-09-14"], category: "경기 고양", address: "경기 고양시 일산동구 중앙로 1338", reporter: "윤대일 영상기자 / 박솔잎 취재기자", camReporter: "윤대일", newsReporter: "박솔잎", equipment: "ENG", desc: "피의자 신명호 호송 차량 퇴장 스케치" },
    { id: "s97", title: "수시원서접수 연장 관련 보도 안내 보고", date: "2026-09-14", datesList: ["2026-09-14"], category: "서울 금천", address: "서울 금천구 서부샛길 606", reporter: "윤대일 영상기자 / 제은효 취재기자", camReporter: "윤대일", newsReporter: "제은효", equipment: "ENG", desc: "대교협 회장 사과문 발표 및 질문 답변" },
    { id: "s98", title: "버스노조 2차 조정회의 전 브리핑", date: "2026-09-15", datesList: ["2026-09-15"], category: "서울 마포", address: "서울 마포구 백범로 227", reporter: "윤대일 영상기자 / 이재인 취재기자", camReporter: "윤대일", newsReporter: "이재인", equipment: "ENG", desc: "노사 회의실 입장 및 버스 파업 현수막" },
    { id: "s99", title: "두 국가론의 파장 달라진 인식과 대응", date: "2026-09-18", datesList: ["2026-09-18"], category: "서울 마포", address: "서울 마포구 마포대로 173", reporter: "김동세 영상기자 / 김필국 취재기자", camReporter: "김동세", newsReporter: "김필국", equipment: "ENG, Z90", desc: "사무실 내부 및 사무총장 인터뷰 스케치" },
    { id: "s100", title: "영화 가능한 사랑 기자간담회", date: "2026-09-21", datesList: ["2026-09-21"], category: "서울 용산", address: "서울 용산구 한강대로23길 55", reporter: "위동원 영상기자 / 임소정 취재기자", camReporter: "위동원", newsReporter: "임소정", equipment: "ENG", desc: "조인성, 설경구, 이창동 감독 포토타임" },
    { id: "s101", title: "복개하천 관련 현장 스케치", date: "2026-09-22", datesList: ["2026-09-22"], category: "서울 관악", address: "서울 관악구 봉천로 172", reporter: "김승우 영상기자 / 백승우B 취재기자", camReporter: "김승우", newsReporter: "백승우B", equipment: "ENG", desc: "도림천 교각 및 봉천천 복개교량 하부 스케치" },
    { id: "s102", title: "방송미디어통신위원회 제1기 비전 발표", date: "2026-09-30", datesList: ["2026-09-30"], category: "경기 과천", address: "경기 과천시 관문로 47", reporter: "윤대일 영상기자 / 이재인 취재기자", camReporter: "윤대일", newsReporter: "이재인", equipment: "ENG", desc: "김종철 위원장 기자실 브리핑 싱크" },
    { id: "s103", title: "지방공소청 외경 스케치", date: "2026-10-01", datesList: ["2026-10-01"], category: "경기 의정부", address: "경기 의정부시 녹양로 65", reporter: "윤대일 영상기자 / 이종혁 취재기자", camReporter: "윤대일", newsReporter: "이종혁", equipment: "ENG", desc: "검찰청 간판 교체 작업 현장 스케치" }
];

// 📍 [API 1] 경량 위치 정보 목록 반환 (위도/경도 없음)
app.get('/api/locations/light', (req, res) => {
    const lightData = dbSchedules.map(item => ({
        id: item.id,
        title: item.title,
        date: item.date,
        datesList: item.datesList,
        category: item.category,
        address: item.address,
        isMainHQ: item.isMainHQ || false
    }));
    res.json(lightData);
});

// 🔍 [API 2] 세부 데이터 조회 (Lazy Loading)
app.get('/api/schedules/detail', (req, res) => {
    const { id } = req.query;
    if (id) {
        const item = dbSchedules.find(s => s.id === id);
        return res.json(item ? [item] : []);
    }
    res.json(dbSchedules);
});

// 📝 [API 3] 신규 일정 동적 추가 (위도/경도 요청 제외)
app.post('/api/schedules', (req, res) => {
    const newSchedule = {
        id: "s_" + Date.now(),
        ...req.body
    };
    dbSchedules.push(newSchedule);
    res.json({ success: true, item: newSchedule });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
