// Turkish translations of the learning content. Mirrors prisma/seed.ts exactly
// in structure: same units, lessons, step order/kinds, option counts, and
// correctIndex. Style: no em-dashes anywhere; warm, idiomatic Turkish.

import type { Challenge, LessonStep } from "../lib/content";

type SeedLesson = { index: number; title: string; isCheckpoint?: boolean; steps: LessonStep[]; challenge: Challenge };

const c = (headline: string, body: string, keyPhrase: string, coachLine?: string): LessonStep => ({ type: "concept", headline, body, keyPhrase, coachLine });
const q = (theySay: string, question: string, options: string[], correctIndex: number, feedbackTitle: string, feedbackBody: string): LessonStep => ({ type: "quiz", voice: "them", theySay, question, options, correctIndex, feedbackTitle, feedbackBody });
const r = (thought: string, question: string, options: string[], correctIndex: number, feedbackTitle: string, feedbackBody: string): LessonStep => ({ type: "quiz", voice: "inner", theySay: thought, question, options, correctIndex, feedbackTitle, feedbackBody });

/* ================= ÜNİTE 1 · İlk Temas ================= */

const unit1Lessons: SeedLesson[] = [
  {
    index: 1,
    title: "Önce sen selam ver",
    steps: [
      c(
        "İşin sırrı önce davranmakta.",
        "Neredeyse herkes karşısındakinin yaklaşmasını bekler ve neredeyse herkes biri önce davrandığında rahat bir nefes alır. Bütün mesele önce davranmak. Zekice olması gerekmez, sadece var olması yeter.",
        "Bütün mesele önce davranmak",
        "“Bir selam yeterli. Bütün olay bu.”"
      ),
      q(
        "İçeri giriyorsun ve ekibinden biri telefonunda takılarak zaten orada duruyor.",
        "Kazandıran hamle ne?",
        [
          "Ufacık bile olsa önce sen selam ver.",
          "Bekle. Konuşmak isterse başını kaldırır.",
          "Önce güzel bir açılış cümlesi düşün, bulunca yanına git.",
          "Boş ver, sonra mesaj atarsın. Herkes için daha rahat olur.",
        ],
        0,
        "ÖNCE SEN, KAZANDIN",
        "Beklemek, mükemmel açılışı hazırlamak, sonra mesaj atmak: üçü de plan kılığına girmiş oyalanmalar. İki saniyelik bir “selam” zaten bütün mesele."
      ),
      c(
        "Çıtayı düşür.",
        "Bir selamın arkasından gelecek bir plana ihtiyacı yok. Zeka yok, açılış cümlesi yok, hedef yok. Sadece göz teması, ufak bir gülümseme, tek kelime. Fazlası zaten armağan.",
        "göz teması, ufak bir gülümseme, tek kelime"
      ),
      r(
        "Selam versem ve zar zor karşılık verse, aptal durumuna düşerim.",
        "O düşünceye karşılık ver:",
        [
          "Doğru. Sessiz ve güvende kalmak daha iyi.",
          "Sadece bana önce selam verenlere selam veririm. Böylece kaybetmem.",
          "Soğuk bir karşılık onun meşgul olduğunu söyler, benim başarısız olduğumu değil. Kimse gece yarısı benim selamımı kafasında tekrar oynatmıyor.",
        ],
        2,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu, zihin okuma artı felaketleştirme. En kötü gerçekçi ihtimal: nötr bir baş sallama. Atlatılır, unutulur ve yine de tamamlanmış bir selam sayılır."
      ),
      c(
        "Bugünkü hamlen.",
        "Biri sana selam vermeden önce sen bir kişiye selam ver. Cesur olan kısım önce davranmak ve “selam”dan fazlasına ihtiyacın yok. Kazanç önce davranmakta, sonrasında ne olduğunda değil.",
        "Kazanç önce davranmakta"
      ),
    ],
    challenge: {
      text: "Bugün bir kişi sana selam vermeden önce sen selam ver.",
      sub: "Barista, komşu, iş arkadaşı. Göz teması, gülümseme, “selam”. Hepsi bu.",
    },
  },
  {
    index: 2,
    title: "Selamı ortama uydur",
    steps: [
      c(
        "Ortamı oku.",
        "Bir selamın bir boyutu vardır: koridorda baş selamı, sokağın karşısından el sallamak, tanıştırıldığında tokalaşmak. Ortama uydurmak, sıcaklığı sonuna kadar açmaktan daha iyidir.",
        "Ortama uydurmak, sıcaklığı sonuna kadar açmaktan daha iyidir",
        "“Kararsız kaldığında bir beden küçük seç.”"
      ),
      q(
        "Dar bir koridorda bir iş arkadaşının yanından geçiyorsun, ikiniz de yürüme halindesiniz.",
        "Doğru ölçüde selam hangisi?",
        [
          "Onu durdurup düzgün bir tokalaşma ve kısa bir sohbet yap.",
          "Sıcak dursun diye kocaman el salla ve yüksek sesle “selaaam!” de.",
          "Gözler yerde. Koridorlar yürümek içindir.",
          "Adımını bozmadan baş salla ve “selam” de.",
        ],
        3,
        "TAM ÖLÇÜSÜNDE",
        "Koridorlar küçük selamlar ister. Tokalaşma fazla büyük, gürültülü selam fazla büyük, yere bakış ise sıfır. Küçük ve sıcak olan kazanır."
      ),
      c(
        "İlk tanışmalar tam paketi hak eder.",
        "Tanıştırıldığında paket kısadır: oturuyorsan ayağa kalk, elini uzat, adını net söyle, onun adını geri söyle. Beş saniye, tamam.",
        "oturuyorsan ayağa kalk, elini uzat, adını net söyle"
      ),
      r(
        "Tokalaşmalar ve tanışmalar çok resmi geliyor. Fazla çabalıyormuşum gibi görünürüm.",
        "O düşünceye karşılık ver:",
        [
          "Kimse net bir isim ve uzatılmış bir el yüzünden birini küçümsemedi. “Fazla çabalıyor” benim etiketim, onların değil.",
          "Doğru. Belirsiz kalıp mırıldanmak daha iyi.",
          "Tanışmayı tamamen atlar, direkt konuşmaya başlarım. Böylesi daha akıcı.",
        ],
        0,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu bir kehanet. Gerçek veri şu: insanlar net bir tanışmayı özgüven olarak görür, zorlama olarak değil."
      ),
      c(
        "Bugünkü hamlen.",
        "Doğru ölçüyü bilinçli seç: koridorda baş selamı, sokakta el sallama, tanışmada tokalaşma. Bir kez kasıtlı olarak ölçmek onu sonsuza dek otomatik hale getirir.",
        "Doğru ölçüyü bilinçli seç"
      ),
    ],
    challenge: {
      text: "Bugün bir selamı ortamına bilinçli olarak uydur.",
      sub: "Koridorda baş selamı, sokakta el sallama, tanışmada tokalaşma.",
    },
  },
  {
    index: 3,
    title: "İsmi aklında tut",
    steps: [
      c(
        "İsimler üç saniyede kayıp gider.",
        "İsimleri unutmuyorsun. Onları hiç yüklemiyorsun. O “Ben Maya” derken senin beynin kendi tanıtımını prova etmekle meşgul. İsmi tam düştüğü anda yakala.",
        "İsmi tam düştüğü anda yakala",
        "“O cümlede önemli olan tek kelime onun adıdır.”"
      ),
      q(
        "Selam, ben Maya. Sanırım tanışmadık.",
        "Adını hafızana kazımanın en iyi yolu?",
        [
          "“Memnun oldum!” deyip devam etmek.",
          "“Maya, memnun oldum. Buradakileri nereden tanıyorsun?”",
          "O konuşmaya devam ederken içinden “Maya Maya Maya” diye tekrarlamak.",
          "Numarasını iste ki adı telefonuna kaydolsun.",
        ],
        1,
        "BİR KEZ GERİ SÖYLE",
        "Adı sesli geri söylemek onu hafızaya kaydeder ve insanlar bunu duymayı sever. İçinden tekrarlamak bir sonraki cümlesini kaçırmana yol açar, telefon numarası oyunu da asıl beceriyi atlar."
      ),
      c(
        "Tekrarla, kullan, bağla.",
        "Üç kanca: bir kez geri söyle, sohbetin ortasında bir kez kullan ve bir şeye bağla (“Milanolu Maya”). Üç dokunuş ve isim senin olur.",
        "bir kez geri söyle, sohbetin ortasında bir kez kullan ve bir şeye bağla"
      ),
      r(
        "İsim konusunda kötüyümdür işte. Hep öyleydim.",
        "O düşünceye karşılık ver:",
        [
          "Doğru. Bazı beyinler isimlerle arası iyi değildir.",
          "İsim kullanmaktan kaçınırım, kimse fark etmez.",
          "İnsanlarla tanıştıktan hemen sonra her ismi yazmalıyım.",
          "İsimlerde kötü değildim; yükleme adımını atlıyordum. Kancalar bir teknik, yetenek değil.",
        ],
        3,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "“Hep öyleydim” bir etiket, gerçek değil. Yöntemi değiştir, sonuç da onunla birlikte değişsin."
      ),
      c(
        "Bugünkü hamlen.",
        "Üç kancayla yeni bir isim öğren: geri söyle, bir kez kullan, bir ayrıntıya bağla. Tam yüklenmiş tek bir isim, duyulup kaybedilen on isimden iyidir.",
        "Tam yüklenmiş tek bir isim"
      ),
    ],
    challenge: {
      text: "Bugün üç kancayla yeni bir isim öğren: geri söyle, kullan, bağla.",
      sub: "Çıkarken “Teşekkürler, Maya” demek çift sayılır.",
    },
  },
  {
    index: 4,
    title: "İsmi hafifçe kullan",
    steps: [
      c(
        "İsimler baharat gibidir.",
        "Birkaç dakikada bir söylenen bir isim ortamı ısıtır; her cümlede geçen bir isim satış senaryosu gibi durur. Onu selamda, kritik bir anda ve vedada kullan.",
        "selamda, kritik bir anda ve vedada",
        "“Baharatla, salamura yapma.”"
      ),
      q(
        "“Çok güzel nokta, Alex. Biliyor musun Alex, tam da bu yüzden, Alex...”",
        "Burada ne oluyor?",
        [
          "Şampiyon seviyesi karizma. Daha çok isim, daha çok sıcaklık.",
          "İsim doğru telaffuz edildiği sürece bir sorun yok.",
          "İsim aşırı dozu. Reklam konuşması gibi gelmeye başlıyor.",
        ],
        2,
        "AŞIRI DOZ YAKALANDI",
        "Bir noktadan sonra isimler sıcak gelmeyi bırakır ve hesaplanmış gelmeye başlar. Bir sohbette iki üç kez fazlasıyla yeter."
      ),
      c(
        "Veda, en güçlü an.",
        "Vedadaki isim en çok etki bırakır. “Seni görmek güzeldi, Maya” bütün konuşmanın sana işlediğini ve aklında kaldığını kanıtlar.",
        "Vedadaki isim en çok etki bırakır"
      ),
      r(
        "Ya adını yanlış söyler ve onu kırarsam?",
        "O düşünceye karşılık ver:",
        [
          "Aynen. Hiç isim kullanmamak daha güvenli.",
          "Yanlış bir deneme artı “doğru söyledim mi?” demek özen olarak okunur. Hiç denememek mesafe olarak okunur.",
          "Sadece yüzde yüz emin olduğum isimleri kullanırım, ki bu da neredeyse hiçbiri.",
        ],
        1,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu, düzeltilebilir bir anı felaketleştirmek. İnsanlar adlarını seve seve düzeltir. Bu, senin çaba gösterdiğin anlamına gelir."
      ),
      c(
        "Bugünkü hamlen.",
        "Birinin adını tam olarak iki kez kullan: bir kez sohbetin ortasında, bir kez vedada. Vedanın nasıl etki bıraktığındaki farkı hisset.",
        "bir kez sohbetin ortasında, bir kez vedada"
      ),
    ],
    challenge: {
      text: "Bugün birinin adını iki kez kullan: sohbetin ortasında ve vedada.",
      sub: "“Seni görmek güzeldi, Maya” en güçlü an.",
    },
  },
  {
    index: 5,
    title: "Her selam bir sohbet değildir",
    steps: [
      c(
        "Selamların çıkış kapıları vardır.",
        "Bir selam kendi başına tamdır. “Selam, seni görmek güzel” deyip yoluna devam etmek kibardır, soğukluk değil. Her selamda zorla laf sokuşturmak ikinizi de yorar.",
        "Bir selam kendi başına tamdır",
        "“Yürümeye devam etme hakkın var.”"
      ),
      q(
        "Markette bir tanıdığını görüyorsun, ikiniz de alışverişin ortasındasınız.",
        "Doğru ölçü ne?",
        [
          "Sıcak bir el sallayıp “seni görmek güzel!” de ve yoluna devam et.",
          "Onu süt reyonunun yanında sıkıştırıp on dakikalık bir hasret sohbetine tut.",
          "Görmemiş gibi yap. Herkesi zahmetten kurtarır.",
          "Durup düzgün sohbet edemeyecek kadar meşgul olduğun için özür dile.",
        ],
        0,
        "DOĞRU ÖLÇÜ",
        "İkiniz de daha sıcak ayrılır, kimse kapana kısılmaz. Saklanmak sıfırdır, özür ise güzel bir anı tuhaf bir ana çevirir. Tam bir selamın hiçbir bahaneye ihtiyacı yoktur."
      ),
      c(
        "Yumuşak kapanış.",
        "Bir selam, tutamayacağın bir sohbete dönüşmeye başlarsa, onu sıcak ve ileriye dönük kapat: “Kaçmam lazım, yakında doğru düzgün oturup konuşalım.” Sınırı belirt, bir sonraki buluşmayı ekle.",
        "onu sıcak ve ileriye dönük kapat"
      ),
      r(
        "Bunu kısa kesersem, beni sevmediğimi düşünür.",
        "O düşünceye karşılık ver:",
        [
          "Doğru. Herkese sınırsız zaman borçluyum.",
          "Meşgulken insanlardan kaçarım, böylece hiçbir şeyi kısa kesmek zorunda kalmam.",
          "Gerekçeli, sıcak bir çıkış reddediş değil, dolu bir hayat olarak okunur. Kapana kısılmış ve içerlemiş halim zaten daha kötü bir sohbet arkadaşı.",
          "Her sohbette kalır ama sık sık saatime bakarım ki imayı anlasınlar.",
        ],
        2,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Yine zihin okuma. İnsanlar kapanışın sıcaklığını hatırlar, sohbetin uzunluğunu değil. Saate bakma oyunu asıl soğuk seçenektir."
      ),
      c(
        "Bugünkü hamlen.",
        "Selam olarak kalan tam bir selam ver: sıcak gir, sıcak çık, yürümeye devam et. Kötü hiçbir şey olmadığını fark et.",
        "sıcak gir, sıcak çık, yürümeye devam et"
      ),
    ],
    challenge: {
      text: "Bugün selam olarak kalan tam bir selam ver.",
      sub: "Sıcak gir, sıcak çık ve yürümeye devam et.",
    },
  },
  {
    index: 6,
    title: "Kontrol noktası: üç ilk temas",
    isCheckpoint: true,
    steps: [
      c(
        "Üniteyi üst üste koy.",
        "Önce davran, ölçüyü tuttur, ismi yakala, hafifçe kullan, sıcak çık. Tek bir ilk temas beş hamlenin hepsini kullanır ve bunlardan üç tanesi bir kontrol noktası eder.",
        "Tek bir ilk temas beş hamlenin hepsini kullanır",
        "“Küçük olanlar da sayılır. Git üç tane topla.”"
      ),
      q(
        "Masana yeni biri katılıyor ve tam yanına oturuyor.",
        "Açılış hamlesini yap:",
        [
          "Başka birinin halletmesini bekle.",
          "Ona kibar bir gülümseme ver ve telefonuna geri dön.",
          "“Selam, ben Alex. Sanırım tanışmadık?”",
          "Gruba yüksek sesle sor: “kim bu şimdi?”",
        ],
        2,
        "HAMLE YAPILDI",
        "Önce davrandın, ismini verdin, kapıyı açtın. Gülümse-ve-telefon ikilisi cana yakın görünür ama anı elden kaçırır, “kim bu” ise kişiyi bir gösteriye çevirir."
      ),
      c(
        "Toparlanmak da becerinin bir parçası.",
        "İsmi duyduktan on saniye sonra unuttun mu? Hemen tekrar sor: “pardon, tokalaşırken adını kaçırdım.” Bir dakika içinde tekrar sormak tatlıdır; bir ay boyunca tahmin yürütmek değil.",
        "Bir dakika içinde tekrar sormak tatlıdır"
      ),
      r(
        "Yabancılarla üç konuşma mı? Bu benim için fazlasıyla çok.",
        "O düşünceye karşılık ver:",
        [
          "Baristaya selam 1 numaralı temas. Bu üç konuşma değil, üç minik an.",
          "Katılıyorum. Bugünü atla, Pazartesi başla.",
          "Üçünü de aynı kişiyle yapıp işi bitiririm.",
        ],
        0,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Ya hep ya hiç düşüncesi minik görevleri kocaman gösterir. Parçala: her temas yaklaşık on saniye sürer."
      ),
      c(
        "Bugünkü hamlen.",
        "Üç ilk temas: önce selam ver, ismi yakala, sıcak çık. İşte kontrol noktası ve nadir alıntı.",
        "önce selam ver, ismi yakala, sıcak çık"
      ),
    ],
    challenge: {
      text: "Bugün üç ilk temas yap: önce selam ver, ismi yakala, sıcak çık.",
      sub: "Kontrol noktasını geç ve nadir alıntının kilidini aç.",
    },
  },
];

