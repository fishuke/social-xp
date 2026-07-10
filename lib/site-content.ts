// Single source of truth for the method / privacy / terms content. Rendered
// by components/content-page.tsx in both chromes: marketing web layout for
// visitors, phone-frame app layout for signed-in users (app/[lang]/(site)/layout.tsx).
// Prose is keyed by locale; the page chrome (kicker/title/intro) lives in the
// i18n dictionary.

import type { Locale } from "./i18n/config";

// TODO: switch to the real support address once the production domain lands
// (docs/BACKLOG.md, "Domain + production launch").
export const SUPPORT_EMAIL = "support@social-xp.app";

export const LEGAL_UPDATED: Record<Locale, string> = {
  en: "July 7, 2026",
  tr: "7 Temmuz 2026",
};

export type ContentSection = { emoji?: string; title: string; body: string };

export const METHOD_SECTIONS: Record<Locale, ContentSection[]> = {
  en: [
    {
      emoji: "🔁",
      title: "Behavioral Skills Training",
      body: "The best-validated way to teach social skills: instruction → modeling → rehearsal → feedback. It's why every lesson shows you the move, quizzes you on it, then sends you out to try it for real.",
    },
    {
      emoji: "🌍",
      title: "Real-world practice",
      body: "Decades of CBT research agree: practice between sessions is what actually changes behavior. The daily challenge isn't a bonus, it's the whole point. The lesson just loads the move.",
    },
    {
      emoji: "🧠",
      title: "Thought work, not just behavior",
      body: "Straight from CBT's cognitive side: every lesson includes a “challenge the thought” step: catch the anxious prediction (“they'll think I'm weird”), name the distortion, answer it with the balanced take. Confidence needs both the reframe and the rep.",
    },
    {
      emoji: "📶",
      title: "Graded courage",
      body: "Confidence is built like exposure therapy builds it: starting small, stepping up gradually, and collecting evidence that the scary thing was survivable. Levels A1 → A2 → B1 follow that ladder.",
    },
    {
      emoji: "🧩",
      title: "Spaced practice & retrieval",
      body: "Quizzes make you retrieve, not re-read: the single most reliable memory effect in learning science. Streaks and daily quests apply habit research: small, visible, daily beats big and rare.",
    },
    {
      emoji: "🔭",
      title: "Reviewed and re-tuned",
      body: "We're building an expert board of psychologists and social scientists to review every unit, and we re-tune lessons continuously from real learner results.",
    },
  ],
  tr: [
    {
      emoji: "🔁",
      title: "Davranışsal Beceri Eğitimi",
      body: "Sosyal beceri öğretmenin en iyi kanıtlanmış yolu: anlatım → gösterim → prova → geri bildirim. Her ders sana önce hamleyi gösterir, sonra bunu soruyla pekiştirir, ardından gerçek hayatta denemen için dışarı yollar.",
    },
    {
      emoji: "🌍",
      title: "Gerçek hayatta pratik",
      body: "Onlarca yıllık BDT araştırması hemfikir: davranışı asıl değiştiren şey seanslar arasındaki pratiktir. Günlük görev bir ekstra değil, işin ta kendisi. Ders sadece hamleyi yükler.",
    },
    {
      emoji: "🧠",
      title: "Sadece davranış değil, düşünce çalışması",
      body: "Doğrudan BDT'nin bilişsel tarafından: her derste bir “düşünceye meydan oku” adımı var: kaygılı tahmini yakala (“tuhaf olduğumu düşünecekler”), çarpıtmayı adlandır, dengeli bakışla cevap ver. Özgüven hem yeniden çerçevelemeye hem de tekrara ihtiyaç duyar.",
    },
    {
      emoji: "📶",
      title: "Kademeli cesaret",
      body: "Özgüven, maruz bırakma terapisinin inşa ettiği gibi inşa edilir: küçük başla, kademe kademe yüksel ve o korkutucu şeyin atlatılabilir olduğuna dair kanıt topla. A1 → A2 → B1 seviyeleri bu merdiveni izler.",
    },
    {
      emoji: "🧩",
      title: "Aralıklı pratik ve hatırlama",
      body: "Sorular seni yeniden okumaya değil hatırlamaya zorlar: öğrenme biliminin en güvenilir hafıza etkisi budur. Seriler ve günlük görevler alışkanlık araştırmasını uygular: küçük, görünür ve günlük olan, büyük ve seyrek olanı yener.",
    },
    {
      emoji: "🔭",
      title: "Gözden geçirilir ve yeniden ayarlanır",
      body: "Her üniteyi incelemesi için psikologlar ve sosyal bilimcilerden oluşan bir uzman kurulu oluşturuyoruz ve dersleri gerçek öğrenci sonuçlarına göre sürekli yeniden ayarlıyoruz.",
    },
  ],
};

