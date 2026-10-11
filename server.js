const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;
const DATA_FILE = path.join(__dirname, 'schedules.json');

// 카카오 API 키 (REST API 키 입력)
const KAKAO_API_KEY = process.env.KAKAO_REST_API_KEY || 'YOUR_KAKAO_REST_API_KEY';

app.use(cors());
app.use(express.json());

function getSchedules() {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (err) {
        return [];
    }
}

function saveSchedules(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// 📌 건물명/상호명을 카카오 API로 도로명주소 및 좌표 자동 변환
async function geocodeLocation(keyword) {
    if (!keyword) return { address: '', lat: 37.5802, lng: 126.8903, regionName: '전국' };
    
    try {
        const response = await axios.get('https://dapi.kakao.com/v2/local/search/keyword.json', {
            headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` },
            params: { query: keyword }
        });

        if (response.data.documents && response.data.documents.length > 0) {
            const first = response.data.documents[0];
            const roadAddr = first.road_address_name || first.address_name;
            const regionParts = roadAddr.split(' ');
            const regionName = regionParts.length > 1 ? regionParts[1] : '전국';

            return {
                address: roadAddr,
                lat: parseFloat(first.y),
                lng: parseFloat(first.x),
                regionName: regionName
            };
        }
    } catch (e) {
        console.error('카카오 위치 변환 오류:', e.message);
    }
    
    return { address: keyword, lat: 37.5802, lng: 126.8903, regionName: '전국' };
}

// 1. 전체 일정 조회 (클라이언트 좌표 자동 포함 전송)
app.get('/api/locations/light', async (req, res) => {
    let schedules = getSchedules();
    
    // 좌표나 주소가 비어있는 기존 항목 자동 보완 처리
    let updated = false;
    for (let item of schedules) {
        if (!item.lat || !item.lng) {
            const geo = await geocodeLocation(item.address || item.title);
            item.address = item.address || geo.address;
            item.lat = geo.lat;
            item.lng = geo.lng;
            item.regionName = item.regionName || geo.regionName;
            updated = true;
        }
    }
    if (updated) saveSchedules(schedules);

    res.json(schedules);
});

// 2. 신규 일정 추가 API (건물명 입력 시 주소/좌표 자동 변환)
app.post('/api/locations', async (req, res) => {
    const schedules = getSchedules();
    const geo = await geocodeLocation(req.body.address || req.body.title);

    const newSchedule = {
        id: Date.now(),
        title: req.body.title || '',
        date: req.body.date || '',
        address: geo.address,
        lat: geo.lat,
        lng: geo.lng,
        regionName: geo.regionName,
        reporter: req.body.reporter || '-',
        cameraStaff: req.body.cameraStaff || '-',
        equipment: req.body.equipment || '6mm',
        newsUrl: req.body.newsUrl || '',
        photoUrl: req.body.photoUrl || '',
        desc: req.body.desc || '',
        isMainHQ: false
    };

    schedules.push(newSchedule);
    saveSchedules(schedules);
    res.status(201).json({ message: '저장 성공', data: newSchedule });
});

// 3. 기존 일정 수정 API
app.put('/api/locations/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    let schedules = getSchedules();
    const index = schedules.findIndex(item => item.id === id);

    if (index === -1) return res.status(404).json({ message: '일정 없음' });

    if (req.body.address) {
        const geo = await geocodeLocation(req.body.address);
        req.body.lat = geo.lat;
        req.body.lng = geo.lng;
        req.body.regionName = geo.regionName;
    }

    schedules[index] = { ...schedules[index], ...req.body };
    saveSchedules(schedules);
    res.json({ message: '수정 성공', data: schedules[index] });
});

// 4. 일정 삭제 API
app.delete('/api/locations/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let schedules = getSchedules();
    schedules = schedules.filter(item => item.id !== id);
    saveSchedules(schedules);
    res.json({ message: '삭제 성공' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
