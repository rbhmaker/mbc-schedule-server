const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;
const DATA_FILE = path.join(__dirname, 'schedules.json');

app.use(cors());
app.use(express.json());

// 데이터 로드
function getSchedules() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

// 데이터 저장
function saveSchedules(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// 1. 전체 일정 조회 API
app.get('/api/locations/light', (req, res) => {
    const schedules = getSchedules();
    res.json(schedules);
});

// 2. 신규 일정 추가 API
app.post('/api/locations', (req, res) => {
    const schedules = getSchedules();
    const newSchedule = {
        id: Date.now(),
        title: req.body.title || '',
        date: req.body.date || '',
        category: req.body.category || '기타',
        address: req.body.address || '',
        lat: parseFloat(req.body.lat) || 37.5802,
        lng: parseFloat(req.body.lng) || 126.8903,
        reporter: req.body.reporter || '-',
        cameraStaff: req.body.cameraStaff || '-',
        equipment: req.body.equipment || '6mm',
        newsUrl: req.body.newsUrl || '',
        photoUrl: req.body.photoUrl || '',
        desc: req.body.desc || '',
        isMainHQ: false,
        regionName: req.body.regionName || '전국'
    };

    schedules.push(newSchedule);
    saveSchedules(schedules);
    res.status(201).json({ message: '성공적으로 저장되었습니다.', data: newSchedule });
});

// 3. 기존 일정 수정 API
app.put('/api/locations/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let schedules = getSchedules();
    const index = schedules.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({ message: '일정을 찾을 수 없습니다.' });
    }

    schedules[index] = { ...schedules[index], ...req.body };
    saveSchedules(schedules);
    res.json({ message: '성공적으로 수정되었습니다.', data: schedules[index] });
});

// 4. 일정 삭제 API
app.delete('/api/locations/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let schedules = getSchedules();
    schedules = schedules.filter(item => item.id !== id);
    saveSchedules(schedules);
    res.json({ message: '성공적으로 삭제되었습니다.' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
