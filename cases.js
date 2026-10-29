window.CYBERTRACE_CASES = [
  {
    id:1, title:'The scholarship that looked too good', channel:'EMAIL', difficulty:'BEGINNER', type:'Scholarship phishing', answer:'suspicious',
    sender:'Student Awards <awards@scholarship-verify.example>', recipient:'student@school.example', subject:'Congratulations! Your education grant is approved', brand:'STUDENT AWARDS NETWORK', greeting:"You've been selected!", intro:'We are delighted to inform you that you have been selected for a special education grant.',
    parts:[
      {text:'URGENT: You must confirm your eligibility within the next 30 minutes or your offer will expire.', title:'Artificial urgency', description:'A short deadline pressures you to act before checking whether the offer is genuine.'},
      {text:'Requested: account password + one-time verification code', title:'Credential theft request', description:'Passwords and one-time codes must never be disclosed to claim a grant.'},
      {text:'Verify My Award — https://claim-award.example/verify', title:'Untrusted verification link', description:'The destination is not independently verified. Navigate to a trusted official site instead.'}
    ],
    note:'Fictional scholarship email. Example domains are reserved for demonstrations.'
  },
  {
    id:2, title:'The parcel held for a small fee', channel:'SMS', difficulty:'BEGINNER', type:'Delivery-fee smishing', answer:'suspicious',
    sender:'Unknown sender <+91 90000 12345>', recipient:'Your phone', subject:'Parcel delivery failed — action required', brand:'PARCEL DELIVERY NOTICE', greeting:'Your parcel is waiting', intro:'A text says a delivery is on hold, although you are not expecting a parcel.',
    parts:[
      {text:'Your parcel is held at the depot.', title:'Unverified delivery claim', description:'The message gives no trustworthy order context and you were not expecting a parcel.'},
      {text:'Pay ₹25 within 20 minutes to release it.', title:'Small unexpected fee + urgency', description:'A small fee and deadline can be used to make a payment link feel harmless.'},
      {text:'Track and pay: https://parcel-track-prize.example/pay', title:'Unfamiliar payment link', description:'Do not use a link from an unexpected text; check orders through the carrier’s official app or site.'}
    ], note:'Fictional SMS scenario. Do not enter payment details into a message link.'
  },
  {
    id:3, title:'A timetable update from the school portal', channel:'SCHOOL PORTAL', difficulty:'BEGINNER', type:'Legitimate notice / context verification', answer:'legitimate',
    sender:'School Portal <notices@portal.school.example>', recipient:'Class 10 students', subject:'Updated Friday timetable', brand:'SCHOOL PORTAL NOTICE', greeting:'Timetable update', intro:'You open the school portal by typing its known address yourself. The notice matches one your teacher posted in the usual class channel.',
    parts:[
      {text:'Opened from the school address you typed yourself.', title:'Trusted route to the portal', description:'Navigating independently reduces the risk of following a spoofed link.'},
      {text:'The same change was posted by your teacher in the usual class channel.', title:'Independent confirmation', description:'A separate trusted channel corroborates the notice. Context matters more than branding alone.'},
      {text:'The notice asks you only to review the timetable; no password, OTP or payment is requested.', title:'No unusual sensitive request', description:'The request fits the purpose of a timetable notice and does not ask for secrets or money.'}
    ], note:'A training example of a likely legitimate notice. Still check dates and details.'
  },
  {
    id:4, title:'The account suspension threat', channel:'EMAIL', difficulty:'INTERMEDIATE', type:'Account takeover phishing', answer:'suspicious',
    sender:'Account Support <security-alert@account-check.example>', recipient:'user@school.example', subject:'Your account will be deleted', brand:'ACCOUNT SECURITY ALERT', greeting:'Immediate action required', intro:'A message claims that your account will be permanently disabled unless you respond immediately.',
    parts:[
      {text:'Your account will be deleted in 10 minutes.', title:'Threat and extreme urgency', description:'Threatening account loss is a common pressure tactic intended to stop careful checking.'},
      {text:'Reply with your current password to prevent suspension.', title:'Password disclosure request', description:'Legitimate support teams should not ask you to send your password in a reply.'},
      {text:'Sender domain: account-check.example — not the service’s usual domain.', title:'Mismatched sender domain', description:'The visible sender does not establish that the message came from the service.'}
    ], note:'Fictional account-security message. Open the official app or type the known address yourself.'
  },
  {
    id:5, title:'Competition registration confirmation', channel:'EMAIL', difficulty:'INTERMEDIATE', type:'Legitimate event confirmation', answer:'legitimate',
    sender:'School Events <events@school.example>', recipient:'Registered participant', subject:'Coding competition — registration confirmed', brand:'SCHOOL EVENTS', greeting:'You are registered', intro:'You registered for a school coding event yesterday. This confirmation matches the school notice and asks you to check event timings on the school portal.',
    parts:[
      {text:'You registered for this event yesterday.', title:'Expected context', description:'The message follows an action you actually took, which supports—but does not prove—legitimacy.'},
      {text:'The sender domain matches the one printed on the school notice.', title:'Consistent sender details', description:'Sender information is consistent with a trusted notice; check the full address when uncertain.'},
      {text:'Review timings on the school portal. No fee, password or OTP is requested.', title:'Proportionate request', description:'The request fits the event and points to a known portal without demanding secrets or unexpected payment.'}
    ], note:'Fictional confirmation. A familiar name or logo alone is never enough to prove authenticity.'
  },
  {
    id:6, title:'The prize you never entered to win', channel:'DIRECT MESSAGE', difficulty:'INTERMEDIATE', type:'Prize / advance-fee scam', answer:'suspicious',
    sender:'Lucky Rewards <winner@claim-reward.example>', recipient:'Your social account', subject:'You have won a new phone!', brand:'LUCKY REWARDS', greeting:'Congratulations, winner!', intro:'A direct message says you won an expensive phone, although you never entered a contest.',
    parts:[
      {text:'You won a new phone — no entry details are provided.', title:'Unexpected prize claim', description:'An unrequested prize without verifiable entry details should be treated cautiously.'},
      {text:'Send your home address and a refundable processing fee.', title:'Personal data + advance fee', description:'Scammers may collect personal information and money before delivering a prize that does not exist.'},
      {text:'Claim within one hour using this unfamiliar link.', title:'Deadline and untrusted link', description:'The time pressure discourages verification. Do not pay or follow the claim link.'}
    ], note:'Fictional prize message. Never pay an unexpected fee to unlock a prize.'
  },
  {
    id:7, title:'The bank alert asking for an OTP', channel:'SMS', difficulty:'ADVANCED', type:'Bank impersonation / OTP theft', answer:'suspicious',
    sender:'BANK-SECURITY (unverified SMS sender)', recipient:'Your phone', subject:'Suspicious activity detected', brand:'BANK SECURITY ALERT', greeting:'Protect your account now', intro:'A text claims there is suspicious activity and directs you to contact a number included in the message.',
    parts:[
      {text:'Suspicious activity detected — call the number in this text immediately.', title:'Unverified callback number', description:'A number supplied in an unexpected alert may connect you to an impersonator.'},
      {text:'Read us the one-time password (OTP) to secure your account.', title:'OTP harvesting', description:'Never disclose an OTP to a caller or message sender, even if they claim to be bank staff.'},
      {text:'The message gives no transaction details and asks you not to use the app.', title:'Pressure away from official channels', description:'Avoid instructions that steer you away from the bank’s official app or independently verified number.'}
    ], note:'Fictional banking scenario. Contact your bank using its official app or the number on your card.'
  },
  {
    id:8, title:'The shared class project document', channel:'COLLABORATION APP', difficulty:'ADVANCED', type:'Contextual document share', answer:'legitimate',
    sender:'Your project partner <classmate@workspace.school.example>', recipient:'Project team workspace', subject:'Updated science project draft', brand:'CLASS WORKSPACE', greeting:'Draft for our project', intro:'You were expecting a document from your project partner. It appears in the usual class workspace and the title matches your current project.',
    parts:[
      {text:'The share appears inside the class workspace you normally use.', title:'Expected platform and location', description:'The known workspace supports the context, though accounts can still be compromised.'},
      {text:'The title matches the science project you are currently working on.', title:'Relevant document context', description:'A relevant title is consistent with the task but should not be treated as proof on its own.'},
      {text:'No password, OTP, payment or unusual permission is requested.', title:'No suspicious demand detected', description:'The share does not request secrets or money. If the sender’s behaviour seems unusual, confirm separately.'}
    ], note:'Likely legitimate in this scenario. A familiar account can still be compromised; verify unusual requests.'
  },
  {
    id:9, title:'The job offer that charges you first', channel:'EMAIL', difficulty:'ADVANCED', type:'Employment scam / upfront fee', answer:'suspicious',
    sender:'Remote Hiring Team <jobs@quick-hire-career.example>', recipient:'Applicant', subject:'You are hired — buy your starter kit', brand:'REMOTE CAREERS', greeting:'Welcome to the team', intro:'An email offers a remote job without a credible interview or hiring process.',
    parts:[
      {text:'You are hired without an interview or verifiable hiring process.', title:'Implausible hiring process', description:'A job offer without credible screening or verifiable employer details warrants independent research.'},
      {text:'Buy our starter kit today to activate your role.', title:'Upfront payment demand', description:'Legitimate employers generally do not require applicants to pay an unexplained fee to receive a job.'},
      {text:'Send identity documents to a free, unrelated email address.', title:'Sensitive identity data request', description:'Identity documents can be misused. Verify the employer and vacancy independently before sharing any data.'}
    ], note:'Fictional employment scam. Research the company using independently found contact details.'
  },
  {
    id:10, title:'The password reset you actually requested', channel:'EMAIL', difficulty:'ADVANCED', type:'Legitimate account recovery', answer:'legitimate',
    sender:'Account Service <no-reply@accounts.service.example>', recipient:'Your registered email', subject:'Your requested password reset', brand:'ACCOUNT RECOVERY', greeting:'Reset your password', intro:'You just selected “Forgot password” after typing the service address yourself. A reset email arrives from its expected domain.',
    parts:[
      {text:'You initiated the password reset moments ago.', title:'User-initiated action', description:'The message matches an action you started, which supports the expected context.'},
      {text:'The sender domain matches the service address you used.', title:'Consistent sender domain', description:'The sender appears consistent with the service, but verify the complete address if anything looks unusual.'},
      {text:'The email directs you to reset your password; it does not ask you to reply with your current password or OTP.', title:'Expected recovery flow', description:'A reset flow should not ask you to send secrets in a reply. If you did not request it, ignore the link and review security directly.'}
    ], note:'Likely legitimate in this scenario. If you did not request a reset, do not click; review account security independently.'
  }
];