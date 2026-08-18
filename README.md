# AI Productivity Hub

Below is a polished Lovable prompt designed to produce a functional, presentation-ready SaaS application, not just a visual mockup. It emphasizes architecture, prompt engineering, UX, AI behavior, responsible AI, and responsive implementation.

AI Workplace Productivity Assistant — Lovable Build Specification

AI Workplace Productivity Assistant — Lovable Build Specification

1. Product Overview

Build a modern, responsive SaaS web application called AI Workplace Productivity Assistant.

The application helps professionals automate common workplace tasks using AI, improving productivity, communication, planning, research, and meeting follow-up.

The final product should feel like a polished commercial SaaS platform rather than a student prototype. Prioritize functionality, usability, professional visual design, clear information architecture, structured AI prompting, editable outputs, and responsible AI practices.

Use a clean, modern interface inspired by high-quality productivity SaaS products.

2. Primary Application Features

Implement the following five AI productivity tools:

A. Smart Email Generator

Allow users to generate professional workplace emails from a short description.

Inputs:

Recipient/context

Purpose of the email

Key points

Desired tone

Optional additional instructions

Tone options:

Formal

Friendly

Persuasive

Output:

AI-generated email

Subject line

Editable email body

Copy button

Regenerate button

Clear/reset button

Prompt behavior:
The AI should produce concise, professional workplace communication appropriate to the selected tone. It should not invent facts, commitments, dates, names, or information that the user did not provide.

B. Meeting Notes Summarizer

Allow users to paste or enter long meeting notes.

The AI should transform unstructured notes into a structured meeting summary containing:

Executive summary

Key discussion points

Decisions made

Action items

Responsible person, when explicitly stated

Deadlines, when explicitly stated

Open questions

Follow-up recommendations

Important behavior:
Never invent action-item owners, deadlines, decisions, or meeting details. If information is missing, explicitly label it as Not specified.

Provide:

Editable summary

Copy button

Regenerate button

Clear button

C. AI Task Planner

Allow users to enter their tasks and optionally provide:

Deadline

Estimated duration

Priority

Workday availability

Additional constraints

Generate an organized daily or weekly plan.

The AI should:

Prioritize urgent and important tasks

Consider deadlines

Avoid unrealistic scheduling

Break large tasks into manageable steps

Include reasonable breaks when appropriate

Identify scheduling conflicts

Explain prioritization briefly

Output:

Prioritized task list

Recommended schedule

Priority labels

Estimated time

Deadline information

Editable plan

Copy/export-friendly format

Never present AI-generated schedules as guaranteed optimal. Clearly indicate that users should review and adjust the plan.

D. AI Research Assistant

Allow users to enter a research question, topic, or article text.

The assistant should produce:

Concise summary

Key insights

Important findings

Potential implications

Recommendations

Follow-up questions

If source material is supplied by the user, distinguish between:

Information directly supported by the supplied material

AI-generated interpretation or recommendations

Do not fabricate sources, citations, statistics, quotes, or research findings.

Include a visible notice encouraging users to verify important information against authoritative sources.

E. AI Workplace Chatbot

Create an interactive AI workplace assistant interface.

Users should be able to ask workplace-related questions such as:

Help me write this email

Summarize these notes

Help prioritize my tasks

Explain this workplace topic

Help me prepare for a meeting

Turn these notes into an action plan

The chatbot should:

Maintain conversational context during the session

Provide concise but useful responses

Ask for missing information when necessary

Avoid fabricating facts

Clearly distinguish suggestions from verified information

Provide professional workplace-oriented assistance

Include:

Chat history

User and AI message styling

Text input

Send button

Loading/processing state

Clear conversation option

3. Dashboard Layout

Create a professional SaaS dashboard with:

Sidebar Navigation

Include:

Dashboard

Smart Email

Meeting Summarizer

Task Planner

Research Assistant

AI Chat

Settings

The active navigation item should be visually highlighted.

On mobile:

Convert the sidebar into a responsive drawer or collapsible navigation menu.

Ensure all functionality remains accessible.

4. Dashboard Home