export const PRIVACY_SECTIONS: Record<Locale, ContentSection[]> = {
  en: [
    {
      title: "What we collect",
      body: "Your progress: XP, streaks, completed lessons, quiz results, saved quotes, and how a lesson felt. If you create an account, also your email address and a securely hashed password. During onboarding we ask for your goal, pace, and timezone so daily resets happen on your calendar day. Everything works without an account; progress is then tied to an anonymous ID stored in a cookie on your device.",
    },
    {
      title: "Voice recordings",
      body: "Coach recordings are sent to Google's Gemini API for analysis and are not stored by us. We keep only the written transcript and the scores so you can see your progress. Don't say anything in a rep you wouldn't want written down.",
    },
    {
      title: "Payments",
      body: "Subscriptions are sold through Lemon Squeezy, our merchant of record. They are the legal seller and handle your payment details; we never see your card number. We store your subscription status (plan, renewal date) to unlock premium features.",
    },
    {
      title: "Notifications",
      body: "If you turn on daily reminders, we store a push subscription for your browser or device. Turn it off any time on the You page, or revoke the permission in your browser.",
    },
    {
      title: "Cookies",
      body: "We use cookies only to keep you signed in and to remember anonymous progress. No advertising cookies, no third-party trackers, no selling data. Ever.",
    },
    {
      title: "Who processes data for us",
      body: "Vercel (hosting), Neon (database), Resend (transactional email like password resets), Google Gemini (voice analysis), and Lemon Squeezy (payments). Each receives only what it needs to do its job.",
    },
    {
      title: "Your choices",
      body: `You can use Social XP without an account, opt out of reminders, and cancel your subscription any time. To access or delete your data, email ${SUPPORT_EMAIL} and we'll handle it within 30 days.`,
    },
  ],
  tr: [
    {
      title: "Neleri topluyoruz",
      body: "İlerlemen: XP, seriler, tamamlanan dersler, soru sonuçları, kaydedilen sözler ve bir dersin nasıl hissettirdiği. Hesap oluşturursan ayrıca e-posta adresin ve güvenli biçimde saklanan (hash'lenmiş) şifren. İlk kurulumda günlük sıfırlamalar senin takvim gününde olsun diye hedefini, temponu ve saat dilimini soruyoruz. Her şey hesapsız da çalışır; bu durumda ilerleme cihazındaki bir çerezde tutulan anonim bir kimliğe bağlanır.",
    },
    {
      title: "Ses kayıtları",
      body: "Koç kayıtları analiz için Google'ın Gemini API'sine gönderilir ve bizde saklanmaz. İlerlemeni görebilmen için yalnızca yazılı dökümü ve puanları tutarız. Bir tekrarda, yazıya dökülmesini istemeyeceğin hiçbir şeyi söyleme.",
    },
    {
      title: "Ödemeler",
      body: "Abonelikler, kayıtlı satıcımız Lemon Squeezy üzerinden satılır. Yasal satıcı onlardır ve ödeme bilgilerini onlar yönetir; kart numaranı asla görmeyiz. Premium özellikleri açmak için abonelik durumunu (plan, yenileme tarihi) saklarız.",
    },
    {
      title: "Bildirimler",
      body: "Günlük hatırlatıcıları açarsan tarayıcın veya cihazın için bir push aboneliği saklarız. İstediğin zaman Sen sayfasından kapat ya da izni tarayıcından geri al.",
    },
    {
      title: "Çerezler",
      body: "Çerezleri yalnızca seni oturumda tutmak ve anonim ilerlemeni hatırlamak için kullanırız. Reklam çerezi yok, üçüncü taraf takipçi yok, veri satışı yok. Asla.",
    },
    {
      title: "Bizim için veriyi kimler işler",
      body: "Vercel (barındırma), Neon (veritabanı), Resend (şifre sıfırlama gibi işlem e-postaları), Google Gemini (ses analizi) ve Lemon Squeezy (ödemeler). Her biri yalnızca işini yapmak için gerekeni alır.",
    },
    {
      title: "Senin seçeneklerin",
      body: `Social XP'yi hesapsız kullanabilir, hatırlatıcıları kapatabilir ve aboneliğini istediğin zaman iptal edebilirsin. Verilerine erişmek veya onları silmek için ${SUPPORT_EMAIL} adresine yaz, 30 gün içinde hallederiz.`,
    },
  ],
};