/* ================= ÜNİTE 2 · Dinleyen Beden ================= */

const unit2Lessons: SeedLesson[] = [
  {
    index: 1,
    title: "50/70 kuralı",
    steps: [
      c(
        "Sinyali gözler taşır.",
        "İletişim araştırmalarından çıkan pratik kural: sen konuşurken zamanın yaklaşık yüzde 50'sinde, dinlerken yaklaşık yüzde 70'inde göz teması kur. Bağ kurmaya yetecek kadar, sorguya çekmeyecek kadar.",
        "konuşurken zamanın yaklaşık yüzde 50'sinde, dinlerken yaklaşık yüzde 70'inde",
        "“Konuşurken değil, onlar konuşurken onlara daha çok bak.”"
      ),
      q(
        "Sana açıkça onun için önemli olan bir şey anlatıyor.",
        "Gözlerin nerede?",
        [
          "O bitirene kadar kırpmadan gözlerine kilitli. Tam bağlılık.",
          "Çoğunlukla ona bakıyor. Dinlemek, konuşmaktan daha çok göz teması hak eder.",
          "Başka her yerde. Sürekli göz teması bayağı fazla.",
          "Ağzına bakıyor, kelimeleri işlediğini anlasın diye.",
        ],
        1,
        "70 AÇIK",
        "O konuşurken gözlerin onda olması “bu önemli” der, tek kelime etmeden. Kırpmayan bakış sorguya çeker ve tuzak da budur: fazlası daha iyi değil, ayarlısı daha iyidir."
      ),
      c(
        "Ara vermek normaldir.",
        "Düşünmek için başka yöne bakmak insanidir. Telefona ya da omzunun ötesine değil, düşünme yönü olan yana bak, sonra düşünceyi yakalayınca geri dön.",
        "yana bak, sonra düşünceyi yakalayınca geri dön"
      ),
      r(
        "Göz teması çok yoğun geliyor. Baktığım için beni tuhaf bulurlar.",
        "O düşünceye karşılık ver:",
        [
          "Doğru. Yerler bakılmak için yapıldı.",
          "Sürekli burnunun köprüsüne bakarım. Teknik olarak göz teması sayılmaz.",
          "Göz temasındaki rahatsızlık benim, onların değil. Kimse hiçbir dinleyiciyi “fazla ilgili” diye tanımlamadı.",
        ],
        2,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu duygusal akıl yürütme: “yoğun hissettiriyor, o halde yoğun görünmeli.” Doğal aralarla yüzde 70'te, sadece dinlemek gibi görünür."
      ),
      c(
        "Bugünkü hamlen.",
        "Bir konuşmada o konuşurken gözlerin yaklaşık yüzde 70 açık olsun. Neyi değiştirdiğini izle. İnsanlar üstünde kalan gözlere daha uzun ve daha sıcak konuşur.",
        "o konuşurken gözlerin yaklaşık yüzde 70 açık"
      ),
    ],
    challenge: {
      text: "Bugün biri sana konuşurken göz temasını yaklaşık yüzde 70'te tut.",
      sub: "Düşünmek için yana bak, sonra geri dön.",
    },
  },
  {
    index: 2,
    title: "Kişiye dön",
    steps: [
      c(
        "Önce beden konuşur.",
        "Omuzların ve ayakların ilgini ağzından önce ilan eder. Birine dönmek, çeyrek dönüş bile olsa, kelimelerden daha yüksek sesle “buradayım, dinliyorum” der.",
        "Omuzların ve ayakların ilgini ağzından önce ilan eder",
        "“Göbeğini kişiye çevir.”"
      ),
      q(
        "Sen ekranına dönük dururken bir meslektaşın konuşmaya başlıyor.",
        "Dinleyen beden hangisi?",
        [
          "Sandalyeni çevir, ona dön, ellerini klavyeden çek.",
          "Yazmaya devam et ve kelimeleri omzunun üstünden fırlat.",
          "Sadece başını çevir. Geri kalanın işin ortasında.",
          "“Bir saniye” de, paragrafı bitir, sonra dön.",
        ],
        0,
        "DÖNÜŞ TAM",
        "Tam dönüş üç saniye alır ve konuşmanın sıcaklığını değiştirir. Sadece baş dönmek “yarım kısmım dinliyor” der. “Bir saniye” dürüsttür ama harcaman gerekmeyen bir iyi niyeti harcar."
      ),
      c(
        "Açık, kapalıya baskındır.",
        "Kavuşturulmuş kollar, çökmüş omuzlar, kalkan gibi tutulan bir çanta: hepsi “konuşmam bitti” olarak okunur. Kollarını aç, omuzlarını indir, duruşunu aç.",
        "Kollarını aç, omuzlarını indir, duruşunu aç"
      ),
      r(
        "Kavuşturulmuş kollar rahat işte. Duruşumu değiştirmek sahtelik olur.",
        "O düşünceye karşılık ver:",
        [
          "Evet. Samimiyet, hiçbir şeyi asla ayarlamamak demek.",
          "Duruş da bir iletişimdir ve ben kelimelerimi netlik için sürekli düzenlerim. Açılmak sahtelik değil, okunur olmaktır.",
          "Peki, kollarımı asker gibi iki yanımda kaskatı tutarım.",
        ],
        1,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Rahatlık ve sinyal ayrı şeylerdir. Rahat hissedip yine de “kapalı” yayını yapabilirsin. Yayını düzeltmek sahtekarlık değildir."
      ),
      c(
        "Bugünkü hamlen.",
        "Bugün bir kez birine tam dönüşü ver: ayaklar, omuzlar, gözler. Bir sürü “hı hı”dan daha etkili üç saniyelik beden dili.",
        "ayaklar, omuzlar, gözler"
      ),
    ],
    challenge: {
      text: "Bugün bir kişiye tümüyle dön: ayaklar, omuzlar, gözler.",
      sub: "Özellikle zahmetli olduğunda. İşte o zaman değeri var.",
    },
  },
  {
    index: 3,
    title: "İçten baş salla",
    steps: [
      c(
        "Baş sallamalar noktalama gibidir.",
        "Kişinin kilit noktalarında yavaş, tekli baş sallamalar “takip ediyorum” der. Her şeye makineli tüfek gibi baş sallamak “ne olur bitir artık” der. Şarkının tamamında değil, vuruşlarında baş salla.",
        "Şarkının tamamında değil, vuruşlarında baş salla",
        "“Bir iyi baş sallama, dokuz hızlıdan iyidir.”"
      ),
      q(
        "Hikayesinin en önemli cümlesini söylüyor.",
        "Doğru tepki?",
        [
          "Hızlı hızlı baş sallamak. İlk cümleden beri devam ediyorsun zaten.",
          "Anı bölmeyeyim diye kımıldamadan durmak.",
          "Bir yavaş baş sallama, kaşlar yukarı: “vay be.”",
          "Kendi benzer hikayenle araya atlamak.",
        ],
        2,
        "NOKTALANDI",
        "Tam onun kilit anında gelen bir tepki, oraya kadar bütün yolu takip ettiğini kanıtlar. Hareketsizlik yok gibi okunur, benzer hikaye ise tam iniş anında spot ışığını çalar."
      ),
      c(
        "Sinyalleri karıştır.",
        "Baş sallama artı ufak bir ses (“hı”, “tabii”) artı gerçek bir ifade değişimi: birlikte tam dinleme tablosunu çizer. Herhangi biri tek başına, tekrarlanınca robotik olur.",
        "tam dinleme tablosu"
      ),
      r(
        "Sürekli tepki vermezsem, dinlemediğimi düşünürler.",
        "O düşünceye karşılık ver:",
        [
          "Doğru. Daha çok baş sallamak hep daha çok dinlemektir.",
          "Kafamda bir sayaç kurarım: ne olursa olsun her beş saniyede bir baş sallarım.",
          "Sürekli tepki vermek gürültüdür. Doğru zamanlı tepkiler ise kanıttır. Dikkatin niteliği, hareketin niceliğine baskındır.",
        ],
        2,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu aşırı telafi: dinlemek yerine dinliyormuş gibi yapmak. Zamanlanmış olan, her seferinde sürekli olana baskındır."
      ),
      c(
        "Bugünkü hamlen.",
        "Bir konuşmada yalnızca kilit vuruşlarda baş salla ve gerisini bir “hı” ya da bir kaş kaldırma yapsın.",
        "yalnızca kilit vuruşlarda baş salla"
      ),
    ],
    challenge: {
      text: "Bugün bir konuşmada yalnızca kilit vuruşlarda baş salla.",
      sub: "Bir “hı” ya da “tabii” ekle, zamanlı, sürekli değil.",
    },
  },
  {
    index: 4,
    title: "Telefonu bırak",
    steps: [
      c(
        "Telefon bir duvardır.",
        "Masada yüzü yukarı duran bir telefon, konuşmayı daha başlamadan zorlar. Araştırmacılar buna telefonla dışlamak diyor ve insanlar bunu yarım saniyelik bir bakışta bile hisseder.",
        "insanlar bunu yarım saniyelik bir bakışta bile hisseder",
        "“Gizli bakış diye bir şey yok. Hepsini görüyorlar.”"
      ),
      q(
        "Telefonun hikayenin ortasında titriyor.",
        "Anda kalan hamle?",
        [
          "Baş sallarken hızlıca göz atmak. Bu çoklu görev sayılır.",
          "Yüzü aşağı çevirmek. Çözüldü.",
          "Bırak öyle kalsın. Titreşim yine orada olacak; an olmayacak.",
          "“Pardon, bir saniye” deyip cevap ver. Dürüstlük, numaradan iyidir.",
        ],
        2,
        "DUVAR İNDİ",
        "Her bakış, onun değerli hissetme duygusunu sıfıra sıfırlar. Masada yüzü aşağı olması da “nöbetteyim” der. Titreşim gelince ona dokunmamak görünür bir armağandır."
      ),
      c(
        "Sinyalini ver.",
        "Telefonun uzakta, cepte ya da erişemeyeceğin bir çantada olması insanların bilinçli olarak fark ettiği bir şeydir. Gerçekten bakman şartsa, sesli söyle: “pardon, bir şey bekliyorum.”",
        "sesli söyle"
      ),
      r(
        "Telefonu kaldırırsam önemli bir şeyi kaçırabilirim.",
        "O düşünceye karşılık ver:",
        [
          "Telefonsuz bir saatte gerçekçi kaçırdığın şey bir capstir. Gerçek aciller iki kez arar.",
          "Doğru. Her bildirim bir acil durumdur.",
          "Elimde tutarım ama sadece sıkıcı kısımlarında bakarım.",
        ],
        0,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu aciliyet yanılsaması. Gerçek kayda bak: 30 dakikalık bir gecikme sana en son ne zaman bir şeye mal oldu?"
      ),
      c(
        "Bugünkü hamlen.",
        "Tümüyle telefonsuz bir konuşma. Uzakta, yüzü aşağı değil. Duvar olmadan kendi dikkatinin bile ne kadar farklı davrandığını hisset.",
        "Uzakta, yüzü aşağı değil"
      ),
    ],
    challenge: {
      text: "Bugün tümüyle telefonsuz bir konuşma yap.",
      sub: "Çantada, masada yüzü aşağı değil.",
    },
  },
  {
    index: 5,
    title: "Dinlenme halindeki yüzün",
    steps: [
      c(
        "Yüzünün bir varsayılanı vardır.",
        "Yüzün dinlenme halinde ne yapıyorsa, yabancılar onu “sen” diye okur. Çoğu dinlenme yüzü, sahibinin gerçekten hissettiğinden daha yorgun ya da daha kızgın okunur, özellikle ekran sonrasında.",
        "sahibinin gerçekten hissettiğinden daha yorgun ya da daha kızgın okunur",
        "“Kimse hissettiği kadar nötr görünmüyor.”"
      ),
      q(
        "Yeni bir ekip arkadaşın başta sana “yaklaşması zor” göründüğünü itiraf ediyor.",
        "Muhtemel suçlu?",
        [
          "Kişiliğin. Buna göre panik yap.",
          "Dinlenme yüzü. Ekrana odaklanma herkesin varsayılanını düzleştirir.",
          "Onun aşırı hassaslığı. Senin sorunun değil.",
          "Kıyafetin. Gardırobu gözden geçirme vakti.",
        ],
        1,
        "SUÇLU BULUNDU",
        "Suçlu yüz, kişi değil. Bu da harika bir haber: yüzler geri bildirim alır. Onları (ya da gömleğini) suçlamak, iki saniyede ayarlayabileceğin tek değişkeni atlar."
      ),
      c(
        "Girişte yumuşat.",
        "Kalıcı sırıtış gerekmez. Biri yaklaşırken iki saniyelik bir sıfırlama yeter: kaşlar bir tık yukarı, çene gevşek, ufak bir ısınma gülümsemesi. Sonra konuş.",
        "Biri yaklaşırken iki saniyelik bir sıfırlama"
      ),
      r(
        "Yani sorun benim yüzüm mü? Harika. Ben zaten yaklaşılmaz biriyim.",
        "O düşünceye karşılık ver:",
        [
          "Evet. Bazı insanlar doğuştan yaklaşılmazdır.",
          "Bütün gün kocaman bir gülümseme tutarım, kimse bana soğuk diyemesin.",
          "Aynada yüzümü düzeltene kadar yeni insanlardan kaçarım.",
          "Bir varsayılan bir alışkanlıktır, bir kimlik değil. İki saniyelik bir sıfırlama, insanların karşılaştığı şeyi değiştirir.",
        ],
        3,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu etiketleme: değiştirilebilir bir sinyali kalıcı bir özelliğe çevirmek. Bütün gün sırıtış zorlamaya kaçar. Sinyal iki saniyede değişir."
      ),
      c(
        "Bugünkü hamlen.",
        "Dinlenme yüzünü bir kez yakala (ayna, kamera, cam), sonra biri sana yaklaştığında iki saniyelik sıfırlamayı uygula.",
        "iki saniyelik sıfırlamayı uygula"
      ),
    ],
    challenge: {
      text: "Bugün biri sana yaklaştığında iki saniyelik yüz sıfırlamasını yap.",
      sub: "Kaşlar bir tık yukarı, çene gevşek, ufak gülümseme. Sonra konuş.",
    },
  },
  {
    index: 6,
    title: "Kontrol noktası: tümüyle anda olan bir konuşma",
    isCheckpoint: true,
    steps: [
      c(
        "Tam dinleyen beden.",
        "Gözler 70'te, beden dönük, baş sallamalar vuruşlarda, telefon yok, yüz yumuşak. Beş sessiz sinyal, tek bir mesaj: “bütün dikkatim sende.”",
        "Beş sessiz sinyal, tek bir mesaj",
        "“Bilinçli gösterilen dikkat nadirdir. Sen o nadir olan ol.”"
      ),
      q(
        "Arkadaşın ağır bir şey paylaşmaya başlıyor.",
        "Anda olan bedenin listesi şununla başlar...",
        [
          "En mükemmel tavsiyeyle.",
          "Hemen omzuna konan bir elle.",
          "Ona dön, telefonu kaldır, gözlerini dik, tek bir kelimeden önce.",
          "“Zormuş bu.” Önce kelimeler, sonra yerleş.",
        ],
        2,
        "ÖNCE BEDEN",
        "Anda olma dilden önce gelir. Bedeni doğru ayarla, kelimeler iki kat önem kazansın. Tavsiye ve dokunuş sonra gelebilir; ikisi de açılış hamlesi değil."
      ),
      c(
        "En ucuz süper güç.",
        "Bu ünitedeki hiçbir şey zeka, cesaret ya da doğru kelimeler gerektirmez. Bilinçli dikkat, çoğu insanın bütün gün aldığı en nadir şeydir ve sana hiçbir şeye mal olmaz.",
        "Bilinçli dikkat, çoğu insanın bütün gün aldığı en nadir şeydir"
      ),
      r(
        "Konuşmanın ortasında fark ediyorum: kollar kavuşuk, telefon elde, gözler kayıyor. Mahvettim.",
        "O düşünceye karşılık ver:",
        [
          "Fark etmek zaten becerinin çalışması demek. Sessizce üçünü de düzelt ve geri dön. İlana gerek yok.",
          "Evet. Utançla konuşmayı iptal et.",
          "Berbat beden dilim için sesli özür dilerim.",
        ],
        0,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Yine ya hep ya hiç. Anda olmak bozduğun bir seri değil; cümlenin ortasında yükseltebileceğin bir ayardır. Özür dilemek olayı sadece sana çevirir."
      ),
      c(
        "Bugünkü hamlen.",
        "Baştan sona tam dinleyen bedenle bir konuşma. İşte kontrol noktası ve nadir alıntı.",
        "tam dinleyen bedenle bir konuşma"
      ),
    ],
    challenge: {
      text: "Baştan sona tam dinleyen bedenle bir konuşma yürüt.",
      sub: "Kontrol noktasını geç ve nadir alıntının kilidini aç.",
    },
  },
];