The dashboard should provide an immediate overview of the application.

Include:

Header

Application name

Short productivity-focused tagline

User/profile area

Responsive navigation control

Welcome Section

Example:

Work smarter with AI

Automate repetitive workplace tasks, organize information, and turn ideas into actionable outcomes.

Productivity Tool Cards

Display five feature cards:

Smart Email Generator

Meeting Notes Summarizer

AI Task Planner

AI Research Assistant

AI Workplace Chat

Each card should contain:

Icon

Short description

Primary action

Clear visual hierarchy

Recent Activity

Show recently used AI tools or generated outputs using realistic sample data.

Include empty states when there is no activity.

5. AI Tool Interface

Each AI feature should follow a consistent layout.

Use a two-column desktop layout:

Left: Input Panel

Contains:

Clearly labeled form fields

Helpful placeholder text

Tool-specific controls

Primary Generate button

Clear/reset button

Right: Output Panel

Contains:

AI-generated result

Editable output area

Copy button

Regenerate button

Relevant metadata

Responsible AI notice

On mobile, stack the input and output sections vertically.

The UI should clearly communicate:
Input → AI Processing → Output

6. Structured Prompt Engineering

Do not rely on vague prompts such as "write an email" or "summarize this."

Create dedicated structured system prompts for each AI capability.

Each prompt should define:

Role

Clearly establish the AI's workplace productivity role.

Objective

Define exactly what the AI must accomplish.

User Input

Clearly identify the information provided by the user.

Constraints

Specify formatting, tone, accuracy, length, and behavioral requirements.

Output Format

Require a predictable structured response.

Safety / Accuracy Rules

The AI must:

Never intentionally fabricate information

Never invent missing facts

Identify uncertainty

Preserve user-provided facts

Avoid unsupported claims

Encourage verification for high-impact information

Example conceptual structure:

ROLE:
You are a professional workplace productivity assistant.

OBJECTIVE:
Complete the requested workplace task accurately and efficiently.

USER INPUT:
{user_input}

CONSTRAINTS:
- Use only information provided by the user unless explicitly asked for general suggestions.
- Do not invent names, dates, statistics, deadlines, decisions, or commitments.
- Ask for clarification when essential information is missing.
- Keep the response professional and actionable.

OUTPUT:
Return the response using the specified structured format.

RESPONSIBLE AI:
Clearly distinguish user-provided facts from AI-generated suggestions.

Create specialized versions of this framework for each of the five tools.

7. Editable AI Outputs

AI-generated results must never be locked or displayed as static text only.

Users should be able to:

Edit generated content

Copy results

Regenerate results

Clear results

Reuse outputs

Use editable text areas or rich editable output components where appropriate.

Show clear visual states for:

Empty

Generating

Generated

Error

Regenerated

8. AI Processing Experience

When generating an AI response:

Disable duplicate generation requests while processing

Show a clear loading indicator

Use an appropriate status message such as "Generating your response..."

Preserve existing input

Handle API failures gracefully

Display a useful error message

Allow the user to retry

Never leave the interface appearing frozen.

9. Responsible AI

Include a clearly visible but unobtrusive Responsible AI disclaimer throughout the application.

Suggested wording:

AI-generated content may contain errors or omissions. Review important information before using it for workplace, business, legal, financial, or other consequential decisions. The assistant does not replace professional judgment.

For the Research Assistant, additionally encourage users to verify important claims against authoritative sources.

For generated workplace content, make it clear that users remain responsible for reviewing and approving the final output.

Do not claim that AI responses are guaranteed to be accurate.

10. Design System

Use a clean, modern SaaS aesthetic.

Visual direction:

Minimal

Professional

Premium

Spacious

High readability

Strong typography hierarchy

Subtle borders

Soft shadows

Rounded cards

Consistent iconography

Restrained use of accent color

Avoid:

Excessive gradients

Cluttered layouts

Oversized decorative elements

Excessive animations

Generic template-like styling

Use a consistent design system for:

Buttons

Cards

Inputs

Textareas

Badges

Navigation

Alerts

Loading states