export const TERMS_SECTIONS: Record<Locale, ContentSection[]> = {
  en: [
    {
      title: "The service",
      body: "Social XP is a training app for social confidence: short lessons, quizzes, real-world challenges, and an AI speaking coach. You need to be at least 13 to use it (or the minimum age in your country), and under 18 you'll need a parent or guardian's OK.",
    },
    {
      title: "Not therapy",
      body: "Social XP builds confidence through practice. It is not therapy, medical care, or mental-health treatment, and it doesn't replace them. If you're struggling, please reach out to a qualified professional.",
    },
    {
      title: "Your account",
      body: "You can train anonymously; creating an account keeps your progress safe across devices. You're responsible for keeping your password to yourself. Anonymous progress lives in a cookie and can be lost if you clear it, so claim your account if your streak matters to you.",
    },
    {
      title: "Subscriptions & billing",
      body: `Social XP+ is sold through Lemon Squeezy, our merchant of record and the legal seller. Plans start with a 7-day free trial, then renew automatically (monthly or yearly) until you cancel. Cancel any time from Manage subscription on the You page; you keep access until the end of the period you paid for. Refund requests go through Lemon Squeezy or ${SUPPORT_EMAIL}.`,
    },
    {
      title: "Fair use",
      body: "Don't abuse the service: no breaking in, scraping, reselling, reverse engineering, or using the coach to process other people's voices without their consent. We can suspend accounts that do.",
    },
    {
      title: "Our content",
      body: "Lessons, quotes curation, and app design belong to Social XP. They're licensed to you for personal use, not for republishing or building competing courses.",
    },
    {
      title: "No guarantees",
      body: "We work hard to keep Social XP up and improving, but it's provided as is, without warranties. To the extent the law allows, our liability is limited to what you paid us in the last 12 months.",
    },
    {
      title: "Changes",
      body: "We may update these terms as the product evolves. If a change is significant we'll flag it in the app. Continuing to train after a change means you accept it.",
    },
  ],
  tr: [
    {
      title: "Hizmet",
      body: "Social XP sosyal özgüven için bir antrenman uygulamasıdır: kısa dersler, sorular, gerçek hayat görevleri ve bir yapay zeka konuşma koçu. Kullanmak için en az 13 yaşında olman gerekir (ya da ülkendeki asgari yaş) ve 18 yaşından küçüksen bir ebeveyn ya da vasinin onayı gerekir.",
    },
    {
      title: "Terapi değildir",
      body: "Social XP özgüveni pratikle inşa eder. Terapi, tıbbi bakım ya da ruh sağlığı tedavisi değildir ve bunların yerini tutmaz. Zorlanıyorsan lütfen nitelikli bir uzmana başvur.",
    },
    {
      title: "Hesabın",
      body: "Anonim olarak antrenman yapabilirsin; hesap oluşturmak ilerlemeni cihazlar arasında güvende tutar. Şifreni yalnızca kendine saklamaktan sen sorumlusun. Anonim ilerleme bir çerezde durur ve çerezi temizlersen kaybolabilir; o yüzden serin senin için önemliyse hesabını sahiplen.",
    },
    {
      title: "Abonelikler ve faturalandırma",
      body: `Social XP+, kayıtlı satıcımız ve yasal satıcı olan Lemon Squeezy üzerinden satılır. Planlar 7 günlük ücretsiz denemeyle başlar, sonra sen iptal edene kadar otomatik yenilenir (aylık veya yıllık). Sen sayfasındaki Aboneliği yönet üzerinden istediğin zaman iptal et; ödediğin dönemin sonuna kadar erişimin sürer. İade talepleri Lemon Squeezy ya da ${SUPPORT_EMAIL} üzerinden yürür.`,
    },
    {
      title: "Adil kullanım",
      body: "Hizmeti kötüye kullanma: sisteme izinsiz girme, veri kazıma, yeniden satma, tersine mühendislik ya da koçu başkalarının sesini rızaları olmadan işlemek için kullanma yok. Bunları yapan hesapları askıya alabiliriz.",
    },
    {
      title: "İçeriğimiz",
      body: "Dersler, söz derlemesi ve uygulama tasarımı Social XP'ye aittir. Bunlar sana kişisel kullanım için lisanslanır; yeniden yayımlamak ya da rakip kurslar oluşturmak için değil.",
    },
    {
      title: "Garanti yok",
      body: "Social XP'yi ayakta ve gelişiyor tutmak için çok çalışıyoruz, ama hizmet olduğu gibi, garantisiz sunulur. Yasanın izin verdiği ölçüde sorumluluğumuz, son 12 ayda bize ödediğin tutarla sınırlıdır.",
    },
    {
      title: "Değişiklikler",
      body: "Ürün geliştikçe bu şartları güncelleyebiliriz. Bir değişiklik önemliyse uygulamada belirtiriz. Bir değişiklikten sonra antrenmana devam etmen, onu kabul ettiğin anlamına gelir.",
    },
  ],
};
