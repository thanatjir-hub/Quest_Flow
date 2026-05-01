# 🏆 QuestFlow: AI-Powered Gamified Productivity Platform
**เปลี่ยนงานยากผลัดวันประกันพรุ่งให้สนุกไปกับมันง่ายๆ แค่พิมพ์สิ่งที่อยากทำลงไป ระบบจะ Break Down ให้เหลือ Task ย่อยๆ ที่ลงมือทำได้จริง พร้อมความสนุกเหมือนกับได้เล่นเกม** 

**QuestFlow** เป็นเว็บแอปพลิเคชันจัดการงาน (Task Management) ที่เปลี่ยนการทำงานให้กลายเป็นประสบการณ์ RPG ที่น่าตื่นเต้น พัฒนาด้วยเทคโนโลยีสมัยใหม่เพื่อพิสูจน์ทักษะด้าน Full-stack Development และ Generative AI Integration

**หรือกดเข้าไปลองใช้งานได้ตามลิงก์นี้**   [กด คลิ๊กที่นี่](https://quest-flow-aqqjyil37-thanatjir-hubs-projects.vercel.app/)

---

## 📸 Showcasing QuestFlow

<div align="center">
  <img src="https://drive.google.com/uc?id=15B1cl9lqxdp57GpODYAGo2pGJB8X8y76" alt="QuestFlow Dashboard" width="800">
  <p><em>หน้าจอหลัก Dashboard ที่รวบรวมระบบ Gamification และรายการเควสต์</em></p>
  
  <img src="https://drive.google.com/uc?id=1iSERCL58sqdkeWHbZal-51-DQzr991oH" alt="AI Feature" width="800">
  <p><em>ระบบ AI Epic Naming เปลี่ยนชื่อเควสต์ธรรมดาให้กลายเป็นภารกิจในตำนาน</em></p>
</div>

---

## 🚀 Key Features (ความสามารถหลัก)

- **AI Epic Naming (Genkit)**: ใช้ Gemini 2.5 Flash ในการวิเคราะห์และเปลี่ยนชื่อภารกิจให้น่าสนใจในสไตล์ RPG (เช่น "ล้างจาน" -> "ชำระล้างภาชนะศิลาแห่งโภชนาการ")
- **AI Quest Breakdown**: ระบบผู้ช่วยอัจฉริยะที่ช่วยแตกงานใหญ่ที่ซับซ้อนให้กลายเป็นขั้นตอนย่อย (Sub-quests) ที่ทำได้จริง
- **Gamification Engine**: ระบบเก็บค่าประสบการณ์ (XP), การเลเวลอัป (Level Up) และการปลดล็อกเหรียญตราความสำเร็จ (Achievements) แบบ Real-time
- **Responsive Dashboard**: ออกแบบหน้าจอให้สวยงามและใช้งานง่ายในทุกอุปกรณ์ (Desktop & Mobile)

## 🛠️ Tech Stack (เทคโนโลยีที่ใช้)

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, ShadCN UI (Radix UI)
- **AI Orchestration**: Genkit SDK + Google Gemini 2.5 Flash
- **State Management**: React Hooks & LocalStorage Persistence
- **Deployment**: Vercel

## 🧠 Technical Highlights (ความท้าทายทางเทคนิค)

- **AI Prompt Engineering**: ออกแบบ Prompt ให้ AI เข้าใจบริบทความเป็นเกมและภาษาไทยอย่างถูกต้อง
- **Dynamic UI/UX**: ใช้ Tailwind Animation และ CSS Variables เพื่อสร้างความรู้สึกเหมือนเล่นเกม RPG จริงๆ
- **Clean Architecture**: แยกส่วน Logic ของ AI (Genkit Flows) ออกจาก UI อย่างชัดเจนเพื่อให้ง่ายต่อการขยายผลในอนาคต

## 📦 How to Run Locally (การติดตั้งในเครื่อง)

1. **Clone & Install**
   ```bash
   git clone https://github.com/thanatjir-hub/Quest_Flow.git
   cd Quest_Flow
   npm install
   ```

2. **Set Environment Variable**
   สร้างไฟล์ `.env` และเพิ่ม API Key:
   ```env
   GOOGLE_GENAI_API_KEY=your_gemini_api_key
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

---

## 👨‍💻 Developed by

**Thanat Jirapongnoppadon**

[![GitHub](https://img.shields.io/badge/GitHub-Profile-black?style=flat&logo=github)](https://github.com/thanatjir-hub)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/thanat-jirapongnoppadon-964476396)

*This project was built to demonstrate the integration of Generative AI into modern web applications.*