/* ================= ÜNİTE 3 · Konuşmanın Mekaniği 101 ================= */

const unit3Lessons: SeedLesson[] = [
  {
    index: 1,
    title: "Sırayla oyna",
    steps: [
      c(
        "Konuşma bir tenis maçıdır.",
        "İyi bir konuşma bir rali gibidir, monolog ya da duvar değil. Sen vurursun, o vurur, aşağı yukarı eşit. Çok uzun konuşursan boş bir kortu servis atıyorsundur; susarsan o tek başına oynuyordur.",
        "bir rali gibidir, monolog ya da duvar değil",
        "“Kabaca yarı yarıya bir dağılım hedefle.”"
      ),
      q(
        "İki tam dakikadır bir hikaye anlatıyorsun ve gözleri az önce kapıya kaydı.",
        "Hamle ne?",
        [
          "Daha hızlı konuş ki o kaçmadan güzel kısma ulaşasın.",
          "Yakında bitir ve topu geri at: “neyse, senden ne haber?”",
          "Cümlenin ortasında dur ve “seni sıkıyor muyum?” diye sor.",
          "Devam et. Finali buna değer.",
        ],
        1,
        "RALİ KURTARILDI",
        "Kapıya kayan bir bakış “sıra sende” sinyalidir. Hızlanmak boş korta servis atmaya devam etmek olur, “seni sıkıyor muyum” ise senin duygularını ona yönettirir. Toparla ve topu geri ver."
      ),
      c(
        "Devir teslim anını gözle.",
        "İnsanlar sıralarının bittiğini sinyalle verir: sesleri kısılır, tonlarını düşürür ya da sana bir şey sorar. Bunlar açık kapılardır. Sessizliğin seni zorlamasını beklemek yerine içeri gir.",
        "sesleri kısılır, tonlarını düşürür ya da sana bir şey sorar"
      ),
      r(
        "Konuşmayı kesersem tuhaf bir sessizlik olacak ve suçlusu ben olacağım.",
        "O düşünceye karşılık ver:",
        [
          "Doğru. Kelimeleri akıtmaya devam etmek zorundayım.",
          "Her konuşmadan önce üç yedek konu hazırlarım.",
          "Sessizlik ortak bir duraksamadır, benim kişisel başarısızlığım değil. Onu doldurmak benim kadar onun da sırası.",
          "Hiç boşluk olmasın diye sonsuza kadar soru sorarım.",
        ],
        2,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu aşırı sorumluluk: bütün konuşmayı tek başına taşımak. Bir rali iki rakete ihtiyaç duyar. Sessizlik bir davettir, bir hüküm değil."
      ),
      c(
        "Bugünkü hamlen.",
        "Bir konuşmada kendini devir teslim anında yakala (bir ses kısılması, bir soru ya da iki dakika sınırı) ve topu bilerek geri ver.",
        "topu bilerek geri ver"
      ),
    ],
    challenge: {
      text: "Bugün bir konuşmada sırayı eşit paylaş. Devir teslim anında topu geri ver.",
      sub: "Kabaca yarı yarıya. İki dakikaya gelince topu geri at.",
    },
  },
  {
    index: 2,
    title: "Cevap, artı bir",
    steps: [
      c(
        "Tek kelimelik cevaplar kapıyı çarpar.",
        "“İyi.” “Fena değil.” “Yok bir şey.” Çıplak bir cevap karşındakine tutunacak hiçbir şey bırakmaz. Soruyu cevapla, sonra bir ayrıntı ekle: çekebileceği bir ip ucu.",
        "bir ayrıntı ekle: çekebileceği bir ip ucu",
        "“Cevap +1. Asla sadece cevap değil.”"
      ),
      q(
        "“Hafta sonun nasıldı?”",
        "En iyi karşılık?",
        [
          "“İyiydi, sağ ol.” Kibar ve bitti.",
          "“İyiydi! Seninki nasıldı?” Direkt geri sektir.",
          "Baştan sona tam on dakikalık bir özet.",
          "“İyiydi. Sonunda herkesin bahsettiği o yürüyüş rotasını denedim.”",
        ],
        3,
        "İP UCU EKLENDİ",
        "Yürüyüş rotası tutabileceği bir tutamak. Anında geri sektirmek cömert görünür ama ona çalışacak bir şey vermez, özet ise hamle +1 iken +10 olur."
      ),
      c(
        "Aslında ona iyilik yapıyorsun.",
        "Bir ayrıntı eklemek aşırı paylaşım değil. Cömertliktir: karşındakine kolay bir giriş kapısı sunar, böylece bir sonraki lafı bulmak için eşelemek zorunda kalmaz.",
        "karşındakine kolay bir giriş kapısı sunar"
      ),
      r(
        "Fazladan bir şey eklersem gevezelik etmiş olurum ve kendi sesime aşık biri sanırlar.",
        "O düşünceye karşılık ver:",
        [
          "Bir ayrıntı monolog değildir. Sahneyi kapatmıyorum; ona bir kapı veriyorum.",
          "Doğru. Kimseyi rahatsız etmeyeyim diye kısa tutayım.",
          "Ayrıntı eklerim ama yalnızca açıkça isterlerse.",
        ],
        0,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu, yardımseverliği bencillikle yanlış etiketlemek. Bir cümlelik renk bir armağandır, nutuk değil."
      ),
      c(
        "Bugünkü hamlen.",
        "Bir “nasılsın?”a gerçeği artı ufak bir ayrıntıyla cevap ver. Karşındakinin bir sonraki lafı ne kadar kolay bulduğunu izle.",
        "gerçeği artı ufak bir ayrıntı"
      ),
    ],
    challenge: {
      text: "Bugün +1 cevapla: küçük bir soruya bir ekstra ayrıntıyla karşılık ver.",
      sub: "“İyi. [bir şey].” Onlara tutunacak bir ip ucu ver.",
    },
  },
  {
    index: 3,
    title: "Bir tane geri gönder",
    steps: [
      c(
        "Her cevap bir karşılığı hak eder.",
        "Biri sorunu cevaplayınca sıcak hamle, kendinle ilgili yeni bir konu değil, onunla ilgili bir tane geri göndermektir. Topu oyunda tutar ve “gerçekten ilgileniyorum” der.",
        "onunla ilgili bir tane geri gönder",
        "“Servisi geri gönder.”"
      ),
      q(
        "“Lizbon'daki kız kardeşimi ziyaret edip yeni döndüm.”",
        "Hangi karşılık onu canlı tutar?",
        [
          "“Güzel. Hiç gitmedim.” Sonra sessizlik.",
          "“Lizbon! Ben 2019'da gitmiştim. Yemekleri harika. Neyse...”",
          "“Lizbon. Onu ne sıklıkta görebiliyorsun?”",
          "“Süper. Sen ne iş yapıyorsun?”",
        ],
        2,
        "SERVİS GERİ GÖNDERİLDİ",
        "İki iplik uzattı: Lizbon ve kız kardeşi. Takip sorusu birini çeker. 2019 hikayesi sessizce olayı sana çevirir, iş sorusu ise onun ipliğini tümden terk eder."
      ),
      c(
        "Bir iyi soru, üç bilgiye baskındır.",
        "Harvard araştırmacıları, takip sorusu soranların daha sevimli bulunduğunu buldu; çünkü onun cevabıyla ilgili bir soru, konuşmak için beklemeyip dinlediğini kanıtlar.",
        "onun cevabıyla ilgili bir soru, konuşmak için beklemeyip dinlediğini kanıtlar"
      ),
      r(
        "Soru sorarsam soru bitecek ve tuhaf bir mülakata dönüşecek.",
        "O düşünceye karşılık ver:",
        [
          "Doğru. Hiç sormaya başlamamak daha iyi.",
          "Bir liste değil, sadece bir sonrakine ihtiyacım var. Onun son cümlesi bana hep bir tane verir.",
          "Bu gece yirmi hazır soru ezberlerim.",
        ],
        1,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu bir kehanet. Mülakat senaryosu yazmıyorsun. Az önce söylediğinin içindeki ipliği çekiyorsun, her seferinde bir soru."
      ),
      c(
        "Bugünkü hamlen.",
        "Biri sana cevap verdikten sonra, kendinle ilgili bir şey eklemeden önce onun cevabıyla ilgili tam bir soru geri gönder.",
        "onun cevabıyla ilgili tam bir soru geri gönder"
      ),
    ],
    challenge: {
      text: "Bugün bir servis geri gönder: kendinle ilgili bir bilgi değil, onun cevabıyla ilgili bir takip sorusu sor.",
      sub: "Sana uzattığı ipliği çek.",
    },
  },
  {
    index: 4,
    title: "Ses ve tempoyu uydur",
    steps: [
      c(
        "Onlarla aynı yerde buluş.",
        "Gürültülü oda, yüksek enerji: uydur. Sessiz kafe, alçak sesle konuşan biri: onunla buluşmak için sesini indir. Kendi sabit sesinde konuşmak odayı görmezden gelir; uydurmak “bu işte beraberiz” der.",
        "uydurmak “bu işte beraberiz” der",
        "“Alışkanlığına değil, odaya ayarla.”"
      ),
      q(
        "Herkesin yarı fısıltıyla konuştuğu, sessiz ve odaklı bir masaya katılıyorsun.",
        "Açılışın en iyi şu durumda tutar...",
        [
          "Önce onların seviyesine in, sonra konuş.",
          "Havayı kaldırmak için tam neşeli sesinle giriş yap.",
          "Biri seninle doğrudan konuşana kadar sessiz kal.",
          "Çaba gördükleri için dramatik bir şekilde fısılda.",
        ],
        0,
        "AYARLANDI",
        "Sessiz bir masanın üstüne gürültüyle girmek “sizi fark etmedim” olarak okunur. Sonsuza kadar beklemek yok gibi okunur, teatral fısıltı ise olayı bir gösteriye çevirir. Frekansı tuttur, sonra konuş."
      ),
      c(
        "Tempo kendi hikayesini anlatır.",
        "Kelimelerini yarışırcasına söylemek gerginlik olarak okunur; düz bir uğultu insanları kaybettirir. Önemli olduğunda bir tık yavaşla ve kilit cümleyi yerine oturt. Tempo, kontrol ettiğin bir noktalamadır.",
        "bir tık yavaşla ve kilit cümleyi yerine oturt"
      ),
      r(
        "Yavaşlarsam sıkılırlar ve daha bitirmeden onları kaybederim.",
        "O düşünceye karşılık ver:",
        [
          "Doğru. Hız, dikkatlerini ayakta tutar.",
          "Öyle bir yavaşlarım ki her kelime kendi dramatik duraksamasına kavuşur.",
          "Aceleyle konuşmak insanları kaybettirir; dengeli bir tempo onları tutar. Kelimelerin etrafındaki boşluk onları daha yumuşak değil, daha sert oturtur.",
        ],
        2,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu duygusal akıl yürütme: “aceleci hissediyorum, o halde yavaş sıkıcı hissettirir.” Gerçekte sakin tempo özgüven olarak okunur."
      ),
      c(
        "Bugünkü hamlen.",
        "Bugün bir kez, konuşmadan önce odanın sesini ve temposunu fark et ve ona ayarla. Sonra o tek önemli cümlen için yavaşla.",
        "ona ayarla. Sonra o tek önemli cümlen için yavaşla"
      ),
    ],
    challenge: {
      text: "Bugün bir odanın sesine ve temposuna uy, sonra kilit cümlen için yavaşla.",
      sub: "Konuşmadan önce onlarla aynı yerde buluş.",
    },
  },
  {
    index: 5,
    title: "Bırak bitirsinler",
    steps: [
      c(
        "Duraksama, atlama işaretin değil.",
        "Biri düşünürken oluşan ufak bir boşluk bir açılış değildir. O, kafasının içinde cümlesinin ortasındadır. O boşluğa atlamak, zaten sana devredilmek üzere olan sırayı çalar.",
        "O, kafasının içinde cümlesinin ortasındadır",
        "“Senin sözünden önce onun son sözü otursun.”"
      ),
      q(
        "Düşüncenin ortasında duraksıyor, belli ki bir sonraki kelimeyi arıyor.",
        "Saygılı hamle?",
        [
          "Atlayıp cümlesini onun yerine bitir. Takım çalışması.",
          "Aradığı olabilecek üç kelime öner.",
          "Boşluğu kendi noktanı açmak için kullan. Sırayı adil şekilde kaybetti.",
          "Bekle. Duraksamaya bir soluk ver ve bırak cümlesini oturtsun.",
        ],
        3,
        "ALAN VERİLDİ",
        "Cümlesini bitirmek sırayı kaçırır, kelime menüsü ise düşüncesini bir yarışma programına çevirir. Verilen bir soluk “acele etme” der ve neredeyse her zaman devam ederler."
      ),
      c(
        "Düşünceni tut.",
        "O hâlâ konuşurken elinde harika bir nokta mı var? Park et. Onu araya sokmak için bölmek, onun anını seninkiyle takas eder ve o nokta üç saniye daha gayet iyi bekler.",
        "Park et"
      ),
      r(
        "Şimdi söylemezsem unutacağım ve şansımı kaybedeceğim.",
        "O düşünceye karşılık ver:",
        [
          "Doğru. Boşluğu kap yoksa noktayı sonsuza dek kaybet.",
          "Gerçek bir nokta birkaç saniyelik beklemeyi atlatır. Uçup gidiyorsa, önemli olan o değildi zaten.",
          "Noktamı içimden tekrar edip sıram gelene kadar onları görmezden gelirim.",
        ],
        1,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu aciliyet düşüncesi: her dürtüyü şimdi ya da asla saymak. Üstelik onlar konuşurken içinden prova yapmak, dinlemeyi zaten bıraktın demektir."
      ),
      c(
        "Bugünkü hamlen.",
        "Bir konuşmada her duraksamanın nefes almasına izin ver ve onlar tam bitirene kadar her noktayı tut. Sırayı sana kendiliğinden verdiklerini fark et.",
        "her duraksamanın nefes almasına izin ver"
      ),
    ],
    challenge: {
      text: "Bugün bir kişinin tam olarak bitirmesine izin ver. Duraksamalarına atlama yok.",
      sub: "Noktanı üç saniye tut. Sırayı sana verecekler.",
    },
  },
  {
    index: 6,
    title: "Kontrol noktası: temiz bir rali",
    isCheckpoint: true,
    steps: [
      c(
        "Mekaniği bir araya getir.",
        "Sırayla oyna, cevap +1, bir tane geri gönder, odaya uy, bırak bitirsinler. Tek bir gerçek konuşma beşini de çalıştırır ve birden akıp gider, kimse fazla yorulmadan.",
        "Tek bir gerçek konuşma beşini de çalıştırır",
        "“Temiz bir rali. Git oyna.”"
      ),
      q(
        "Zar zor tanıdığın bir komşun “Uzun gündü. Bittiğine sevindim” diyor.",
        "Mekaniği çalıştır:",
        [
          "“Zor muydu? Ne oldu?” Geri gönderildi, uyduruldu ve sakin.",
          "“Bende de öyle.” Ve bırak düşsün.",
          "“Sen bir de BENİM günümü dinle.”",
          "“Neyse, yarın yeni bir gün!” Pozitif kal ve yürümeye devam et.",
        ],
        0,
        "RALİ ÇALIŞTI",
        "Onun sakin tonunu tutturdun, bir soru geri gönderdin ve konuşması için yer bıraktın. “Bende de” bir duvar, üstüne çıkmak sırayı çalar, güneşli çıkış ise verdiği açılışı geçiştirir."
      ),
      c(
        "Tamir, mükemmellikten iyidir.",
        "Yanlışlıkla birinin sözünü mü kestin? “Pardon, buyur” anında düzeltir. Bir temiz toparlanma, hiç aksatmamaktan daha önemlidir; kimse kusursuz bir metin tutmuyor.",
        "“Pardon, buyur” anında düzeltir"
      ),
      r(
        "Ya çok konuşuyorum ya da donup kalıyorum. Konuşmalarda kötüyüm işte.",
        "O düşünceye karşılık ver:",
        [
          "Katılıyorum. Bazı insanlar bunu yapamaz.",
          "Bundan sonra her konuşmadan önce bir metin yazarım.",
          "“Her zaman” ve “kötüyüm” birer etiket, gerçek değil. Bunlar sıkışıp kaldığım bir kişilik değil, prova edebileceğim beş alışkanlık.",
        ],
        2,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu etiketleme artı ya hep ya hiç. Hükmü beceriyle değiştir: sıra, +1, geri gönder, uy, otursun."
      ),
      c(
        "Bugünkü hamlen.",
        "Baştan sona beş mekaniğin hepsini kullanan bir konuşma. İşte kontrol noktası ve nadir alıntı.",
        "beş mekaniğin hepsini kullanan bir konuşma"
      ),
    ],
    challenge: {
      text: "Bugün beş mekaniğin hepsini kullanan bir konuşma yürüt: sıra, +1, geri gönder, uy, otursun.",
      sub: "Kontrol noktasını geç ve nadir alıntının kilidini aç.",
    },
  },
];

