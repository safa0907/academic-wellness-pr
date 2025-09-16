# GradeUp - AI-Powered Learning & Wellness Platform

## Core Purpose & Success

**Mission Statement**: GradeUp is an AI-powered study companion that combines personalized learning plans with mental wellness tools to help students achieve academic success while maintaining emotional well-being.

**Success Indicators**: 
- Students report improved study efficiency and reduced stress levels
- Increased confidence scores across selected subjects
- Sustained engagement with daily study plans and wellness activities
- Positive learning outcomes and grade improvements

**Experience Qualities**: Supportive, Intelligent, Calming

## Project Classification & Approach

**Complexity Level**: Complex Application with AI integration, comprehensive user profiles, progress tracking, and wellness features

**Primary User Activity**: Creating (study plans, wellness routines) and Interacting (with AI-powered features, progress tracking)

## Core Problem Analysis

Students often struggle with:
- Creating effective, personalized study schedules
- Managing academic stress and maintaining mental wellness
- Tracking progress across multiple subjects
- Building and maintaining study confidence
- Balancing academic demands with well-being

## Essential Features

### 1. Personalized Onboarding
- **Functionality**: Multi-step profile creation with subject selection, confidence assessment, and goal setting
- **Purpose**: Establishes baseline for AI personalization and creates tailored experience
- **Success Criteria**: Complete user profile leads to relevant, personalized content

### 2. AI-Powered Study Planner ("Grade UP")
- **Functionality**: Generates adaptive study schedules based on user profile, confidence levels, and goals. Features automatic rollover of incomplete sessions to the next day and manual rollover capabilities
- **Purpose**: Provides intelligent, personalized learning paths that adapt to user progress and ensures continuity
- **Success Criteria**: Users follow generated plans and show improved confidence over time

### 2.1. Study History & Session Management
- **Functionality**: Comprehensive view of past study plans with completion tracking, statistics, and ability to manually roll over incomplete sessions to current day
- **Purpose**: Enables progress review and flexible session management for better study continuity
- **Success Criteria**: Users can track their study patterns and maintain consistency through session rollover features

### 3. Mental Wellness Toolkit
- **Functionality**: Breathing exercises, stress tracking, mindfulness tools, and wellness analytics
- **Purpose**: Supports student mental health and stress management during academic challenges
- **Success Criteria**: Regular engagement with wellness tools correlates with lower reported stress

### 4. Interactive Progress Dashboard
- **Functionality**: Visual analytics showing study hours, confidence trends, wellness metrics, and achievements
- **Purpose**: Motivates continued engagement and provides clear progress visualization
- **Success Criteria**: Users can easily understand their progress and feel motivated to continue

### 5. Practice Quiz System
- **Functionality**: Subject-specific quizzes with performance tracking, adaptive difficulty, social media sharing capabilities, and detailed explanations
- **Purpose**: Reinforces learning, provides objective progress measurement, and allows students to celebrate achievements publicly
- **Success Criteria**: Quiz performance improves over time, correlates with confidence gains, and social sharing increases engagement

