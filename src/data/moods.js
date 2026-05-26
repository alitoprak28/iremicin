import { restaurantPlans } from "./restaurants.js"
import { sportMood } from "./sportPlans.js"

const PLAN_NOTES = [
  "Plan önerisi",
]

const MOOD_DEFAULT_VIBES = {
  romantic: ["romantic"],
  fun: ["fun"],
  calm: ["calm"],
  food: ["fun"],
  sea: ["sea"],
  adventure: ["spontaneous"],
  sport: ["sporty", "fun"],
  attention: ["calm", "romantic"],
  indecisive: ["spontaneous"],
}

const DISTANCE_KEYWORDS = {
  drive: [
    "arabayla",
    "bellapais",
    "long beach",
    "karpaz",
    "marina",
    "sehir turu",
    "manzara",
    "plaj",
    "sahil turu",
    "yol boyunca",
    "uzak",
    "sahil tarafina",
    "iskele",
    "magusa",
    "gazimagusa",
  ],
  route: [
    "rota",
    "tur",
    "kesif",
    "gezisi",
    "kafe hopping",
    "sahil sahil",
    "mini kacamak",
    "turist gibi",
    "yazi tura",
    "fotograf avi",
    "durak",
    "mini piknik",
    "yuruyus yolu",
    "doga rotasi",
    "kort",
  ],
  nearby: [
    "yakin",
    "kafe",
    "tatlici",
    "market",
    "kahve",
    "sinema",
    "bowling",
    "avm",
    "oyun salonu",
    "sahil",
    "burgerci",
    "kahvaltici",
    "park",
    "spor salonu",
    "basket sahasi",
  ],
  mid: ["girne", "lefkosa", "bellapais", "marina", "long beach", "manzara", "restoran"],
}

const TIME_KEYWORDS = {
  morning: ["sabah", "kahvalti", "kruvasan"],
  afternoon: ["ogleden sonra", "aksamustu"],
  sunset: ["gun batimi", "sunset"],
  night: ["gece", "aksam", "yildiz", "gece gokyuzu"],
}

const VIBE_KEYWORDS = {
  calm: [
    "sakin",
    "sessiz",
    "kahve",
    "sohbet",
    "dalgalari dinleyelim",
    "oturalim",
    "piknik",
    "kitapci",
    "manzara",
  ],
  fun: [
    "bowling",
    "challenge",
    "oyun",
    "arcade",
    "canli muzik",
    "karaoke",
    "escape room",
    "festival",
    "lunapark",
    "tiktok",
    "turnuva",
    "bilardo",
    "langirt",
    "masa tenisi",
    "sinema",
    "waffle",
    "avm",
    "raket",
    "voleybol",
    "basket",
    "challenge",
  ],
  romantic: [
    "romantik",
    "gun batimi",
    "sunset",
    "cicek",
    "el ele",
    "goz goze",
    "not",
    "surpriz",
    "fotografimi cek",
    "sadece ikimiz",
    "sarilip",
    "tatli date",
  ],
  spontaneous: [
    "random",
    "rastgele",
    "rota",
    "kesif",
    "plansiz",
    "harita",
    "gorev",
    "yazi tura",
    "bilinmeyen",
    "gizli",
    "kacamak",
    "turist gibi",
  ],
  sea: [
    "sahil",
    "deniz",
    "marina",
    "plaj",
    "long beach",
    "dalgalari",
    "sahil turu",
    "yuz",
    "gun batimi sahili",
    "kiyi",
  ],
  sporty: [
    "spor",
    "yuruyus",
    "kosu",
    "esneme",
    "bisiklet",
    "badminton",
    "voleybol",
    "basket",
    "tenis",
    "padel",
    "gym",
    "antrenman",
    "saglikli",
    "challenge",
    "plank",
  ],
}

function normalizeText(value) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
}

function includesKeyword(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword))
}

function inferPlanTags(moodId, plan) {
  const text = normalizeText(
    [plan.title, plan.place, plan.vibe, ...(plan.steps ?? [])]
      .filter(Boolean)
      .join(" "),
  )

  const vibeTags = new Set(MOOD_DEFAULT_VIBES[moodId] ?? [])
  const distanceTags = new Set()
  const timeTags = new Set()

  Object.entries(VIBE_KEYWORDS).forEach(([tag, keywords]) => {
    if (includesKeyword(text, keywords)) {
      vibeTags.add(tag)
    }
  })

  Object.entries(DISTANCE_KEYWORDS).forEach(([tag, keywords]) => {
    if (includesKeyword(text, keywords)) {
      distanceTags.add(tag)
    }
  })

  Object.entries(TIME_KEYWORDS).forEach(([tag, keywords]) => {
    if (includesKeyword(text, keywords)) {
      timeTags.add(tag)
    }
  })

  if (!distanceTags.size) {
    distanceTags.add(moodId === "adventure" ? "route" : "mid")
  }

  if (!timeTags.size) {
    timeTags.add(moodId === "sea" ? "sunset" : "afternoon")
  }

  return {
    distanceTags: Array.from(distanceTags),
    timeTags: Array.from(timeTags),
    vibeTags: Array.from(vibeTags),
  }
}