/* ================= ÜNİTE 4 · Nezaket Protokolü ================= */

const unit4Lessons: SeedLesson[] = [
  {
    index: 1,
    title: "Özür diyeti",
    steps: [
      c(
        "Aşırı özür seni küçültür.",
        "“Rahatsız ettiğim için özür dilerim,” “pardon, kısa bir soru,” “pardon, yine ben.” Var olduğun için özür dilemek insanlara seni bir aksama olarak görmeyi öğretir. “Özür dilerim”i gerçekten zarar verdiğin ana sakla.",
        "“Özür dilerim”i gerçekten zarar verdiğin ana sakla",
        "“Çoğu özrü teşekkürle değiştir.”"
      ),
      q(
        "Bir arkadaşınla buluşmaya iki dakika geç geliyorsun, o da az önce gelmiş.",
        "En iyi açılış?",
        [
          "“Çok özür dilerim, ben rezaletim, pardon...”",
          "Bu konuda hiçbir şey söyleme. İki dakika yok gibidir.",
          "“Beklediğin için sağ ol!” Sıcak, yalvarmadan.",
          "Senin suçun olmadığını bilsin diye trafiğin ayrıntılı açıklaması.",
        ],
        2,
        "YENİDEN ÇERÇEVELENDİ",
        "“Beklediğin için sağ ol”, onu suçunu yönetmeye zorlamak yerine ona kredi verir. Görmezden gelmek şımarık okunabilir, trafik raporu ise iki dakikayı bir olay gibi gösterir."
      ),
      c(
        "Özür değil, teşekkür.",
        "Çoğu “özür” aslında kılık değiştirmiş teşekkürdür. “Geç kaldığım için özür dilerim”, “sabrın için teşekkürler” olur. “Gevezelik ettiğim için özür” ise “beni dinlediğin için sağ ol” olur. Şükran odayı yükseltir; özür seni indirir.",
        "Şükran odayı yükseltir; özür seni indirir"
      ),
      r(
        "Bu kadar çok özür dilemeyi bırakırsam, kaba ya da kibirli görünürüm.",
        "O düşünceye karşılık ver:",
        [
          "Paspas ile kibirli arasında geniş bir şerit var. Refleks özürleri bırakmak beni sadece normalde bırakır.",
          "Doğru. Sürekli özürler beni güvende ve sevilir tutar.",
          "Peki, bir daha asla hiçbir şey için özür dilemem, hiç.",
        ],
        0,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu siyah beyaz düşünce ve asla özür dileme salınımı da öyle. Gerçek özürler kalır; refleks olanlar gider."
      ),
      c(
        "Bugünkü hamlen.",
        "Gerçek bir zararla ilgili olmayan bir refleks “özür”ü yakala ve onu bir “teşekkür”le değiştir. Aynı anın ne kadar farklı oturduğunu hisset.",
        "onu bir “teşekkür”le değiştir"
      ),
    ],
    challenge: {
      text: "Bugün bir refleks “özür”ü bir “teşekkür”le değiştir.",
      sub: "“Geç kaldığım için özür” yerine “beklediğin için sağ ol.”",
    },
  },
  {
    index: 2,
    title: "O belirli şeye teşekkür et",
    steps: [
      c(
        "Genel teşekkür buharlaşır.",
        "“Teşekkürler!” fena değil ama duvar kağıdı gibidir. Kayıp gider. Ne yaptığını söyle, işte o zaman oturur: “şunu düzeltmek için geç saate kadar kaldığın için sağ ol” gerçekten fark ettiğini söyler.",
        "Ne yaptığını söyle, işte o zaman oturur",
        "“Sadece sonuca değil, çabaya teşekkür et.”"
      ),
      q(
        "Bir iş arkadaşın senin için bir sunumu gece boyunca baştan yaptı.",
        "Hangi teşekkür oturur?",
        [
          "“Sağ ol, minnettarım!”",
          "“O slaytları gece boyunca baştan yaptığın için sağ ol. Bu sabah beni kurtardı.”",
          "Üç emojiyle vurgulayarak “Sen efsanesin!! 🙌”.",
          "Hiçbir şey demeden ona bir kahve al. Laftan çok eylem.",
        ],
        1,
        "BELİRLİ OLAN KAZANIR",
        "Geç saati ve getirdiği faydayı söylemek çabayı gördüğünü kanıtlar. Övgü ve sessiz kahve güzel ama hiçbiri NE'nin sana işlediğini söylemez, ve insanların hatırladığı kısım da odur."
      ),
      c(
        "Çabayı öv.",
        "Sadece sahip oldukları yeteneği değil, yaptıkları seçimi öv. “Bana bu kadar sabırlı olduğun için sağ ol”, “çok zekisin”e baskındır. Çaba, senin için bilerek yaptıkları bir şeydir.",
        "yaptıkları seçimi öv"
      ),
      r(
        "Teşekkür etmeyi büyütürsem, sahte ya da abartılı gelecek.",
        "O düşünceye karşılık ver:",
        [
          "Doğru. Havalı kalmak için kısa bir “sağ ol”la yetin.",
          "Kesin otursun diye üç ayrı sefer teşekkür ederim.",
          "İyi tanıdığım insanlara teşekkürü atlarım. Zaten biliyorlar.",
          "Belirli olmak sahte değildir. Tam tersi: ayrıntı, teşekkürün gerçek olduğunun kanıtıdır.",
        ],
        3,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu, iyi bir davranışa kötü bir niyet okumak. İnsanlar nadiren fazla teşekkür edilmiş hisseder; görülmüş hisseder. (Ve en yakınındakiler en az teşekkür edilenlerdir.)"
      ),
      c(
        "Bugünkü hamlen.",
        "Bir kişiye yaptığı belirli bir şey için teşekkür et. Eylemi ve sana etkisini söyle.",
        "Eylemi ve sana etkisini söyle"
      ),
    ],
    challenge: {
      text: "Bugün belirli bir teşekkür et: ne yaptıklarını ve neden önemli olduğunu söyle.",
      sub: "“[tam olarak şu] için sağ ol, [senin için ne yaptığı].”",
    },
  },
  {
    index: 3,
    title: "Şimdi uygun mu?",
    steps: [
      c(
        "Önce pisti kontrol et.",
        "Konuya direkt dalmak, karşındakinin onu yakalamaya müsait olduğunu varsayar. Beş kelime, “şimdi uygun mu?”, kontrolü onlara verir ve onları çok daha alıcı yapar.",
        "kontrolü onlara verir",
        "“İnmeden önce pist iste.”"
      ),
      q(
        "Meşgul görünen bir meslektaşını masasında odaklanmışken yakalıyorsun.",
        "Nasıl açarsın?",
        [
          "Üç sorunun içine direkt dal. Verimlilik.",
          "Seni fark edene kadar masasının yanında sessizce bekle.",
          "“Birkaç dakikan var mı, yoksa sonra mı uğrayayım?”",
          "Onun yerine e-posta at. Asla, hiç kimseyi bölme.",
        ],
        2,
        "PİST KONTROL EDİLDİ",
        "“Yoksa sonra mı?” demek evet'i gerçek kılar. Yanında beklemek, olmadığını iddia eden bir bölmedir, hep-e-posta ise basit şeylerin günler almasına yol açar. Sor, gerçek bir çıkışla."
      ),
      c(
        "Gerçek bir çıkış, gerçek bir evet yapar.",
        "“Sonra”yı yalnızca gerçekten kastediyorsan sun. Samimi bir kaçış yolu tetiği düşürür ve geri aldığın “tabii, buyur” zorlanmış değil, gönülden olur.",
        "Samimi bir kaçış yolu tetiği düşürür"
      ),
      r(
        "Onlara bir çıkış verirsem hayır der ve şansımı hiç bulamam.",
        "O düşünceye karşılık ver:",
        [
          "Doğru. Onları kaçamadan yakalamak daha iyi.",
          "Bir “sonra” bir “hayır” değildir. Daha iyi bir zamandır. Zorla alınan dikkat zaten değersizdir.",
          "Sorarım ama orada dikilirim ki sonra demesi zor olsun.",
        ],
        1,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu kıtlık düşüncesi. Onların zamanlamasına saygı göstermek, bir dahaki sefere gerçek bir evet getiren güveni inşa eder. (Üçüncü seçenek de fazladan adımla zorla köşeye sıkıştırmak.)"
      ),
      c(
        "Bugünkü hamlen.",
        "Acil olmayan bir ricadan önce pisti kontrol et: “şimdi mi uygun, sonra mı?” Ve sonrayı gerçekten kastet.",
        "“şimdi mi uygun, sonra mı?”"
      ),
    ],
    challenge: {
      text: "Bugün acil olmayan bir şeyden önce “şimdi uygun mu?” diye sor.",
      sub: "Gerçek bir “sonra” sun ve onu gerçekten kastet.",
    },
  },
  {
    index: 4,
    title: "Profesyonel gibi araya gir",
    steps: [
      c(
        "Bazen araya girmek zorundasın.",
        "Toplantılar ve grup sohbetleri düzgün boşluklar bırakmaz. Sonsuza kadar sessizlik beklemek hiç konuşmamak demektir. Beceri hiç araya girmemek değil; işaret vererek araya girmektir.",
        "işaret vererek araya girmek",
        "“Girmeden önce sinyal ver.”"
      ),
      q(
        "Grup ilerledi ama eklemek istediğin önemli bir şey var.",
        "En temiz giriş yolu?",
        [
          "“Kısaca araya girebilir miyim?” Sonra kısa tut.",
          "Onlar durana kadar daha yüksek sesle konuşmaya başla.",
          "El kaldır ve okuldaki gibi söz verilmesini bekle.",
          "Boş ver. Önemliyse başka biri söyler.",
        ],
        0,
        "TEMİZ GİRİŞ",
        "Kısa bir işaret izin ister ve geldiğini haber verir. Üstlerine konuşmak ezmektir, kalkan el sıranı dışarıya verir, “başkası söyler” ise iyi noktaların ölme şeklidir."
      ),
      c(
        "Adını koy ve kısa tut.",
        "Araya girmeyi sahiplen (“böldüğüm için pardon,” “devam etmeden önce”), sonra kısa ol ve sözü geri ver. İşaretli, kısa bir araya giriş kaba değil, katılımcı olarak okunur.",
        "İşaretli, kısa bir araya giriş"
      ),
      r(
        "Araya girmek her zaman kabadır. Sessiz kalıp riske girmemeliyim.",
        "O düşünceye karşılık ver:",
        [
          "Doğru. Sessiz kalmak kibar ve güvenli seçenektir.",
          "Serbestçe araya girerim. Herkes yapıyor, ben neden yapmayayım?",
          "Kibar, işaretli bir araya giriş normal ve beklenendir. Hiç konuşmamak kibarlık değil; görünmezliktir.",
          "Bütün noktalarımı sonrası için uzun bir mesaja saklarım.",
        ],
        2,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu ya hep ya hiç kuralı ve serbestlik de onun ayna görüntüsü. Nazik bir giriş yolu var; ortadan kaybolmak daha saygılı değil, sadece daha sessiz."
      ),
      c(
        "Bugünkü hamlen.",
        "Bugün bir kez bilerek bir işaretle araya gir: “bir şey ekleyebilir miyim?” Söyle ve hemen geri ver.",
        "bilerek bir işaretle araya gir"
      ),
    ],
    challenge: {
      text: "Bugün bir işaretli araya giriş yap: “araya girebilir miyim?” Sonra kısa tut.",
      sub: "Sinyal ver, söyle, sözü geri ver.",
    },
  },
  {
    index: 5,
    title: "Küçülmeden iste",
    steps: [
      c(
        "Bir rica bir yük değildir.",
        "“Çok zahmet olmazsa, belki, bir saniyen varsa, pardon...” Yumuşatıcıları üst üste yığmak normal bir ricayı bir itiraf gibi gösterir. Net, sıcak bir rica ikinize de saygı gösterir.",
        "Net, sıcak bir rica ikinize de saygı gösterir",
        "“Lütfen, lütfen-lütfen-lütfen değil.”"
      ),
      q(
        "Beklediğin bir dosyayı bir meslektaşının göndermesine ihtiyacın var.",
        "En iyi rica?",
        [
          "“Çok pardon, belki bir ara fırsat bulursan, hiç acelesi yok, pardon...”",
          "“Şu dosyayı bana gönder.” Kısa ve verimli.",
          "“Bir ara vaktin olunca o dosyayı gönderebilir misin? Sağ ol!”",
          "Bir gün daha bekle. Muhtemelen kendileri hatırlar.",
        ],
        2,
        "TEMİZ RİCA",
        "Bir yumuşatıcı artı net bir rica fazlasıyla yeter. Özür yığını minik bir iyiliği kocaman gösterir, çıplak emir soğuk oturur, sessizce beklemek ise sorunu sadece yarına taşır."
      ),
      c(
        "Bir yumuşatıcı, yedi değil.",
        "Nezaket bir yastığa ihtiyaç duyar: bir “yapar mısın”, bir “sağ ol”, bir gülümseme. Ötesinde yumuşatıcılar kibar olmayı bırakır ve endişeli gelmeye başlar. Ricanı söyle, sonra dur.",
        "Ricanı söyle, sonra dur"
      ),
      r(
        "Direkt istersem talepkar oluyorum ve bana içerlerler.",
        "O düşünceye karşılık ver:",
        [
          "Bir “lütfen”li net bir ricaya evet demek kolaydır. Bitmeyen kaçamaklar takip etmesi daha zor, daha nazik değil.",
          "Doğru. Kimse rahatsız olmasın diye yumuşatıcıları yığ.",
          "Her şeyi kendim yaparım. İstemek her zaman bir yüktür.",
        ],
        0,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu, normal bir ricaya içerleme okumak. Netlik bir nezakettir: sana yardım etmeyi zahmetsiz kılar."
      ),
      c(
        "Bugünkü hamlen.",
        "Tek bir yumuşatıcı ve net bir ricayla iste, sonra üst üste yığmadan cümlenin bitmesine izin ver.",
        "Tek bir yumuşatıcı ve net bir ricayla iste"
      ),
    ],
    challenge: {
      text: "Bugün temiz bir rica yap: bir “lütfen/sağ ol”, sonra dur.",
      sub: "Üst üste yumuşatıcı yok. Söyle ve otursun.",
    },
  },
  {
    index: 6,
    title: "Kontrol noktası: baştan sona kibar bir alışveriş",
    isCheckpoint: true,
    steps: [
      c(
        "Herkese saygı gösteren nezaket.",
        "Özür yerine teşekkür, belirli şükran, “şimdi uygun mu?”, işaretli bir araya giriş, temiz bir rica. Gerçek nezaket karşındakini yükseltir ama seni indirmez: aynı anda sıcaklık ve öz saygı.",
        "aynı anda sıcaklık ve öz saygı",
        "“Zarif bir alışveriş. Git yaşa onu.”"
      ),
      q(
        "Belli ki bir şeyin ortasında olan bir arkadaşından hızlı bir iyilik lazım.",
        "Protokolü çalıştır:",
        [
          "“Pardon, pardon, meşgulsün biliyorum ama, ay, acaba...”",
          "“Bir saniyen olunca kısa bir şey: yapar mısın...? Hep yardım ettiğin için sağ ol.”",
          "Kendin yap. Meşgul bir arkadaşı bölmeye değmez.",
          "“Zaten bana borçlusun. Geçen ayı hatırla?”",
        ],
        1,
        "PROTOKOL ÇALIŞTI",
        "Zamanını kontrol ettin, temiz istedin ve sadece bu seferi değil, alışkanlığa teşekkür ettin. Özür sarmalı seni küçültür, kendini feda etmek beceriyi atlar, borç kartı ise bir iyiliği bir alışverişe çevirir."
      ),
      c(
        "Kendini silmeden sıcaklık.",
        "Amaç asla daha küçük olmak değildi. Buradaki her hamle (teşekkür, zamanlama, temiz ricalar) karşındakini yetenekli, seni de onların zamanına değer biri olarak görür. Asıl protokol budur.",
        "karşındakini yetenekli, seni de onların zamanına değer biri olarak görür"
      ),
      r(
        "Kibar olmak, herkesi önce koymak ve kimseyi rahatsız etmemek demektir.",
        "O düşünceye karşılık ver:",
        [
          "Doğru. İyi terbiye her zaman en sona benim geldiğim anlamına gelir.",
          "Nezaket karşılıklı saygıdır, kendini silmek değil. Hem sıcak olabilir hem de kendi payıma düşen alanı alabilirim.",
          "Zaten terbiye sahtelik. Herkese karşı direkt olurum.",
        ],
        1,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu, nezaketi kendini ihmalle karıştırır ve direktlik salınımı da sıcaklığı tümden atar. En kibar insanlar hem zarif hem sağlam durur, görünmez değil."
      ),
      c(
        "Bugünkü hamlen.",
        "Bütün protokolü çalıştıran bir alışveriş: minnettar, iyi zamanlı, net, küçülmeden. İşte kontrol noktası ve nadir alıntı.",
        "minnettar, iyi zamanlı, net, küçülmeden"
      ),
    ],
    challenge: {
      text: "Bugün tam bir kibar alışveriş yürüt: özür yerine teşekkür, iyi zamanlama, temiz bir rica.",
      sub: "Kontrol noktasını geç ve nadir alıntının kilidini aç.",
    },
  },
];

