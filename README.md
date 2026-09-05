pawan-society/
│
├── public/
│   ├── images/
│   │   ├── society-logo.png
│   │   └── default-avatar.png
│   ├── pdf/
│   │   ├── bills/
│   │   ├── receipts/
│   │   └── reports/
│   └── icons/
│
├── src/
│   │
│   ├── app/
│   │   │
│   │   ├── api/
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.js
│   │   │   │   │
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.js
│   │   │   │   │
│   │   │   │   ├── me/
│   │   │   │   │   └── route.js
│   │   │   │   │
│   │   │   │   ├── refresh/
│   │   │   │   │   └── route.js
│   │   │   │   │
│   │   │   │   ├── change-password/
│   │   │   │   │   └── route.js
│   │   │   │   │
│   │   │   │   ├── forgot-password/
│   │   │   │   │   ├── send-otp/
│   │   │   │   │   │   └── route.js
│   │   │   │   │   │
│   │   │   │   │   ├── verify-otp/
│   │   │   │   │   │   └── route.js
│   │   │   │   │   │
│   │   │   │   │   └── reset/
│   │   │   │   │       └── route.js
│   │   │   │   │
│   │   │   │   └── setup/
│   │   │   │       └── route.js
│   │   │   │
│   │   │   ├── society/
│   │   │   │   └── route.js
│   │   │   │
│   │   │   ├── rooms/
│   │   │   │   ├── route.js
│   │   │   │   ├── import/
│   │   │   │   │   └── route.js
│   │   │   │   └── [id]/
│   │   │   │       └── route.js
│   │   │   │
│   │   │   ├── members/
│   │   │   │   ├── route.js
│   │   │   │   ├── search/
│   │   │   │   │   └── route.js
│   │   │   │   └── [id]/
│   │   │   │       ├── route.js
│   │   │   │       └── ledger/
│   │   │   │           └── route.js
│   │   │   │
│   │   │   ├── charges/
│   │   │   │   ├── route.js
│   │   │   │   └── [id]/
│   │   │   │       └── route.js
│   │   │   │
│   │   │   ├── water/
│   │   │   │   ├── readings/
│   │   │   │   │   ├── route.js
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.js
│   │   │   │   └── rate/
│   │   │   │       └── route.js
│   │   │   │
│   │   │   ├── billing/
│   │   │   │   ├── route.js
│   │   │   │   ├── generate/
│   │   │   │   │   └── route.js
│   │   │   │   ├── calculate/
│   │   │   │   │   └── route.js
│   │   │   │   ├── outstanding/
│   │   │   │   │   └── route.js
│   │   │   │   └── [id]/
│   │   │   │       ├── route.js
│   │   │   │       └── pdf/
│   │   │   │           └── route.js
│   │   │   │
│   │   │   ├── penalties/
│   │   │   │   ├── route.js
│   │   │   │   └── config/
│   │   │   │       └── route.js
│   │   │   │
│   │   │   ├── payments/
│   │   │   │   ├── route.js
│   │   │   │   └── [id]/
│   │   │   │       └── route.js
│   │   │   │
│   │   │   ├── receipts/
│   │   │   │   ├── route.js
│   │   │   │   └── [id]/
│   │   │   │       ├── route.js
│   │   │   │       └── pdf/
│   │   │   │           └── route.js
│   │   │   │
│   │   │   ├── ledger/
│   │   │   │   ├── route.js
│   │   │   │   ├── member/
│   │   │   │   │   └── [memberId]/
│   │   │   │   │       └── route.js
│   │   │   │   └── room/
│   │   │   │       └── [roomNo]/
│   │   │   │           └── route.js
│   │   │   │
│   │   │   ├── expenses/
│   │   │   │   ├── route.js
│   │   │   │   ├── categories/
│   │   │   │   │   └── route.js
│   │   │   │   └── [id]/
│   │   │   │       └── route.js
│   │   │   │
│   │   │   ├── electricity/
│   │   │   │   ├── route.js
│   │   │   │   └── [id]/
│   │   │   │       └── route.js
│   │   │   │
│   │   │   ├── drinking-water/
│   │   │   │   ├── route.js
│   │   │   │   └── [id]/
│   │   │   │       └── route.js
│   │   │   │
│   │   │   ├── works/
│   │   │   │   ├── route.js
│   │   │   │   ├── categories/
│   │   │   │   │   └── route.js
│   │   │   │   └── [id]/
│   │   │   │       └── route.js
│   │   │   │
│   │   │   ├── transactions/
│   │   │   │   ├── route.js
│   │   │   │   └── [id]/
│   │   │   │       └── route.js
│   │   │   │
│   │   │   ├── cashbook/
│   │   │   │   └── route.js
│   │   │   │
│   │   │   ├── reports/
│   │   │   │   ├── daily/
│   │   │   │   │   └── route.js
│   │   │   │   ├── monthly/
│   │   │   │   │   └── route.js
│   │   │   │   ├── yearly/
│   │   │   │   │   └── route.js
│   │   │   │   ├── income/
│   │   │   │   │   └── route.js
│   │   │   │   ├── expenses/
│   │   │   │   │   └── route.js
│   │   │   │   ├── collection/
│   │   │   │   │   └── route.js
│   │   │   │   ├── outstanding/
│   │   │   │   │   └── route.js
│   │   │   │   ├── cashbook/
│   │   │   │   │   └── route.js
│   │   │   │   └── audit/
│   │   │   │       └── route.js
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   └── route.js
│   │   │   │
│   │   │   ├── email/
│   │   │   │   ├── bill/
│   │   │   │   │   └── route.js
│   │   │   │   ├── receipt/
│   │   │   │   │   └── route.js
│   │   │   │   ├── reminder/
│   │   │   │   │   └── route.js
│   │   │   │   └── test/
│   │   │   │       └── route.js
│   │   │   │
│   │   │   ├── ai/
│   │   │   │   ├── ocr/
│   │   │   │   │   └── route.js
│   │   │   │   └── status/
│   │   │   │       └── route.js
│   │   │   │
│   │   │   ├── audit/
│   │   │   │   └── route.js
│   │   │   │
│   │   │   └── cron/
│   │   │       ├── daily-reminder/
│   │   │       │   └── route.js
│   │   │       └── monthly-billing/
│   │   │           └── route.js
│   │   │
│   │   ├── login/
│   │   │   └── page.jsx
│   │   │
│   │   ├── forgot-password/
│   │   │   └── page.jsx
│   │   │
│   │   ├── reset-password/
│   │   │   └── page.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.jsx
│   │   │
│   │   ├── members/
│   │   ├── rooms/
│   │   ├── water/
│   │   ├── billing/
│   │   ├── payments/
│   │   ├── receipts/
│   │   ├── ledger/
│   │   ├── outstanding/
│   │   ├── expenses/
│   │   ├── electricity/
│   │   ├── drinking-water/
│   │   ├── works/
│   │   ├── cashbook/
│   │   ├── reports/
│   │   ├── emails/
│   │   ├── ai/
│   │   ├── settings/
│   │   ├── layout.jsx
│   │   ├── page.jsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── ForgotPasswordForm.jsx
│   │   │   ├── OtpForm.jsx
│   │   │   ├── ResetPasswordForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── members/
│   │   ├── rooms/
│   │   ├── water/
│   │   ├── billing/
│   │   ├── payments/
│   │   ├── receipts/
│   │   ├── ledger/
│   │   ├── expenses/
│   │   ├── works/
│   │   ├── cashbook/
│   │   ├── reports/
│   │   └── common/
│   │
│   ├── models/
│   │   ├── Admin.js
│   │   ├── PasswordResetOtp.js
│   │   ├── RefreshSession.js
│   │   ├── Society.js
│   │   ├── Room.js
│   │   ├── Member.js
│   │   ├── ChargeMaster.js
│   │   ├── WaterReading.js
│   │   ├── Bill.js
│   │   ├── PenaltyRule.js
│   │   ├── Payment.js
│   │   ├── Receipt.js
│   │   ├── LedgerEntry.js
│   │   ├── FinancialTransaction.js
│   │   ├── ExpenseCategory.js
│   │   ├── Expense.js
│   │   ├── ElectricityBill.js
│   │   ├── DrinkingWaterBill.js
│   │   ├── SocietyWork.js
│   │   ├── EmailLog.js
│   │   ├── AuditLog.js
│   │   └── Counter.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── otpService.js
│   │   ├── tokenService.js
│   │   ├── refreshTokenService.js
│   │   ├── passwordResetService.js
│   │   ├── societyService.js
│   │   ├── roomService.js
│   │   ├── memberService.js
│   │   ├── chargeService.js
│   │   ├── waterService.js
│   │   ├── billingService.js
│   │   ├── penaltyService.js
│   │   ├── paymentService.js
│   │   ├── receiptService.js
│   │   ├── ledgerService.js
│   │   ├── transactionService.js
│   │   ├── expenseService.js
│   │   ├── electricityService.js
│   │   ├── drinkingWaterService.js
│   │   ├── societyWorkService.js
│   │   ├── cashbookService.js
│   │   ├── reportService.js
│   │   ├── emailService.js
│   │   └── auditService.js
│   │
│   ├── lib/
│   │   ├── mongodb.js
│   │   ├── auth.js
│   │   ├── cookies.js
│   │   ├── cron.js
│   │   ├── validation.js
│   │   ├── response.js
│   │   │
│   │   ├── calculations/
│   │   │   ├── water.js
│   │   │   ├── billing.js
│   │   │   ├── penalty.js
│   │   │   ├── outstanding.js
│   │   │   └── balance.js
│   │   │
│   │   ├── accounting/
│   │   │   ├── transaction.js
│   │   │   ├── income.js
│   │   │   ├── expense.js
│   │   │   ├── ledger.js
│   │   │   └── cashbook.js
│   │   │
│   │   ├── numbering/
│   │   │   ├── billNumber.js
│   │   │   └── receiptNumber.js
│   │   │
│   │   ├── pdf/
│   │   │   ├── billPdf.js
│   │   │   ├── receiptPdf.js
│   │   │   └── reportPdf.js
│   │   │
│   │   ├── email/
│   │   │   ├── transporter.js
│   │   │   ├── billEmail.js
│   │   │   ├── receiptEmail.js
│   │   │   ├── reminderEmail.js
│   │   │   └── otpEmail.js
│   │   │
│   │   └── gemini/
│   │       ├── client.js
│   │       └── ocr.js
│   │
│   └── constants/
│       ├── paymentModes.js
│       ├── transactionTypes.js
│       ├── expenseCategories.js
│       ├── workCategories.js
│       └── statuses.js
│
├── .env.local
├── .env.example
├── .gitignore
├── jsconfig.json
├── next.config.mjs
├── postcss.config.mjs
├── package.json
├── package-lock.json
├── vercel.json
└── README.md"# pawan-society" 
