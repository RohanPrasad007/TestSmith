# TestSmith

> An AI-powered question paper generator for NEET & JEE aspirants.

[![Contributors](https://img.shields.io/badge/contributors-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![WEHACK](https://img.shields.io/badge/hackathon-WEHACK-purple.svg)](https://www.instagram.com/we_hack_online/)

## 📑 Project Overview

**TestSmith** is a web application that allows users to generate question papers based on past year questions (PYQs) for NEET and JEE using Google's GenAI API. Our platform streamlines the exam preparation process by enabling students to:

- Practice with AI-curated questions that mirror the actual exam pattern
- Analyze performance metrics to identify strengths and areas for improvement
- Track progress over time with comprehensive dashboards

Built for the **WEHACK** hackathon, TestSmith addresses the challenge of effective exam preparation by leveraging AI to create personalized learning experiences.

## 🛠️ Tech Stack

### Frontend
- **React.js** - For building the user interface
- **Tailwind CSS** - For styling and responsive design
- **React Charts** - For data visualization and performance analytics

### Backend
- **Flask** - Python web framework for serving API endpoints

### Database & Authentication
- **Firebase Authentication** - For secure user authentication and session management

### AI Integration
- **Google GenAI API** - For generating question papers based on PYQs and user preferences

## ✨ Features

### User Authentication
- Secure login and registration using Firebase Authentication

### AI-Powered Question Paper Generation
- Generate question papers based on specified parameters:
  - Exam type (NEET/JEE)
  - Subject(s)
  - Topic(s)
  - Difficulty level
  - Number of questions
  - Time duration

### Exam-Taking Functionality
- Timed exam interface
- Auto-submission when timer expires

### Result Analysis and Insights
- Comprehensive performance dashboard showing:
  - Overall scores, accuracy percentages, and percentile ranking
  - Attempted vs. unattempted question breakdowns with visual charts
  - Subject-wise performance comparison using radar charts
  - Detailed score distribution across Physics, Chemistry, and Mathematics
- JEE/NEET rank prediction and analysis
- College eligibility suggestions based on performance
- Personalized improvement roadmap with actionable next steps

## 🚀 Installation & Setup

### Prerequisites
- Node.js
- Python
- Google GenAI API key

### 1️⃣ Frontend Setup
```sh
cd frontend
npm install
npm run dev
```

### 2️⃣ Backend Setup
```sh
cd backend
pip install -r requirements.txt
echo "API_KEY=your_google_api_key" > .env
python app.py
```

### Environment Variables
Create a `.env` file in the backend directory with the following variables:
```
API_KEY=your_google_api_key
```



## 🎬 Demo Video

Check out our project demonstration and explanation video: 
[view](https://www.youtube.com/watch?v=demo-link)

The video covers:
- Full walkthrough of the TestSmith platform
- Live demonstration of generating and taking a test
- Analysis of result insights and recommendations

## 🤝 Contribution

TestSmith is **open to contributions**! We believe in the power of community to make this tool even better for students.

### How to Contribute
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and adhere to the existing coding style.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- [Rohan Prasad](https://github.com/RohanPrasad007) - Full Stack Developer
- [Riddhi Chavan](https://github.com/Riddhi-chavan) - Frontend Developer
- [Siddique Aham](https://github.com/Siddique-Aham) - Backend Developer
- [Ahmed Kazi](https://github.com/IAK477) - Database & Testing

## 🙏 Acknowledgments

- Google for providing access to the GenAI API
- WEHACK organizers for the opportunity
- All the NEET and JEE aspirants who provided feedback


Made with ❤️ for WEHACK