const rawMoods = [
  {
    id: "romantic",
    emoji: "❤️",
    title: "Romantizm istiyorum",
    tone: "rose",
    description: "Bugün ilgi, sevgi, güzel ortam ve tatlı bir date istiyorum.",
    plans: [
      {
        title: "🌅 Sunset Date Istiyorum",
        steps: [
          "Bellapais'e gidelim",
          "Gun batimini izleyelim",
          "Fotografimi cek",
          "Sonra kahve icelim",
        ],
      },
      {
        title: "🌃 Marina Aksami Istiyorum",
        steps: [
          "Girne Marina'da yuruyelim",
          "Tatli / kahve molasi verelim",
          "Sahilde oturalim",
          "Sakin bir playlist acalim",
        ],
      },
      {
        title: "🌹 Surpriz Yap Bana",
        steps: [
          "Bana kucuk bir surpriz hazirla",
          "Kucuk bir cicek / tatli al",
          "Manzarali bir yere gidelim",
          "Gunu romantik bitirelim",
        ],
      },
      {
        title: "📸 Fotograf Date'i Istiyorum",
        steps: [
          "Guzel giyinelim",
          "Fotograf cekilecek bir yere gidelim",
          "Kahve icelim",
          "En guzel fotografimi birlikte secelim",
        ],
      },
      {
        title: "☕ Kahve + Goz Goze Sohbet Istiyorum",
        steps: [
          "Sakin ve tatli bir kafe secelim",
          "Karsilikli oturalim",
          "Telefonlari biraz birakalim",
          "Uzun uzun konusalim",
        ],
      },
      {
        title: "🌙 Gece Yuruyusu Istiyorum",
        steps: [
          "Guvenli ve guzel isikli bir yer secelim",
          "El ele yuruyelim",
          "Tatli / icecek alalim",
          "Gunu sakin bir sohbetle bitirelim",
        ],
      },
      {
        title: "🍰 Tatli Date'i Istiyorum",
        steps: [
          "Guzel bir tatliciya gidelim",
          "Ben tatliyi seceyim",
          "Sen de icecegi sec",
          "Sonra kisa bir yuruyus yapalim",
        ],
      },
      {
        title: "📝 Bana Not Yazmani Istiyorum",
        steps: [
          "Kucuk bir not hazirla",
          "Kahve icerken bana ver",
          "Sonra birlikte yuruyus yapalim",
          "Notu gunun hatirasi yapalim",
        ],
      },
      {
        title: "🌸 Cicekli Mini Date Istiyorum",
        steps: [
          "Bana kucuk bir cicek al",
          "Sakin bir kafeye gidelim",
          "Fotograf cekelim",
          "Sonra sahilde yuruyelim",
        ],
      },
      {
        title: "🧺 Romantik Piknik Istiyorum",
        steps: [
          "Marketten icecek ve atistirmalik alalim",
          "Parka veya sahile gidelim",
          "Beraber oturup sohbet edelim",
          "Gun batimina kadar kalalim",
        ],
      },
      {
        title: "🎧 Playlist Date Istiyorum",
        steps: [
          "Ikimiz de 3 sarki secelim",
          "Sahilde / parkta oturalim",
          "Sarkilari sirayla dinleyelim",
          "Her sarki icin neden sectigimizi anlatalim",
        ],
      },
      {
        title: "💌 Ani Date'i Istiyorum",
        steps: [
          "Daha once guzel animiz olan bir yere gidelim",
          "Orada fotograf cekelim",
          "O gunu konusalim",
          "Yeni bir kucuk ani ekleyelim",
        ],
      },
      {
        title: "🌊 Sahilde Romantik Oturmak Istiyorum",
        steps: [
          "Sahile gidelim",
          "Icecek alalim",
          "Yan yana oturup dalgalari dinleyelim",
          "Sonra kisa yuruyus yapalim",
        ],
      },
      {
        title: "🏛️ Bellapais Romantik Tur Istiyorum",
        steps: [
          "Bellapais sokaklarinda yuruyelim",
          "Manzara fotografi cekelim",
          "Kucuk bir kafede mola verelim",
          "Gun batimina yakin oturalim",
        ],
      },
      {
        title: "✨ Bana Guzel Bir Gun Planla",
        steps: [
          "Once kahve icelim",
          "Sonra fotograf cekilecek bir yere gidelim",
          "Tatli yiyelim",
          "Gunu manzarali bir yerde bitirelim",
        ],
      },
      {
        title: "🎁 Kucuk Surpriz Kutusu Istiyorum",
        steps: [
          "Kucuk cikolata / not / minik hediye hazirla",
          "Bulusunca bana ver",
          "Sonra sakin bir kafeye gidelim",
          "Gunu tatli bir yuruyusle bitirelim",
        ],
      },
      {
        title: "🫶 El Ele Gezelim Istiyorum",
        steps: [
          "Yakin ve guzel bir rota secelim",
          "El ele yuruyelim",
          "Yolda icecek alalim",
          "Guzel bir yerde oturup konusalim",
        ],
      },
      {
        title: "🌌 Yildiz / Gece Gokyuzu Istiyorum",
        steps: [
          "Isiklarin az oldugu guvenli bir yer secelim",
          "Bir seyler icelim",
          "Gokyuzune bakip konusalim",
          "Gunu sakin bitirelim",
        ],
      },
      {
        title: "🥐 Tatli Sabah Date'i Istiyorum",
        steps: [
          "Sabah guzel bir kahvalti / kruvasan mekani secelim",
          "Kahve icelim",
          "Kisa yuruyus yapalim",
          "Gunun ilk fotografini cekelim",
        ],
      },
      {
        title: "🧁 Benim Sectigim Tatliciya Gidelim",
        steps: [
          "Tatliciyi ben seceyim",
          "Sen kahveyi sec",
          "Tatlilari paylasalim",
          "Sonra yakin bir yerde yuruyelim",
        ],
      },
      {
        title: "🪄 Surpriz Rota Istiyorum",
        steps: [
          "Bana sadece nasil giyinmem gerektigini soyle",
          "Yakin ve guzel bir yer sec",
          "Gidince plani acikla",
          "Gunu kahve veya tatliyla bitirelim",
        ],
      },
      {
        title: "💕 Sadece Ikimiz Olsun Istiyorum",
        steps: [
          "Kalabalik olmayan bir yer secelim",
          "Sessiz bir masa bulalim",
          "Birbirimize gunumuzu anlatalim",
          "Sonra kisa yuruyus yapalim",
        ],
      },
      {
        title: "🚗 Gece Sahil Turu Istiyorum",
        steps: [
          "Birlikte arabayla sahil tarafina gidelim",
          "Guzel bir noktada durup icecek alalim",
          "Sakin playlist acalim",
          "Sahilde kisa yuruyus yapalim",
        ],
      },
      {
        title: "🌄 Manzaraya Gidelim Istiyorum",
        steps: [
          "Manzarali bir nokta secelim",
          "Birlikte arabayla gidelim",
          "Fotograf cekelim",
          "Sonra kahveyle gunu bitirelim",
        ],
      },
    ],
  },
  {
    id: "fun",
    emoji: "🎉",
    title: "Eğlenmek istiyorum",
    tone: "pop",
    description:
      "Evde durmak istemiyorum, hareketli, komik ve enerjik bir şey yapalım.",
    plans: [
      {
        title: "🎳 Bowling'e Gidelim",
        steps: [
          "Bowling oynayalim",
          "Kaybeden tatli ismarlasin",
          "Sonra yemek yiyelim",
          "Kisa sahil yuruyusu yapalim",
        ],
      },
      {
        title: "🛍️ AVM Challenge Yapmak Istiyorum",
        steps: [
          "AVM'ye gidelim",
          "Birbirimize kucuk hediye secelim",
          "Kahve icelim",
          "Fotograf cekilelim",
        ],
      },
      {
        title: "🎮 Oyun Gunu Istiyorum",
        steps: [
          "Arcade / oyun salonuna gidelim",
          "Yaris oyunu oynayalim",
          "Kaybedene ceza verelim",
          "Sonra waffle yiyelim",
        ],
      },
      {
        title: "🎵 Canli Muzik Istiyorum",
        steps: [
          "Canli muzik olan bir yere gidelim",
          "Bir seyler yiyelim",
          "Sarkilara eslik edelim",
          "Sonra kisa yuruyus yapalim",
        ],
      },
      {
        title: "🎤 Karaoke Yapmak Istiyorum",
        steps: [
          "Karaoke olan bir mekan bulalim",
          "Herkes bir sarki secsin",
          "Kaybeden / utanan tatli ismarlasin",
          "Sonra kahve icip performanslari puanlayalim",
        ],
      },
      {
        title: "🧩 Escape Room Istiyorum",
        steps: [
          "Escape room'a gidelim",
          "Beraber ipuclarini cozelim",
          "Cikamazsak da dalga gecelim",
          "Sonra yemek yiyelim",
        ],
      },
      {
        title: "🎲 Oyun Kafeye Gidelim",
        steps: [
          "Board game / oyun kafeye gidelim",
          "Birlikte masa oyunu secelim",
          "Kaybedene kucuk ceza verelim",
          "Tatli veya icecekle bitirelim",
        ],
      },
      {
        title: "📸 Fotograf Kabini / Polaroid Gunu",
        steps: [
          "Fotograf kabini olan bir yere gidelim",
          "Komik pozlar verelim",
          "En kotu pozu favori secelim",
          "Sonra kahve icelim",
        ],
      },
      {
        title: "🍿 Sinema + Tatli Istiyorum",
        steps: [
          "Komedi ya da romantik film secelim",
          "Filmden once atistirmalik alalim",
          "Film sonrasi tatli yiyelim",
          "Filmi 10 uzerinden puanlayalim",
        ],
      },
      {
        title: "🏓 Mini Turnuva Yapmak Istiyorum",
        steps: [
          "Bilardo / langirt / masa tenisi olan bir yere gidelim",
          "3 oyunluk mini turnuva yapalim",
          "Kaybeden icecek alsin",
          "Kazanan istedigi tatliyi secsin",
        ],
      },
      {
        title: "🎡 Lunapark / Festival Vibe Istiyorum",
        steps: [
          "Yakinda etkinlik, festival veya lunapark varsa gidelim",
          "Birkac oyun / stand deneyelim",
          "Sokak lezzeti yiyelim",
          "Bol bol fotograf cekelim",
        ],
      },
      {
        title: "🍦 Tatli Challenge Yapmak Istiyorum",
        steps: [
          "Iki farkli tatlici secelim",
          "Ikisinden de kucuk tatli alalim",
          "Hangisi daha iyi puanlayalim",
          "Kazanan tatliciyi favorilere ekleyelim",
        ],
      },
      {
        title: "🧃 Kafe Hopping Istiyorum",
        steps: [
          "Yakin 2-3 kafe secelim",
          "Her kafede farkli icecek deneyelim",
          "Mekanlari puanlayalim",
          "En guzel atmosferli yerde fotograf cekelim",
        ],
      },
      {
        title: "🛒 Market Challenge Yapmak Istiyorum",
        steps: [
          "Markete gidelim",
          "Belirli butceyle birbirimize atistirmalik secelim",
          "Sahilde / parkta tadim yapalim",
          "En iyi secimi yapan kazansin",
        ],
      },
      {
        title: "🕺 Dans / TikTok Challenge Istiyorum",
        steps: [
          "Guzel isikli veya bos bir alan bulalim",
          "Komik bir TikTok / Reels challenge cekelim",
          "En komik videoyu secelim",
          "Sonra tatliyla odullendirelim",
        ],
      },
      {
        title: "🚗 Gece Muzik Turu Istiyorum",
        steps: [
          "Birlikte arabayla kisa bir tur yapalim",
          "Herkes sirayla sarki secsin",
          "En iyi sarkiyi puanlayalim",
          "Sonra tatli veya icecek alalim",
        ],
      },
      {
        title: "🌆 Sehir Turu Istiyorum",
        steps: [
          "Arabayla Girne / Lefkosa tarafinda kisa bir tur yapalim",
          "Guzel isikli bir yerde duralim",
          "Fotograf cekelim",
          "Sonra kahve icelim",
        ],
      },
    ],
  },
  {
    id: "calm",
    emoji: "☕",
    title: "Sakin bir şey istiyorum",
    tone: "blush",
    description: "Çok yorulmadan, huzurlu bir date istiyorum.",
    plans: [
      {
        title: "☕ Kahve + Sahil Istiyorum",
        steps: [
          "Kahve alalim",
          "Sahile gidelim",
          "Sakin bir playlist acalim",
          "Uzun uzun konusalim",
        ],
      },
      {
        title: "🌙 Sessiz Kafe Istiyorum",
        steps: [
          "Kalabalik olmayan bir kafe secelim",
          "Tatli yiyelim",
          "Telefonlari biraz birakalim",
          "Sakin sakin sohbet edelim",
        ],
      },
      {
        title: "📚 Kitapci Gezmek Istiyorum",
        steps: [
          "Kitapci gezelim",
          "Birbirimize kitap secelim",
          "Kahve icelim",
          "Donuste sakin bir playlist acalim",
        ],
      },
      {
        title: "🧺 Piknik Istiyorum",
        steps: [
          "Marketten atistirmalik alalim",
          "Parka ya da sahile gidelim",
          "Oturup sohbet edelim",
          "Fotograf cekelim",
        ],
      },
      {
        title: "🚗 Sessiz Manzara Istiyorum",
        steps: [
          "Birlikte arabayla sakin bir manzara noktasina gidelim",
          "Icecek alalim",
          "Sakin playlist acalim",
          "Oturup konusalim",
        ],
      },
      {
        title: "🌊 Deniz Kenarinda Oturalim",
        steps: [
          "Sahil tarafina gecelim",
          "Dalgalari dinleyelim",
          "Hafif bir seyler icelim",
          "Gunu yormadan bitirelim",
        ],
      },
    ],
  },
  {
    id: "food",
    emoji: "🍔",
    title: "Yemek istiyorum",
    tone: "honey",
    description: "Önce karnım doysun, sonra her şey olur.",
    plans: [
      {
        title: "🍰 Tatli Krizim Var",
        steps: [
          "Waffle / magnolia / dondurma yiyelim",
          "Iki farkli tatli deneyelim",
          "Hangisi daha iyi puanlayalim",
          "Sonra kisa yuruyus yapalim",
        ],
      },
      {
        title: "🍔 Burger Istiyorum",
        steps: [
          "Guzel bir burgerciye gidelim",
          "Patatesleri paylasalim",
          "Sonra kahve icelim",
          "Kisa yuruyusle bitirelim",
        ],
      },
      {
        title: "🥞 Kahvalti Date'i Istiyorum",
        steps: [
          "Guzel bir kahvalticiya gidelim",
          "Uzun uzun kahvalti yapalim",
          "Sonra mini yuruyus yapalim",
          "Fotograf cekelim",
        ],
      },
      {
        title: "🌙 Gece Acligi Var",
        steps: [
          "Yakin bir tost / donerci bulalim",
          "Bir seyler yiyelim",
          "Sonra sahilde kisa yuruyus yapalim",
          "Tatliyla kapatalim",
        ],
      },
      {
        title: "🍰 Tatli + Ilgi Istiyorum",
        steps: [
          "Tatliciya gidelim",
          "Bugun tatliyi ben seceyim",
          "Sonra sevdigim yakin bir yere ugrayalim",
          "Kucuk bir surprizle gunu bitirelim",
        ],
      },
      {
        title: "🚗 Gece Atistirmalik Turu Istiyorum",
        steps: [
          "Birlikte arabayla sevdigimiz atistirmalikciya gidelim",
          "Icecek ve tatli alalim",
          "Sahilde oturup yiyelim",
          "Sonra kisa yuruyus yapalim",
        ],
      },
    ],
  },
  {
    id: "sea",
    emoji: "🌊",
    title: "Deniz havası istiyorum",
    tone: "ocean",
    description: "Beni sahile götür, deniz görmem lazım.",
    plans: [
      {
        title: "🌅 Long Beach'e Gitmek Istiyorum",
        steps: [
          "Long Beach'e gidelim",
          "Deniz kenarinda yuruyelim",
          "Kahve / dondurma alalim",
          "Gun batimini izleyelim",
        ],
      },
      {
        title: "🏊 Yuzmek Istiyorum",
        steps: [
          "Sakin bir plaj secelim",
          "Havlu, su ve atistirmalik alalim",
          "Biraz yuzelim, biraz guneslenelim",
          "Sonra sahilde kahve / dondurma alalim",
        ],
      },
      {
        title: "🌙 Gece Sahil Date'i Istiyorum",
        steps: [
          "Icecek / tatli alalim",
          "Sahile gidelim",
          "Sahilde oturalim",
          "Dalgalari dinleyelim",
        ],
      },
      {
        title: "🚶 Random Sahil Istiyorum",
        steps: [
          "Yakin bir sahil secelim",
          "Oraya birlikte gidelim",
          "Muzik acalim",
          "Mini kesif yapalim",
        ],
      },
      {
        title: "🚗 Sahil Sahil Gezelim Istiyorum",
        steps: [
          "Birlikte arabayla birkac sahil noktasi secelim",
          "Her noktada kisa kisa duralim",
          "Fotograf cekelim",
          "En guzel sahili favori secelim",
        ],
      },
      {
        title: "🌄 Gun Batimi Sahili Istiyorum",
        steps: [
          "Arabayla gun batimi guzel olan bir sahile gidelim",
          "Icecek alalim",
          "Fotograf cekelim",
          "Gun batimini izleyelim",
        ],
      },
    ],
  },
  {
    id: "adventure",
    emoji: "✈️",
    title: "Macera istiyorum",
    tone: "berry",
    description:
      "Planlı olmak zorunda değil, farklı, spontane ve keşifli bir şey yapalım.",
    plans: [
      {
        title: "🗺️ Random Rota Istiyorum",
        steps: [
          "Haritadan yakin bir yer secelim",
          "Birlikte oraya gidelim",
          "Gittigimiz yerde kahve icelim",
          "Fotograf cekelim",
        ],
      },
      {
        title: "🚌 Mini Kacamak Istiyorum",
        steps: [
          "Otobus / taksi / arabayla gidilebilecek bir yer secelim",
          "Yolda playlist acalim",
          "Yeni bir sokak veya sahil kesfedelim",
          "Gun batimina yakin donelim",
        ],
      },
      {
        title: "🏘️ Yeni Yer Kesfetmek Istiyorum",
        steps: [
          "Yakin bir semt secelim",
          "Sokaklarda yuruyelim",
          "Yerel bir kafe bulalim",
          "Manzara fotografi cekelim",
        ],
      },
      {
        title: "☕ Bilinmeyen Kafe Istiyorum",
        steps: [
          "Daha once gitmedigimiz bir kafe secelim",
          "Yorumlara cok bakmadan gidelim",
          "Mekani puanlayalim",
          "Begenirsek favoriye ekleyelim",
        ],
      },
      {
        title: "🎒 Sirt Cantasiyla Cikalim",
        steps: [
          "Kucuk bir canta hazirlayalim",
          "Su, atistirmalik ve kulaklik alalim",
          "Yakin bir sahil / park / sokak rotasi secelim",
          "Gittigimiz yerde mini piknik yapalim",
        ],
      },
      {
        title: "📍 Harita Bize Secsin",
        steps: [
          "Haritayi acalim",
          "Yakindaki rastgele bir noktayi secelim",
          "Oraya gidip etrafi kesfedelim",
          "Donuste 'deger miydi?' diye puanlayalim",
        ],
      },
      {
        title: "🌅 Gun Batimi Pesindeyim",
        steps: [
          "Gun batimi izlenecek bir yer secelim",
          "Oncesinde kahve / icecek alalim",
          "Fotograf cekelim",
          "Gunes batinca kisa yuruyus yapalim",
        ],
      },
      {
        title: "🏛️ Eski Sokaklar Gezisi",
        steps: [
          "Tarihi sokaklari olan bir bolge secelim",
          "Dar sokaklarda yuruyelim",
          "Guzel kapi / duvar / manzara fotograflari cekelim",
          "Sonra kucuk bir kafede mola verelim",
        ],
      },
      {
        title: "🧭 Turist Gibi Gezmek Istiyorum",
        steps: [
          "Kendi sehrimizde turist gibi davranalim",
          "Daha once dikkat etmedigimiz yerleri gezelim",
          "Bol bol fotograf cekelim",
          "En sonunda 'bugunun favori noktasi'ni secelim",
        ],
      },
      {
        title: "🧃 Sokak Lezzeti Kesfi",
        steps: [
          "Yakin bir bolgede sokak lezzeti arayalim",
          "Daha once denemedigimiz bir sey yiyelim",
          "Mekani 10 uzerinden puanlayalim",
          "Sonra kisa yuruyus yapalim",
        ],
      },
      {
        title: "🌙 Gece Kesfi Istiyorum",
        steps: [
          "Guvenli ve kalabalik bir bolge secelim",
          "Gece isiklari altinda yuruyelim",
          "Icecek / tatli alalim",
          "Guzel bir noktada oturup sohbet edelim",
        ],
      },
      {
        title: "🛶 Deniz Kenari Kesfi",
        steps: [
          "Yakin bir sahil rotasi secelim",
          "Sahil boyunca yuruyelim",
          "Guzel tas / deniz kabugu / fotograf spotu bulalim",
          "Sonra kahve veya dondurma alalim",
        ],
      },
      {
        title: "🎯 Gorevli Macera Istiyorum",
        steps: [
          "Birbirimize 3 kucuk gorev verelim",
          "Mesela 'en guzel fotografi cek', 'yeni bir tat dene'",
          "Gorevleri gun icinde tamamlayalim",
          "Kazanan tatli secsin",
        ],
      },
      {
        title: "🧺 Plansiz Piknik Istiyorum",
        steps: [
          "Marketten hizlica atistirmalik alalim",
          "Yakin bir park / sahil secelim",
          "Orada oturup mini piknik yapalim",
          "Sonra cevreyi kesfedelim",
        ],
      },
      {
        title: "🚶 Sadece Yuruyelim, Nereye Varsa",
        steps: [
          "Bir baslangic noktasi secelim",
          "20-30 dakika rastgele yuruyelim",
          "Yolda guzel gorunen bir yere girelim",
          "En son kesfettigimiz yeri favoriye ekleyelim",
        ],
      },
      {
        title: "🎲 Yazi Tura Rotasi",
        steps: [
          "Her kavsakta yazi tura atalim",
          "Yazi sag, tura sol olsun",
          "15 dakika boyle yuruyelim",
          "Sonunda cikan yerde fotograf cekelim",
        ],
      },
      {
        title: "📸 Fotograf Avi Istiyorum",
        steps: [
          "Bir tema secelim: pembe, deniz, kedi, eski bina gibi",
          "O temaya uygun fotograflar cekelim",
          "En iyi fotografi secelim",
          "Sonra kahve molasi verelim",
        ],
      },
      {
        title: "🚌 Rastgele Durak Istiyorum",
        steps: [
          "Bir otobus hatti secelim",
          "Daha once inmedigimiz bir durakta inelim",
          "Etrafi kisa kisa kesfedelim",
          "Guzel bir kafe / tatlici bulursak oturalim",
        ],
      },
      {
        title: "🧩 Gizli Mekan Bulalim",
        steps: [
          "Haritada az bilinen bir kafe / park / sahil secelim",
          "Oraya gidip kesfedelim",
          "Mekanin vibe'ini puanlayalim",
          "Begenirsek 'gizli favori' olarak kaydedelim",
        ],
      },
      {
        title: "🚗 Spontane Araba Rotasi Istiyorum",
        steps: [
          "Haritadan rastgele bir rota secelim",
          "Arabada playlist acalim",
          "Guzel gorunen yerde duralim",
          "Kahve veya tatli molasi verelim",
        ],
      },
      {
        title: "🏝️ Karpaz / Uzak Kacamak Hissi",
        steps: [
          "Gun icinde gidilebilecek bir rota secelim",
          "Yolda icecek ve atistirmalik alalim",
          "Yol boyunca fotograf cekelim",
          "Guzel bir sahil veya manzara noktasinda mola verelim",
        ],
      },
      {
        title: "🌌 Gece Manzara Macerasi",
        steps: [
          "Guvenli bir manzara noktasi secelim",
          "Arabayla oraya gidelim",
          "Sakin playlist acalim",
          "Gokyuzune bakip sohbet edelim",
        ],
      },
    ],
  },
  {
    id: "attention",
    emoji: "🥺",
    title: "İlgi istiyorum",
    tone: "pearl",
    description: "Bugün biraz hassasım, bana iyi davran.",
    plans: [
      {
        title: "🫂 Comfort Date Istiyorum",
        steps: [
          "Sevdigim yiyecegi al",
          "Sessiz bir yere gidelim",
          "Beni dinle",
          "Gunu guzel bir mesajla bitir",
        ],
      },
      {
        title: "☕ Sarilma + Kahve Istiyorum",
        steps: [
          "Kahve alalim",
          "Sakin bir sahile gidelim",
          "Sakin bir playlist acalim",
          "Biraz sarilip konusalim",
        ],
      },
      {
        title: "🍫 Moralimi Duzelt",
        steps: [
          "Kucuk cikolata / cicek al",
          "Birlikte kisa bir yuruyus yapalim",
          "Manzarali bir yere gidelim",
          "Beni guldurmeye calis",
        ],
      },
      {
        title: "🌙 Sessiz Gece Istiyorum",
        steps: [
          "Kalabalik yerlere gitmeyelim",
          "Sakin bir playlist acalim",
          "Sahilde kisa yuruyus yapalim",
          "Tatliyla gunu kapatalim",
        ],
      },
      {
        title: "🚗 Sessiz Sahil Molasi Istiyorum",
        steps: [
          "Birlikte sakin bir sahile gidelim",
          "Icecek alalim",
          "Sahilde veya arabada sakin sakin konusalim",
          "Gunu tatli bir mesajla bitirelim",
        ],
      },
    ],
  },
  {
    id: "indecisive",
    emoji: "🎲",
    title: "Kararsızım, sen seç",
    tone: "starlight",
    description: "Karar vermek istemiyorum, güzel bir plan seçilsin.",
    plans: [
      {
        title: "🎲 Random Plan 1",
        steps: [
          "Kahve alalim",
          "Sahile gidelim",
          "20 dakika yuruyelim",
          "Tatliyla bitirelim",
        ],
      },
      {
        title: "🎲 Random Plan 2",
        steps: [
          "Yeni bir kafe secelim",
          "Farkli icecekler deneyelim",
          "Mekani 10 uzerinden puanlayalim",
          "Sonra kisa yuruyus yapalim",
        ],
      },
      {
        title: "🎲 Random Plan 3",
        steps: [
          "Bowling / oyun salonuna gidelim",
          "Kaybeden tatli ismarlasin",
          "Gece sahil yuruyusu yapalim",
          "Favori sarkilarimizi acalim",
        ],
      },
      {
        title: "🎲 Random Plan 4",
        steps: [
          "Haritada yakin bir yer secelim",
          "Oraya birlikte gidelim",
          "Gittigimiz yerde fotograf cekelim",
          "Kahve molasi verelim",
        ],
      },
      {
        title: "🎲 Random Plan 5",
        steps: [
          "Marketten abur cubur alalim",
          "Manzarali bir yere gidelim",
          "Oturup sohbet edelim",
          "Story'lik fotograf cekelim",
        ],
      },
      {
        title: "🎲 Random Plan 6",
        steps: [
          "Arabayla kisa bir sahil turu yapalim",
          "Icecek alalim",
          "Guzel bir yerde duralim",
          "Gunun fotografini cekelim",
        ],
      },
      {
        title: "🎲 Random Plan 7",
        steps: [
          "Haritadan rastgele bir kafe secelim",
          "Birlikte oraya gidelim",
          "Mekani puanlayalim",
          "Donuste playlist acalim",
        ],
      },
    ],
  },
]