/* ================= ÜNİTE 5 · Duygu Tanıma I ================= */

const unit5Lessons: SeedLesson[] = [
  {
    index: 1,
    title: "Altı yüz",
    steps: [
      c(
        "Altı duygu, tek yüz.",
        "Araştırmacı Paul Ekman, bütün dünyanın aynı şekilde gösterdiği altı duygu buldu: mutlu, üzgün, kızgın, korkmuş, şaşkın, tiksinmiş. Altısını öğren, herhangi bir kıtada bir yüzü okuyabilirsin.",
        "mutlu, üzgün, kızgın, korkmuş, şaşkın, tiksinmiş",
        "“Herkesin dalgalandırdığı altı bayrak.”"
      ),
      q(
        "Sohbetin ortasında birinin kaşları çatılıp aşağı çekiliyor, dudakları incelerek bastırılıyor.",
        "En olası okuma?",
        [
          "Korku. Gözler faltaşı gibi açık ve donuk.",
          "Derin odak. Sadece senin noktana konsantre oluyor.",
          "Tırmanan bir sinir. Gevşe ya da bir yokla.",
          "Üzüntü. Teselli moduna geçme vakti.",
        ],
        2,
        "DOĞRU OKUNDU",
        "Aşağı çekilmiş kaşlar artı bastırılmış dudaklar öfkenin imzasıdır. Odak benzer görünebilir ama gergin ağız asıl ipucu: konsantrasyon dudakları inceltmez. Erken fark etmek büyümeden ayar yapmanı sağlar."
      ),
      c(
        "Kaş ve ağız konuşur.",
        "Bir çizelgeye ihtiyacın yok. İki bölgeyi izle: kaşlar (yukarı = şaşkınlık ya da korku, aşağı = öfke, iç köşeler yukarı = üzüntü) ve ağız (gergin, kıvrık ya da açık). İki bölge, sinyalin çoğu.",
        "İki bölgeyi izle: kaşlar"
      ),
      r(
        "İnsanları okumada kötüyümdür işte. Kimsenin ne hissettiğini asla bilemem.",
        "O düşünceye karşılık ver:",
        [
          "Doğru. Bazı insanlar yüz okuyamaz, o da benim.",
          "Yüz okumak, bilinen ipuçlarıyla bir beceridir, altıncı his değil. Altısını herkes gibi öğrenebilirim.",
          "Bunun yerine sürekli herkese “ne hissediyorsun?” diye sorarım.",
        ],
        1,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu sabit zihniyet etiketi. Duygu tanıma pratikle gelişir. Sana daha önce ipuçları hiç gösterilmedi sadece."
      ),
      c(
        "Bugünkü hamlen.",
        "Bugün gerçek bir yüzdeki duyguyu adlandır (kaşlar ve ağız) ve altıdan hangisi olduğunu tahmin et. Rol yapmana gerek yok, sadece fark et.",
        "gerçek bir yüzdeki duyguyu adlandır"
      ),
    ],
    challenge: {
      text: "Bugün bir yüzdeki duyguyu adlandır. Ekman'ın altısından seç.",
      sub: "Kaşları ve ağzı oku. Sadece fark et.",
    },
  },
  {
    index: 2,
    title: "Gerçek gülümseme mi kibar gülümseme mi",
    steps: [
      c(
        "Gözler ele verir.",
        "Kibar bir gülümseme ağızda yaşar. Gerçek olan, Duchenne gülümsemesi, gözleri kırıştırır ve yanakları kaldırır. Gözler düz kalıyorsa, gülümseme nezakettir, sevinç değil.",
        "gözleri kırıştırır ve yanakları kaldırır",
        "“Dişlere değil, gözlere bak.”"
      ),
      q(
        "Bir espri patlatıyorsun; gülümsüyor ama gözler kımıldamıyor ve hızlıca eski haline dönüyor.",
        "Bu sana ne söylüyor?",
        [
          "Büyük başarı. Bayıldılar, bir tane daha zorla.",
          "Nefret ettiler ve saklıyorlar. Konuşmayı iptal et.",
          "Anlamadılar. Espriyi açıkla.",
          "Kibar gülümseme, gerçek değil. Onu “idare eder” diye oku, “devam” diye değil.",
        ],
        3,
        "DOĞRU OKUNDU",
        "Geri sıçrayan, yalnızca ağızdaki bir gülümseme nezakettir, ne fazla ne eksik. Alkış değil, nefret değil, espriyi açıklamak da herkese anı yeniden pazarlatır."
      ),
      c(
        "Tek bir gülümsemeyi fazla okuma.",
        "Düz bir gülümseme reddediş değildir. İnsanlar yorgun, dalgın ya da sadece kibar olabilir. Bir veri noktasıdır, bir hüküm değil. Oku, nazikçe ayar yap ve işleri hafif tut.",
        "Bir veri noktasıdır, bir hüküm değil"
      ),
      r(
        "Gülümsemesi içten değilse, gizliden gizliye benden hoşlanmıyordur.",
        "O düşünceye karşılık ver:",
        [
          "Kibar bir gülümseme genelde yorgun ya da meşgul demektir, düşman değil. Çoğu düz yüzün benimle hiçbir ilgisi yok.",
          "Doğru. Kibar bir gülümseme bana katlanamadığı anlamına gelir.",
          "Düzgün gülmeyen kimsenin yanında espri yapmayı bırakırım.",
          "Onları üç espri daha ile test edip sonuçları puanlarım.",
        ],
        0,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu kişiselleştirme: nötr bir ipucunu, hakkındaki gizli bir hüküm olarak okumak. Düz olması sana karşı olduğu anlamına gelmez."
      ),
      c(
        "Bugünkü hamlen.",
        "Bugün bir gülümsemede gözleri izle. Gerçek mi? Yaklaş. Kibar mı? Gevşe, sevilmediğine dair bir hikaye kurmadan.",
        "bir gülümsemede gözleri izle"
      ),
    ],
    challenge: {
      text: "Bugün bir gülümsemede gözleri oku: gerçek mi yoksa sadece kibar mı?",
      sub: "Kırışan gözler gerçek demek. Düz olan nezaket demek, bir hüküm değil.",
    },
  },
  {
    index: 3,
    title: "Kelimeden çok ton",
    steps: [
      c(
        "Nasıl, ne'ye baskındır.",
        "“İyiyim” iyi, öfkeli ya da yıkılmış anlamına gelebilir. Kelimeler pek önemli değil. Asıl mesajı ton, tempo ve ses taşır. Kelimeler ve ton çelişirse, tona inan.",
        "Kelimeler ve ton çelişirse, tona inan",
        "“Sadece sözlere değil, müziğe kulak ver.”"
      ),
      q(
        "“Yok, sorun değil, ne istersen yap.” Düz, kesik, kısık.",
        "Aslında ne oluyor?",
        [
          "Gerçekten sorun yok. Kelimeleri olduğu gibi al.",
          "Ton sorun var diyor. Devam etmek yerine nazikçe bir yokla.",
          "Kararsızlar. Onlar adına seç ve devam et.",
          "Seni sınıyorlar. Oyunu doğrudan yüzlerine vur.",
        ],
        1,
        "DOĞRU OKUNDU",
        "“Sorun değil” üstüne düz ve kesik bir ton klasik bir uyumsuzluktur: ton asıl sinyal, kelimeler ise örtü. Bastırıp gitmek onların iyi niyetini harcar, “beni sınıyorsun” ise bir duyguyu bir suçlamaya çevirir."
      ),
      c(
        "Sinyale ayarla.",
        "Yükselen, hızlı, yüksek: heyecanlı ya da stresli. Alçalan, yavaş, kısık: yorgun ya da keyifsiz. Bunu yakın arkadaşlarında zaten duyuyorsun. Beceri, bunu bilerek ve erken fark etmek.",
        "bilerek ve erken fark etmek"
      ),
      r(
        "İnsanları söyledikleriyle almalıyım. Tonlarını yorumlamak burnunu sokmak ya da haddini aşmaktır.",
        "O düşünceye karşılık ver:",
        [
          "Doğru. Tonu yorumlamak haddini aşmaktır.",
          "Bundan sonra herkesin söylediği her heceyi analiz ederim.",
          "Tonu fark etmek zihin okuma değil. Temel bir dikkattir. Varsaymak yerine sessizce fark edip yoklayabilirim.",
        ],
        2,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu, gerçek bir beceriyi geçersiz kılmak. Uyumsuzluğu duymak müdahale değildir; onu görmezden gelmek insanları kaçırma şeklindir."
      ),
      c(
        "Bugünkü hamlen.",
        "Birinin tonunun kelimeleriyle uyuşmadığı bir anı yakala. Tona güven ve ona karşılık ver.",
        "Tona güven"
      ),
    ],
    challenge: {
      text: "Bugün bir kelime/ton uyumsuzluğu yakala ve tona güven.",
      sub: "Düz söylenen “iyiyim” iyi değildir. Fark et.",
    },
  },
  {
    index: 4,
    title: "Meşgulü, yorgunu, tükenmişi oku",
    steps: [
      c(
        "Durum, içerikten önce gelir.",
        "Birinin ne demek istediğinden önce, nasıl olduğunu oku. Omuzlar, enerji, hız, göz teması: hepsi meşgul, yorgun ya da tükenmiş olduğunu, kelimeler itiraf etmeden çok önce yayınlar.",
        "nasıl olduğunu oku",
        "“Fişe takmadan önce pili kontrol et.”"
      ),
      q(
        "Biri tek kelimelik cevaplar veriyor, ekranına bakıyor, yarı dönük.",
        "Okuma ne?",
        [
          "Kaba. Ulaşmak için daha sert bastır.",
          "Utangaç. Sessizliği kendi enerjinle doldur.",
          "Şu an bant genişliği düşük. Kısa tut ya da sonra yakala.",
          "Neşelendirilmesi lazım. En iyi hikayenin vakti.",
        ],
        2,
        "DOĞRU OKUNDU",
        "Kısa cevaplar, kayan gözler, dönük bir beden: bu “şimdi olmaz”, “daha çok çabala” değil. Diğer her seçenek, zaten yüzde 5'te olan bir pile daha fazla talep pompalar."
      ),
      c(
        "Ricanı onların piline göre ayarla.",
        "Boşta çalışan biri büyük bir konuşmayı kaldıramaz ve bu onun bant genişliğiyle ilgilidir, sana dair hisleriyle değil. Ricayı küçült ya da gösterge yükseldiğinde geri dön.",
        "Ricayı küçült"
      ),
      r(
        "Uzak duruyorsa, bana kızgın olduğu içindir.",
        "O düşünceye karşılık ver:",
        [
          "Doğru. Uzak durmak, bir şeyi yanlış yaptım demek.",
          "Ona hemen şimdi bana kızgın olup olmadığını doğrudan sorarım.",
          "Bu gece son üç konuşmamızı ipuçları için kafamda oynatırım.",
          "Uzak durmak genelde yorgun ya da boğulmuş demektir. Onun düşük pili nadiren benimle ilgili bir mesajdır.",
        ],
        3,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu yine kişiselleştirme ve hem sorgu hem gece yarısı tekrar oynatma bunu besler. Çoğu “kapanık” enerji senin değerinle değil, onların günüyle ilgilidir."
      ),
      c(
        "Bugünkü hamlen.",
        "Konuşmadan önce bir kişinin pilini oku (meşgul, yorgun, tükenmiş?) ve ricanı ona göre boyutlandır.",
        "ricanı ona göre boyutlandır"
      ),
    ],
    challenge: {
      text: "Bugün dalmadan önce bir kişinin enerjisini oku (meşgul, yorgun ya da tükenmiş).",
      sub: "Ricanı kendi gündemine değil, onun piline göre boyutlandır.",
    },
  },
  {
    index: 5,
    title: "Varsayma, yokla",
    steps: [
      c(
        "Bir okuma bir tahmindir, gerçek değil.",
        "İpuçları işaret eder; kanıtlamaz. En güçlü hamle kendinden emin bir teşhis değildir. Nazik bir yoklamadır: “bugün biraz sessiz gibisin, her şey yolunda mı?” Okumanı sun, bırak onlar onaylasın.",
        "Okumanı sun, bırak onlar onaylasın",
        "“Yumuşakça adını koy, sonra dinle.”"
      ),
      q(
        "Bir arkadaşın bütün akşam alışılmadık şekilde durgun.",
        "En iyi hamle?",
        [
          "“Bu akşam biraz keyifsiz gibisin. Bir şey mi var?”",
          "Sana kızgın olduğuna karar ver ve karşılık olarak soğu.",
          "“Bugün senin neyin var?” Direkt ve verimli.",
          "Onu bundan çıkarmak için kendi enerjini yükselt.",
        ],
        0,
        "YOKLANDI, VARSAYILMADI",
        "Yumuşak, temkinli bir yoklama ona açılmak ya da geçiştirmek için yer verir. “Neyin var senin” soru kılığında bir suçlamadır, zoraki güneş ışığı ise ona ruh halinin bir sorun olduğunu söyler."
      ),
      c(
        "Temkinli olan kazanır.",
        "“Sanki”, “yanılıyor olabilirim ama”, “iyi misin?” ile başla. Temkinli dil, “aslında evet” ya da “yok, iyiyim” demeyi kolaylaştırır. Kesinlik insanları köşeye sıkıştırır.",
        "Temkinli dil"
      ),
      r(
        "İyi misin diye sorup yanılırsam, aptal görünürüm ve ortamı tuhaflaştırırım.",
        "O düşünceye karşılık ver:",
        [
          "Doğru. Hiçbir şey demeyip içimden tahmin etmek daha güvenli.",
          "Nazik bir “iyi misin?” yanılsam bile özen olarak oturur. Yanılmış ama nazik olmak, sessiz ama soğuk olmaktan iyidir.",
          "Bir şeyin yanlış olduğundan yüzde yüz emin olana kadar sormayı beklerim.",
        ],
        1,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu, özenli bir soruyu felaketleştirmek. Neredeyse kimse “iyi misin?”e içerlemez. Sorduğunu hatırlar. (Ve yüzde yüz kesinlik hiç gelmez.)"
      ),
      c(
        "Bugünkü hamlen.",
        "Bugün bir okumayı nazik bir yoklamaya çevir: fark ettiğini temkinli bir şekilde sun, sonra cevabı dinle.",
        "fark ettiğini temkinli bir şekilde sun"
      ),
    ],
    challenge: {
      text: "Bugün bir okumayı nazik bir yoklamaya çevir: “... gibisin, her şey yolunda mı?”",
      sub: "Temkinli ol, sonra dinle. Bırak onaylasınlar.",
    },
  },
  {
    index: 6,
    title: "Kontrol noktası: nazikçe yoklanan bir okuma",
    isCheckpoint: true,
    steps: [
      c(
        "Okumayı bir araya getir.",
        "Altı yüz, gerçek gülümseme, kelimeden çok ton, pil okuması, nazik yoklama. Duygu tanıma, erken fark etmek, sonra da sormaya yetecek kadar hafif tutmaktır.",
        "erken fark etmek, sonra da sormaya yetecek kadar hafif tutmak",
        "“Nazikçe yoklanan bir okuma. Git bul onu.”"
      ),
      q(
        "Bir iş arkadaşın “evet, her şey yolunda” diyor. Düz ton, yorgun gözler, gerçek olmayan bir gülümseme.",
        "Okumayı çalıştır:",
        [
          "“Her şey yolunda”yı olduğu gibi al ve devam et.",
          "“Belli ki her şey yolunda DEĞİL. Anlat bana.”",
          "Emin olmak için endişeni yöneticisine bildir.",
          "“Bitkin görünüyorsun. Uzun bir gün mü? Anlatmak zorunda değilsin.”",
        ],
        3,
        "OKUMA ÇALIŞTI",
        "Tonu ve düz gülümsemeyi yakaladın, düşük pil okudun ve kolay bir çıkışla nazikçe yokladın. Olduğu gibi almak onu kaçırır, yüzleşme köşeye sıkıştırır, üste bildirmek ise tümüyle atlar."
      ),
      c(
        "Okumak, yargıya değil bağa hizmet eder.",
        "İnsanları okumanın amacı onları analiz etmek ya da açık yakalamak değildir. Onlarla oldukları yerde buluşmaktır. Fark et, yumuşat, yokla ve gerisini onların anlatmasına izin ver.",
        "Onlarla oldukları yerde buluşmaktır"
      ),
      r(
        "Şimdi her yüzü fazla düşünüp donacağım, herkesi gizli duygular için tarayacağım.",
        "O düşünceye karşılık ver:",
        [
          "Doğru. Bu bana panik yapacak bir şey daha veriyor.",
          "Bu, arka planda çalışır, bir arkadaşta ton duymak gibi. Fark et, önemliyse yokla, devam et. Tarama gerekmez.",
          "Herkesin ruh halinin, saat başı güncellenen bir tabloyu kafamda tutarım.",
        ],
        1,
        "DÜŞÜNCEYE MEYDAN OKUNDU",
        "Bu, nazik bir beceriyi bir yüke felaketleştirmek. Duygu okuma tekrarla daha sessiz ve daha otomatik olur, daha gürültülü değil."
      ),
      c(
        "Bugünkü hamlen.",
        "Bugün bir doğru okuma yap ve nazikçe yokla: bir yüz, bir ton ya da bir pil, sonra yumuşak bir soru. İşte kontrol noktası ve nadir alıntı.",
        "bir doğru okuma"
      ),
    ],
    challenge: {
      text: "Bugün nazik, doğru bir okuma yap: duyguyu fark et, sonra onu kibarca yokla.",
      sub: "Kontrol noktasını geç ve nadir alıntının kilidini aç.",
    },
  },
];

