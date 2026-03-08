# PF2E Equipment Browser (OpenRouter Edition)
> ใช้ Llama 3.3 70B via OpenRouter — ฟรี ไม่ต้องบัตรเครดิต

## 🚀 วิธีติดตั้งและรัน

### 1. รับ OpenRouter API Key (ฟรี)
1. ไปที่ https://openrouter.ai
2. คลิก Sign Up (ใช้ Google/GitHub ได้)
3. ไปที่ Keys → Create Key
4. Copy key ที่ได้

### 2. ติดตั้ง dependencies
```bash
npm install
```

### 3. สร้างไฟล์ .env
```bash
copy .env.example .env
```
เปิดไฟล์ `.env` แล้วแก้:
```
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxxxxx
PORT=3000
```

### 4. รัน
```bash
npm start
```

### 5. เปิดเว็บ
http://localhost:3000

## ✅ ข้อดีของ OpenRouter
- ฟรี ไม่ต้องบัตรเครดิต
- ไม่มีปัญหา daily quota หมด
- ใช้ Llama 3.3 70B ซึ่งเก่งมาก
