const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'schedules.json');

// JSON 파일 읽기 헬퍼 함수
function readSchedules() {
    try {
        if (!fs.existsSync(DATA_FILE)) return [];
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data || '[]');
    } catch (err) {
        console.error("JSON 파일 읽기 오류:", err);
        return [];
    }
}

// JSON 파일 저장 헬퍼 함수
function saveSchedules(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error("JSON 파일 저장 오류:", err);
    }
}

// 주소에서 서울은 '구', 지방/경기는 '시/군'을 자동 추출
function parseRegion(address) {
    if (!address) return "전국";
    if (address.includes("서울")) {
        const m = address.match(/([가-힣]+구)/);
        if (m) return m[1];
    }
    const m = address.match(/([가-힣]+시|[가-힣]+군)/);
    if (m) return m[1];
    return address.split(" ")[0];
}

// 1. 전체 위치 가벼운 목록 조회
app.get('/api/locations/light', (req, res) => {
    const schedules = readSchedules();
    res.json(schedules);
});

// 2. 단일 일정 상세 조회
app.get('/api/schedules/detail', (req, res) => {
    const id = parseInt(req.query.id);
    const schedules = readSchedules();
    const item = schedules.filter(s => s.id === id);
    res.json(item);
});

// 3. 신규 일정 추가 (JSON 파일 자동 업데이트)
app.post('/api/schedules', (req, res) => {
    const schedules = readSchedules();
    const newSchedule = {
        id: Date.now(),
        ...req.body,
        regionName: parseRegion(req.body.address),
        isMainHQ: false
    };
    
    schedules.push(newSchedule);
    saveSchedules(schedules);
    
    res.status(201).json({ success: true, data: newSchedule });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