/* ================= alıntılar ================= */

export const quotesTr: { unitId: number; lessonIndex: number; text: string; author: string; authorNote: string }[] = [
  { unitId: 1, lessonIndex: 1, text: "İlginç olmak için ilgili ol.", author: "Dale Carnegie", authorNote: "merak üzerine" },
  { unitId: 1, lessonIndex: 2, text: "İlk izlenim bırakmak için ikinci bir şansın asla olmaz.", author: "Will Rogers", authorNote: "ilk temas üzerine" },
  { unitId: 1, lessonIndex: 3, text: "Bir kişinin adı, o kişi için, herhangi bir dildeki en tatlı sestir.", author: "Dale Carnegie", authorNote: "isimler üzerine" },
  { unitId: 1, lessonIndex: 4, text: "Doğru kelime etkili olabilir ama hiçbir kelime, tam yerinde bir duraksama kadar etkili olmamıştır.", author: "Mark Twain", authorNote: "zamanlama üzerine" },
  { unitId: 1, lessonIndex: 5, text: "Başlama sanatı büyüktür ama bitirme sanatı daha da büyüktür.", author: "H. W. Longfellow", authorNote: "çıkışlar üzerine" },
  { unitId: 1, lessonIndex: 6, text: "Burada yabancı yoktur; sadece henüz tanışmadığın dostlar vardır.", author: "W. B. Yeats", authorNote: "nadir olan" },
  { unitId: 2, lessonIndex: 1, text: "Gözlerin her yerde tek bir dili vardır.", author: "George Herbert", authorNote: "göz teması üzerine" },
  { unitId: 2, lessonIndex: 2, text: "Beden asla yalan söylemez.", author: "Martha Graham", authorNote: "duruş üzerine" },
  { unitId: 2, lessonIndex: 3, text: "İki kulağımız ve bir ağzımız var, böylece konuştuğumuzun iki katı dinleyebiliriz.", author: "Epictetus", authorNote: "dinlemek üzerine" },
  { unitId: 2, lessonIndex: 4, text: "Nerede olursan ol, tümüyle orada ol.", author: "Jim Elliot", authorNote: "anda olmak üzerine" },
  { unitId: 2, lessonIndex: 5, text: "Barış bir gülümsemeyle başlar.", author: "Mother Teresa", authorNote: "yüzün üzerine" },
  { unitId: 2, lessonIndex: 6, text: "Bütün insani ihtiyaçların en temeli, anlama ve anlaşılma ihtiyacıdır.", author: "Ralph Nichols", authorNote: "nadir olan" },
  { unitId: 3, lessonIndex: 1, text: "Konuşma bir daireler oyunudur.", author: "Ralph Waldo Emerson", authorNote: "sıra almak üzerine" },
  { unitId: 3, lessonIndex: 2, text: "Konuşmanın büyük armağanı, onu kendimiz sergilemekten çok, başkalarından çekip çıkarmakta yatar.", author: "Jean de La Bruyère", authorNote: "vermek üzerine" },
  { unitId: 3, lessonIndex: 3, text: "Bir insanı cevaplarından çok sorularıyla yargıla.", author: "Voltaire", authorNote: "sorular üzerine" },
  { unitId: 3, lessonIndex: 4, text: "Konuşacaksan net konuş; bırakmadan önce her kelimeyi yont.", author: "Oliver Wendell Holmes Sr.", authorNote: "tempo üzerine" },
  { unitId: 3, lessonIndex: 5, text: "Çoğu insan anlamak niyetiyle dinlemez; cevap vermek niyetiyle dinler.", author: "Stephen R. Covey", authorNote: "bitirmelerine izin vermek üzerine" },
  { unitId: 3, lessonIndex: 6, text: "İnsanlar konuşurken, tümüyle dinle.", author: "Ernest Hemingway", authorNote: "nadir olan" },
  { unitId: 4, lessonIndex: 1, text: "Özür güzel bir parfümdür; en sakar anı bile zarif bir armağana dönüştürebilir.", author: "Margaret Lee Runbeck", authorNote: "özür üzerine" },
  { unitId: 4, lessonIndex: 2, text: "Şükran, kalbin hafızasıdır.", author: "Jean Baptiste Massieu", authorNote: "teşekkür üzerine" },
  { unitId: 4, lessonIndex: 3, text: "Meşgul olmak yetmez; asıl soru şu: neyle meşgulüz?", author: "Henry David Thoreau", authorNote: "zamanlama üzerine" },
  { unitId: 4, lessonIndex: 4, text: "Nezaket, cesaret kadar bir beyefendi işaretidir.", author: "Theodore Roosevelt", authorNote: "nezaket üzerine" },
  { unitId: 4, lessonIndex: 5, text: "Kibarlık, insanlığın çiçeğidir.", author: "Joseph Joubert", authorNote: "kibarlık üzerine" },
  { unitId: 4, lessonIndex: 6, text: "Kibarlık ve başkalarını düşünmek, kuruş yatırıp dolar geri almak gibidir.", author: "Thomas Sowell", authorNote: "nadir olan" },
  { unitId: 5, lessonIndex: 1, text: "Yüz zihnin bir resmidir ve gözler onun tercümanıdır.", author: "Cicero", authorNote: "yüzler üzerine" },
  { unitId: 5, lessonIndex: 2, text: "Kırışıklıklar yalnızca gülümsemelerin nerede olduğunu göstermeli.", author: "Mark Twain", authorNote: "gülümsemeler üzerine" },
  { unitId: 5, lessonIndex: 3, text: "İletişimde en önemli şey, söylenmeyeni duymaktır.", author: "Peter Drucker", authorNote: "ton üzerine" },
  { unitId: 5, lessonIndex: 4, text: "İnsanlar ne söylediğini unutur ama onlara nasıl hissettirdiğini asla unutmaz.", author: "Maya Angelou", authorNote: "uyum üzerine" },
  { unitId: 5, lessonIndex: 5, text: "İletişimdeki en büyük sorun, iletişimin gerçekleştiği yanılsamasıdır.", author: "George Bernard Shaw", authorNote: "yoklama üzerine" },
  { unitId: 5, lessonIndex: 6, text: "İnsanlarla ilgilenirken, mantık yaratıklarıyla değil, duygu yaratıklarıyla ilgilendiğini unutma.", author: "Dale Carnegie", authorNote: "nadir olan" },
];