Empty states

Error states

Support both desktop and mobile screen sizes.

11. Responsive Requirements

The application must work properly across:

Desktop

Laptop

Tablet

Mobile

Desktop:

Persistent sidebar

Multi-column dashboard

Input/output panels displayed side-by-side

Tablet:

Adaptive spacing

Flexible columns

Collapsible navigation when necessary

Mobile:

Collapsible sidebar/drawer

Single-column content

Full-width inputs

Full-width outputs

Touch-friendly controls

No horizontal scrolling

Do not simply shrink the desktop layout. Reflow the interface appropriately for smaller screens.

12. Navigation and Routing

Implement functional navigation between all major application areas.

Routes/pages should include:

/dashboard

/email

/meetings

/tasks

/research

/chat

/settings

Navigation should preserve the application's visual structure and active state.

13. Settings

Create a simple Settings page containing:

User preferences

Default email tone

Default output length

AI response preferences

Responsible AI information

Clear local/session data option where applicable

Keep settings functional and avoid adding unnecessary complexity.

14. Data and State Management

Use clean application state management.

Persist appropriate session data where practical, such as:

Recent activity

Current generated outputs

Chat conversation during the session

User preferences

Do not expose API keys or secrets in frontend code.

If an AI API is required, use secure server-side handling or the appropriate Lovable/backend integration.

Create clear fallback/demo behavior if an AI service is not configured so that the application's interface can still be demonstrated without crashing.

15. Error Handling

Every AI tool must gracefully handle:

Empty input

Invalid input

API failure

Timeout

Rate limits

Unexpected AI response format

Use clear user-facing messages rather than technical errors.

Example:

Unable to generate response

Something went wrong while processing your request. Please try again.

16. Accessibility

Follow modern accessibility practices.

Include:

Proper labels for form fields

Keyboard-accessible controls

Visible focus states

Sufficient color contrast

Accessible navigation

Descriptive button labels

Semantic page structure

Responsive touch targets

Do not rely on color alone to communicate status.

17. Demo Data

Include realistic sample content so the application looks complete when first opened.

Examples:

Sample professional email request

Sample meeting notes

Sample task list

Sample research question

Sample chatbot conversation

Clearly distinguish demo content from actual user-generated content.

18. Innovation

Add subtle productivity enhancements that make the application feel more innovative without introducing unnecessary complexity.

Consider:

Suggested prompts

Recent tools

Quick actions

Reusable prompt templates

"Improve output" action

"Make shorter" action

"Make more professional" action

"Convert to action items" action

These enhancements should complement the core functionality rather than distract from it.

19. Technical Quality

Prioritize:

Reusable components

Clean component architecture

Maintainable code

Consistent naming

Responsive CSS

Proper loading and error states

Secure API integration

Minimal unnecessary dependencies

Fast interactions

No broken links or dead buttons

Avoid creating separate duplicated UI implementations for each AI tool. Build reusable input, output, loading, error, and action components where appropriate.

20. Final Acceptance Criteria

The completed application must:

Feel like a polished professional SaaS product

Have a functional dashboard

Have functional sidebar navigation

Include all five AI productivity features

Work responsively on desktop and mobile

Provide structured AI prompts for every AI feature

Generate structured AI outputs

Make outputs editable

Support copy/regenerate/clear actions

Include loading and error states

Include responsible AI disclaimers

Avoid fabricated information in AI outputs

Provide realistic demo data

Have consistent visual design

Be accessible and keyboard-friendly

Avoid exposing API secrets

Be ready for presentation and evaluation

Priority Order

When making implementation decisions, prioritize:

Core functionality

AI prompt quality

User experience

Responsible AI

Responsive behavior

Visual polish

Innovation

Do not sacrifice core functionality for decorative design.

Build the application as a cohesive product called AI Workplace Productivity Assistant, with a clear professional identity and consistent UX across every feature.

Would you like the next version optimized for Lovable's one-shot build, Supabase + real AI APIs, or maximum grading/evaluation impact?

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/dec92648-0119-4b7f-869b-18315e4b6202).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
