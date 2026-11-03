INSERT INTO "faqs" ("id", "question", "answer", "category", "sort_order", "is_active", "updated_at") VALUES
(
  gen_random_uuid(),
  'How do I check my transfer''s status?',
  'Log in to Wise, go to Home and select the transfer to see where it is. "Your money''s being processed" means Wise is still waiting for the money from the sender''s bank. "Money received" means Wise has it and is converting it. "Transfer sent" means Wise has paid it to the recipient''s bank, which usually delivers it within a few working days, and the tracker may not change again until it arrives. If it has said "being processed" for more than two working days, the sender should check with their bank that the payment left. Wise may also email if it needs more information, and wrong recipient details, weekends and bank holidays can slow things down. The recipient can give their bank the transfer receipt from the transfer''s details to help trace it.',
  'Tracking',
  1,
  true,
  CURRENT_TIMESTAMP
),
(
  gen_random_uuid(),
  'When will my money arrive?',
  'Wise shows an estimated arrival time on the transfer, under Home in the Wise account. The estimate already allows for banking hours, weekends and public holidays in the recipient''s country, and some banks stop processing early on Fridays, so money can land on the next working day. If it says "due today", some banks take a few more hours to show it. Small spelling mistakes in a name usually don''t cause a delay, but a wrong account number can, and Wise will say if the money is sent back. If the recipient can''t find it, they should check for a payment from Wise or one of its partners rather than the sender''s name, and remember their bank may convert the currency. The transfer receipt from the transfer''s details helps their bank trace it.',
  'Arrival',
  2,
  true,
  CURRENT_TIMESTAMP
),
(
  gen_random_uuid(),
  'Why does it say my transfer''s complete when the money hasn''t arrived yet?',
  'Complete means Wise has sent the money to the recipient''s bank. There are two common reasons it isn''t showing yet. First, the recipient''s bank may still be processing it, and some banks take up to one working day to release the money; the recipient can share the transfer receipt with their bank to speed this up. Second, the money may have arrived but look different: it may show as coming from Wise or a banking partner instead of the sender, and if the recipient''s account is in another currency their bank may have converted it, so the amount can look different. A banking partner reference number, if the transfer has one, helps the recipient find it.',
  'Arrival',
  3,
  true,
  CURRENT_TIMESTAMP
),
(
  gen_random_uuid(),
  'Why is my transfer taking longer than the estimate?',
  'A transfer can slow down at three points: the money reaching Wise, Wise checking and processing it, and the recipient''s bank paying it out. Wise sometimes runs extra security checks and will email if it needs something such as ID or proof of where the money came from; these checks can''t be sped up. How the transfer was paid matters too: card payments reach Wise almost straight away, bank transfers take one to four working days, and SWIFT payments take one to six working days. Estimates only count working days, so a transfer sent on a Friday or before a holiday may wait until the next working day. If the recipient''s details were wrong, the bank may send the money back; the activity list will show this, and the details can be fixed or the transfer cancelled, with refunds taking a few days.',
  'Delays',
  4,
  true,
  CURRENT_TIMESTAMP
),
(
  gen_random_uuid(),
  'What is a proof of payment?',
  'A proof of payment is a document from the sender''s bank showing they sent the money to Wise, such as a bank statement PDF or a screenshot from online banking. Wise usually asks for it when a payment hasn''t arrived as expected, or to confirm the money came from an account in the customer''s name, and it emails instructions when it does. It needs to show the customer''s name and account number, their bank''s name or logo, Wise''s name and account number, the payment date, the amount and currency, and the payment reference. Up to five files under 10 MB each are accepted. Text pasted into an email, photos of a screen, photos of a bank card, Wise''s own receipts and password-protected files are not accepted.',
  'Documents',
  5,
  true,
  CURRENT_TIMESTAMP
),
(
  gen_random_uuid(),
  'What''s a banking partner reference number?',
  'Every Wise transfer has a transfer number for talking to Wise support. Some transfers also get a banking partner reference number, because Wise pays money out through local banking partners in each country. Once the transfer shows as complete, the sender can give this number to the recipient, and the recipient can give it to their bank to find the payment. Some banks call it something else; in India, for example, it may be called a UTR or transaction reference number.',
  'References',
  6,
  true,
  CURRENT_TIMESTAMP
);