export const courseTr = { title: "Sosyal Beceriler", tagline: "İlk merhabadan salonu yönetmeye" };

export const unitsTr: { id: number; levelTitle: string; title: string; tagline: string; canDo: string; lessons: SeedLesson[] }[] = [
  {
    id: 1, levelTitle: "Hayatta Kalma Sosyalliği",
    title: "İlk Temas", tagline: "Merhabalar, isimler ve rahat çıkışlar",
    canDo: "İlk bir merhabayı açabilir, sürdürebilir ve bitirebilir", lessons: unit1Lessons,
  },
  {
    id: 2, levelTitle: "Hayatta Kalma Sosyalliği",
    title: "Dinleyen Beden", tagline: "Kelimelerden önce anda olmak",
    canDo: "Bir konuşmada bakabilir, dönebilir ve anda kalabilir", lessons: unit2Lessons,
  },
  {
    id: 3, levelTitle: "Hayatta Kalma Sosyalliği",
    title: "Konuşmanın Mekaniği 101", tagline: "Sıra al ve akışı sürdür",
    canDo: "İki yönlü bir konuşmayı ileri geri rali halinde tutabilir", lessons: unit3Lessons,
  },
  {
    id: 4, levelTitle: "Hayatta Kalma Sosyalliği",
    title: "Nezaket Protokolü", tagline: "Küçülmeden sıcak olmak",
    canDo: "Aşırı özür dilemeden zarif ve net olabilir", lessons: unit4Lessons,
  },
  {
    id: 5, levelTitle: "Hayatta Kalma Sosyalliği",
    title: "Duygu Tanıma I", tagline: "Yüzü, tonu ve pili oku",
    canDo: "Temel bir duyguyu okuyabilir ve onu kibarca yoklayabilir", lessons: unit5Lessons,
  },
];