function buildRestaurantPlanForMood(restaurant, mood) {
  return {
    ...restaurant,
    id: `restaurant-${restaurant.id}-${mood.id}`,
    kind: "restaurant",
    restaurantId: restaurant.id,
  }
}

function attachRestaurantPlans(mood) {
  const matchingRestaurants = restaurantPlans
    .filter((restaurant) => restaurant.moodTags.includes(mood.id))
    .map((restaurant) => buildRestaurantPlanForMood(restaurant, mood))

  return {
    ...mood,
    plans: [...mood.plans, ...matchingRestaurants],
  }
}

function enrichMood(mood) {
  return {
    ...mood,
    plans: mood.plans.map((plan, index) => {
      const inferredTags = inferPlanTags(mood.id, plan)
      const distanceTags = plan.distanceTags ?? plan.transportTags ?? inferredTags.distanceTags
      const timeTags = plan.timeTags ?? inferredTags.timeTags
      const vibeTags = plan.vibeTags ?? inferredTags.vibeTags

      return {
        ...plan,
        id: plan.id ?? `${mood.id}-${index + 1}`,
        kind: plan.kind ?? (mood.id === "sport" ? "sport" : "plan"),
        moodId: mood.id,
        moodTitle: mood.title,
        moodEmoji: mood.emoji,
        moodTags: plan.moodTags ?? [mood.id],
        note: PLAN_NOTES[index % PLAN_NOTES.length],
        distanceTags,
        transportTags: plan.transportTags ?? distanceTags,
        timeTags,
        vibeTags,
        isFavorite: plan.isFavorite ?? false,
      }
    }),
  }
}

export const statusMessages = [
  "Mood seçildi.",
  "Planlar hazır.",
  "Yeni plan seçildi.",
  "Favoriler güncellendi.",
]

const rawMoodsWithSport = [
  ...rawMoods.slice(0, -1),
  sportMood,
  rawMoods[rawMoods.length - 1],
]

const moodSources = rawMoodsWithSport.map(attachRestaurantPlans)

export const moods = moodSources.map(enrichMood)

export const allPlans = moods.flatMap((mood) => mood.plans)
