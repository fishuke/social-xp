// Coach scenarios: a character says a line, the user answers out loud.
// Three per dread (the onboarding pick), authored natively per locale rather
// than translated word-for-word, so each version sounds like a real person.
// The daily scenario is the same idea worldwide (Wordle-style): index by a
// hash of the user's local date, locale-independent.

import { type Locale } from "./i18n/config";

export type Dread = "interviews" | "dating" | "speaking-up" | "boundaries" | "small-talk";

export type ScenarioText = {
  title: string; // short label for history and share cards
  setup: string; // one sentence of scene-setting
  line: string; // what the character says to you
  sub: string; // what to do with it
};

export type CoachScenario = {
  id: string;
  dread: Dread;
  text: Record<Locale, ScenarioText>;
};

export const SCENARIOS: CoachScenario[] = [
  /* ---------- interviews ---------- */
  {
    id: "interview-tell-me",
    dread: "interviews",
    text: {
      en: {
        title: "The opener",
        setup: "Final-round job interview. The interviewer closes your CV and looks up.",
        line: "So, tell me about yourself.",
        sub: "30 seconds. Confident and human, not a resume recital.",
      },
      tr: {
        title: "Açılış",
        setup: "İş görüşmesinin son turu. Görüşmeci CV'ni kapatıp sana bakıyor.",
        line: "Biraz kendinizden bahseder misiniz?",
        sub: "30 saniye. Özgeçmiş ezberi değil, kendinden emin ve doğal.",
      },
    },
  },
  {
    id: "interview-weakness",
    dread: "interviews",
    text: {
      en: {
        title: "The weakness question",
        setup: "The interview is going well. Then comes the classic.",
        line: "What would you say is your biggest weakness?",
        sub: "Honest without self-destructing. One real weakness, one real fix.",
      },
      tr: {
        title: "Zayıf yön sorusu",
        setup: "Görüşme iyi gidiyor. Derken o klasik soru geliyor.",
        line: "Sizce en zayıf yönünüz nedir?",
        sub: "Kendini yerin dibine sokmadan dürüst ol. Bir gerçek zayıflık, bir gerçek çözüm.",
      },
    },
  },
  {
    id: "interview-why-you",
    dread: "interviews",
    text: {
      en: {
        title: "The closer",
        setup: "End of the interview. They put the pen down.",
        line: "Why should we pick you over the other candidates?",
        sub: "Sell yourself without apologizing for it. 30 seconds.",
      },
      tr: {
        title: "Kapanış",
        setup: "Görüşmenin sonu. Kalemi masaya bırakıyor.",
        line: "Neden diğer adaylar yerine sizi seçelim?",
        sub: "Özür diler gibi değil, sahiplenerek anlat. 30 saniye.",
      },
    },
  },

  /* ---------- dating ---------- */
  {
    id: "date-first-minute",
    dread: "dating",
    text: {
      en: {
        title: "The first minute",
        setup: "First date. You both just sat down and ordered.",
        line: "So... how's your week been?",
        sub: "Warm and real. Give them something to grab onto, then ask back.",
      },
      tr: {
        title: "İlk dakika",
        setup: "İlk buluşma. Daha yeni oturdunuz, siparişler verildi.",
        line: "Ee... haftan nasıl geçti?",
        sub: "Sıcak ve gerçek ol. Tutunacak bir şey ver, sonra sen sor.",
      },
    },
  },
  {
    id: "date-not-on-profile",
    dread: "dating",
    text: {
      en: {
        title: "Off script",
        setup: "The date is warming up. They lean in, curious.",
        line: "Tell me something about you that's not on your profile.",
        sub: "One true thing with a little color. Skip the humble brag.",
      },
      tr: {
        title: "Senaryo dışı",
        setup: "Buluşma ısınıyor. Merakla sana doğru eğiliyor.",
        line: "Bana profilinde yazmayan bir şeyini anlat.",
        sub: "Renkli tek bir gerçek yeter. Gizli övünme yok.",
      },
    },
  },
  {
    id: "date-your-turn",
    dread: "dating",
    text: {
      en: {
        title: "Your turn",
        setup: "They just told a good story and take a sip.",
        line: "Okay, your turn. Ask me anything.",
        sub: "One question you actually care about, and say why you're asking.",
      },
      tr: {
        title: "Sıra sende",
        setup: "Güzel bir hikaye anlattı, şimdi içeceğinden bir yudum alıyor.",
        line: "Tamam, sıra sende. Bana istediğini sor.",
        sub: "Gerçekten merak ettiğin bir soru sor ve neden sorduğunu söyle.",
      },
    },
  },

  /* ---------- speaking-up ---------- */
  {
    id: "meeting-doubt",
    dread: "speaking-up",
    text: {
      en: {
        title: "The hole in the plan",
        setup: "Team meeting. Everyone likes a plan you think has a hole in it. The lead turns to you.",
        line: "Any thoughts before we lock this in?",
        sub: "Name the risk clearly without torching the plan or the room.",
      },
      tr: {
        title: "Plandaki açık",
        setup: "Ekip toplantısı. Sence açığı olan bir planı herkes beğenmiş. Lider sana dönüyor.",
        line: "Kilitlemeden önce eklemek istediğin bir şey var mı?",
        sub: "Planı da ortamı da yakmadan riski net söyle.",
      },
    },
  },
  {
    id: "meeting-intro",
    dread: "speaking-up",
    text: {
      en: {
        title: "The new one",
        setup: "First day. Everyone around the table has introduced themselves. Now it's you.",
        line: "And you? Tell us a bit about yourself.",
        sub: "30 seconds. Who you are, what you do, one human detail.",
      },
      tr: {
        title: "Yeni gelen",
        setup: "İlk günün. Masadaki herkes kendini tanıttı. Sıra sende.",
        line: "Ya sen? Biraz kendinden bahset.",
        sub: "30 saniye. Kimsin, ne yapıyorsun, bir de insani bir detay.",
      },
    },
  },
  {
    id: "meeting-your-idea",
    dread: "speaking-up",
    text: {
      en: {
        title: "Floor is yours",
        setup: "You mentioned an idea in the chat. The manager stops the meeting.",
        line: "That's interesting. Walk us through it.",
        sub: "Structure it: the problem, your idea, why it works. 30 seconds.",
      },
      tr: {
        title: "Söz sende",
        setup: "Yazışmada bir fikirden bahsetmiştin. Yönetici toplantıyı durduruyor.",
        line: "İlginç. Bize baştan anlatır mısın?",
        sub: "Sırayla: sorun, fikrin, neden işe yarar. 30 saniye.",
      },
    },
  },

  /* ---------- boundaries ---------- */
  {
    id: "no-car",
    dread: "boundaries",
    text: {
      en: {
        title: "The favor",
        setup: "A friend wants to borrow your car for the weekend. Again. You've decided it's a no.",
        line: "Come on, you'd be saving my life. It's just two days.",
        sub: "Say no, stay warm, skip the essay.",
      },
      tr: {
        title: "Ricacı",
        setup: "Bir arkadaşın hafta sonu için arabanı istiyor. Yine. Kararın hayır.",
        line: "Hadi ama, hayatımı kurtarırsın. Topu topu iki gün.",
        sub: "Hayır de, sıcak kal, uzun savunmaya girme.",
      },
    },
  },
  {
    id: "no-tonight",
    dread: "boundaries",
    text: {
      en: {
        title: "The push",
        setup: "You're staying in tonight. Your friend keeps pushing.",
        line: "Just come for an hour, everyone's asking about you.",
        sub: "Decline without a fake excuse. A warm no is a full sentence.",
      },
      tr: {
        title: "Israr",
        setup: "Bu akşam evdesin. Arkadaşın bastırıyor.",
        line: "Bir saatliğine gel işte, herkes seni soruyor.",
        sub: "Sahte bahane yok. Gülümseyerek söylenen hayır da tam bir cümledir.",
      },
    },
  },
  {
    id: "roommate-dishes",
    dread: "boundaries",
    text: {
      en: {
        title: "Holding the line",
        setup: "You asked your roommate to handle their dishes. It's day three of the same pile.",
        line: "Relax, it's just a few dishes. I'll get to them.",
        sub: "Hold the line without a fight. Say what you need and by when.",
      },
      tr: {
        title: "Çizgiyi korumak",
        setup: "Ev arkadaşından bulaşıklarını halletmesini istedin. Aynı yığının üçüncü günü.",
        line: "Sakin ol ya, üç beş tabak işte. Hallederim.",
        sub: "Kavga etmeden çizgini koru. Ne istediğini ve ne zamana istediğini söyle.",
      },
    },
  },

  /* ---------- small-talk ---------- */
  {
    id: "elevator-neighbor",
    dread: "small-talk",
    text: {
      en: {
        title: "The elevator",
        setup: "Elevator doors close. It's the neighbor you half-know.",
        line: "Oh hey! You're on the fourth floor, right?",
        sub: "30 seconds of easy warmth. No life story required.",
      },
      tr: {
        title: "Asansör",
        setup: "Asansör kapıları kapanıyor. İçeride yarım yamalak tanıdığın komşu.",
        line: "Aa merhaba! Siz dördüncü kattaydınız, değil mi?",
        sub: "30 saniyelik kolay bir sıcaklık. Hayat hikayesi gerekmez.",
      },
    },
  },
  {
    id: "party-host",
    dread: "small-talk",
    text: {
      en: {
        title: "The party",
        setup: "House party. You know exactly one person here, and they vanished. Someone lands next to you.",
        line: "So, how do you know the host?",
        sub: "Answer, add one detail, ask back. That's the whole engine.",
      },
      tr: {
        title: "Parti",
        setup: "Ev partisi. Tanıdığın tek kişi ortadan kayboldu. Biri yanına geliyor.",
        line: "Ee, ev sahibini nereden tanıyorsun?",
        sub: "Cevapla, bir detay ekle, karşı soruyu sor. Motorun tamamı bu.",
      },
    },
  },
  {
    id: "coffee-line",
    dread: "small-talk",
    text: {
      en: {
        title: "The regular",
        setup: "The barista knows your order by now. Today the line is short and they're chatty.",
        line: "Busy day, or are you the calm kind?",
        sub: "Match the energy, keep it light, leave both of you smiling.",
      },
      tr: {
        title: "Müdavim",
        setup: "Barista artık siparişini ezbere biliyor. Bugün sıra kısa ve keyfi yerinde.",
        line: "Yoğun bir gün mü, yoksa sakinlerden misin?",
        sub: "Enerjiyi yakala, hafif tut, ikiniz de gülümseyerek ayrılın.",
      },
    },
  },
];

/** Same date, same scenario, everywhere in the world (Wordle-style). */
export function dailyScenario(localDate: string): CoachScenario {
  let seed = 0;
  for (const c of localDate) seed = (seed * 31 + c.charCodeAt(0)) % 997;
  return SCENARIOS[seed % SCENARIOS.length];
}

export function scenarioById(id: string): CoachScenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}