### 6. Leaving Certificate Preparation Integration  
- **Functionality**: Direct access to comprehensive LC exam preparation portal (https://nice-coast-0da719e03.2.azurestaticapps.net) with practice materials and resources
- **Purpose**: Provides specialized support for Irish students preparing for Leaving Certificate examinations
- **Success Criteria**: Seamless access to official LC preparation resources integrated within the learning platform

### 7. HSE Mental Health Crisis Support
- **Functionality**: Automatic detection of high stress levels (8+/10) with immediate access to HSE mental health helplines, Samaritans, Pieta House, and Text About It crisis support services
- **Purpose**: Ensures student safety and provides immediate professional mental health resources when stress levels become concerning
- **Success Criteria**: High-stress situations are identified quickly with appropriate support resources readily available and accessible

### 8. Social Media Integration
- **Functionality**: Share quiz results and learning achievements on Twitter, Facebook, LinkedIn with pre-formatted motivational messages and hashtags
- **Purpose**: Motivates continued engagement through social validation, celebrates academic progress publicly, and builds a positive learning community
- **Success Criteria**: Increased platform engagement, positive reinforcement through social sharing, and improved motivation to continue learning

### 9. Motivational System
- **Functionality**: Achievement badges, positive reinforcement, streak tracking, and encouraging messages
- **Purpose**: Maintains engagement and celebrates student progress
- **Success Criteria**: Users report feeling motivated and maintain consistent platform usage

## Design Direction

### Visual Tone & Identity

**Emotional Response**: Students should feel supported, confident, and calm when using GradeUp. The design should reduce anxiety while inspiring productivity.

**Design Personality**: Modern, trustworthy, gentle, and intelligent. The interface should feel like a supportive study partner rather than a demanding taskmaster.

**Visual Metaphors**: Growth (plants, progress bars), academic achievement (graduation symbols), wellness (breathing patterns, peaceful elements)

**Simplicity Spectrum**: Clean and minimal interface that reduces cognitive load while providing rich functionality when needed

### Color Strategy

**Color Scheme Type**: Triadic with wellness-focused approach
- **Primary Color**: Soft Blue (oklch(0.58 0.15 250)) - Communicates trust, focus, and reliability
- **Secondary Color**: Mint Green (oklch(0.72 0.13 165)) - Represents wellness, growth, and calm
- **Accent Color**: Warm Amber (oklch(0.72 0.12 85)) - Highlights achievements and important actions

**Color Psychology**: 
- Blue promotes focus and trust, essential for learning applications
- Green reduces stress and promotes wellness
- Amber creates positive associations with achievement

**Foreground/Background Pairings**:
- Background (near-white): Dark text (oklch(0.15 0.01 240)) - 15.8:1 contrast ratio
- Card (white): Dark text (oklch(0.15 0.01 240)) - 16.7:1 contrast ratio  
- Primary (soft blue): White text (oklch(0.99 0.002 240)) - 7.1:1 contrast ratio
- Secondary (mint): White text (oklch(0.99 0.002 240)) - 8.9:1 contrast ratio
- Accent (amber): Dark text (oklch(0.15 0.01 240)) - 8.2:1 contrast ratio

### Typography System

**Font Selection**: Inter - A modern, highly legible sans-serif optimized for user interfaces
**Font Personality**: Clean, professional, friendly, and highly readable across all sizes
**Typographic Hierarchy**:
- Headlines: Inter Bold (700) for main titles and section headers
- Subheadings: Inter Semibold (600) for subsections and card titles  
- Body: Inter Regular (400) for main content
- Captions: Inter Medium (500) for metadata and secondary information

**Legibility**: Inter was specifically designed for screen readability with excellent character distinction

### Visual Hierarchy & Layout

**Attention Direction**: Card-based layout guides users through key actions with subtle shadows and spacing
**White Space Philosophy**: Generous spacing reduces cognitive load and creates a calming, uncluttered experience
**Grid System**: Responsive grid using CSS Grid and Flexbox for consistent alignment
**Content Density**: Balanced approach - comprehensive information without overwhelming users

### Animations

**Purposeful Motion**: Subtle transitions that provide feedback and guide attention without distraction
**Brand Personality**: Gentle, supportive animations that reinforce the caring, intelligent brand character
**Contextual Appropriateness**: Calm, measured animations that support focus rather than excitement

### UI Components & Customization

**Component Strategy**: 
- Shadcn UI v4 components for consistency and accessibility
- Custom modifications using Tailwind classes to match brand palette
- Cards for content organization and hierarchy
- Buttons with clear action hierarchy (primary, secondary, ghost)
- Progress indicators for motivation and feedback

**Component States**:
- Hover states with subtle elevation and color shifts
- Focus states with visible ring indicators for accessibility
- Loading states with branded animations
- Success states with positive color reinforcement

### Accessibility & Readability

**Contrast Goal**: WCAG AA compliance minimum (4.5:1) with many pairings exceeding AAA standards (7:1)
**Keyboard Navigation**: Full keyboard accessibility with logical tab order
**Screen Reader Support**: Semantic HTML and proper ARIA labels
**Motion Sensitivity**: Reduced motion options respect user preferences

## Implementation Considerations

**Data Persistence**: User profiles, study plans, and progress data stored using useKV for cross-session continuity
**AI Integration**: Planned integration with LLM APIs for intelligent study plan generation and content suggestions
**Responsive Design**: Mobile-first approach ensuring excellent experience across all device sizes
**Performance**: Optimized loading and smooth interactions to maintain focus on learning

## Reflection

GradeUp uniquely combines academic support with wellness focus, addressing the complete student experience rather than just academic performance. The calming design approach differentiates it from more aggressive productivity tools, making it suitable for stress-prone students. The AI-powered personalization ensures each user receives relevant, appropriately challenging content that adapts to their progress.