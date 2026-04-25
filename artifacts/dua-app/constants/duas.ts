export type Difficulty = "Short" | "Medium" | "Long";

export type Category =
  | "Daily"
  | "Prayer"
  | "Fasting"
  | "Travel"
  | "Food & Drink"
  | "Sleep"
  | "Morning & Evening"
  | "Forgiveness"
  | "Protection";

export interface Dua {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  urdu: string;
  english: string;
  source: string;
  category: Category;
  difficulty: Difficulty;
}

export const CATEGORIES: Category[] = [
  "Daily",
  "Prayer",
  "Fasting",
  "Travel",
  "Food & Drink",
  "Sleep",
  "Morning & Evening",
  "Forgiveness",
  "Protection",
];

export const DIFFICULTIES: Difficulty[] = ["Short", "Medium", "Long"];

export const DUAS: Dua[] = [
  {
    id: "dua-001",
    title: "Before Eating",
    arabic: "بِسْمِ اللَّهِ",
    transliteration: "Bismillah",
    urdu: "اللہ کے نام سے",
    english: "In the name of Allah.",
    source: "Sahih Bukhari",
    category: "Food & Drink",
    difficulty: "Short",
  },
  {
    id: "dua-002",
    title: "After Eating",
    arabic:
      "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    transliteration:
      "Alhamdu lillahil-ladhi at‘amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah",
    urdu:
      "تمام تعریفیں اللہ کے لیے ہیں جس نے مجھے یہ کھلایا اور بغیر میری طاقت اور قوت کے یہ مجھے عطا کیا۔",
    english:
      "All praise is for Allah who fed me this and provided it for me without any strength or power on my part.",
    source: "Sunan Abu Dawud",
    category: "Food & Drink",
    difficulty: "Long",
  },
  {
    id: "dua-003",
    title: "Before Sleeping",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya",
    urdu: "اے اللہ! تیرے نام کے ساتھ میں مرتا ہوں اور جیتا ہوں۔",
    english: "In Your name, O Allah, I die and I live.",
    source: "Sahih Bukhari",
    category: "Sleep",
    difficulty: "Short",
  },
  {
    id: "dua-004",
    title: "Upon Waking",
    arabic:
      "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration:
      "Alhamdu lillahil-ladhi ahyana ba‘da ma amatana wa ilayhin-nushur",
    urdu:
      "تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں موت کے بعد زندگی دی اور اسی کی طرف لوٹنا ہے۔",
    english:
      "All praise is for Allah who gave us life after causing us to die, and to Him is the resurrection.",
    source: "Sahih Bukhari",
    category: "Sleep",
    difficulty: "Medium",
  },
  {
    id: "dua-005",
    title: "Entering the Bathroom",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
    transliteration: "Allahumma inni a‘udhu bika minal-khubuthi wal-khaba’ith",
    urdu:
      "اے اللہ! میں تیری پناہ مانگتا ہوں ناپاک جنوں اور جنیات سے۔",
    english:
      "O Allah, I seek refuge with You from male and female evil spirits.",
    source: "Sahih Bukhari",
    category: "Daily",
    difficulty: "Medium",
  },
  {
    id: "dua-006",
    title: "Leaving the Bathroom",
    arabic: "غُفْرَانَكَ",
    transliteration: "Ghufranak",
    urdu: "اے اللہ! میں تجھ سے بخشش مانگتا ہوں۔",
    english: "I seek Your forgiveness.",
    source: "Sunan Abu Dawud",
    category: "Daily",
    difficulty: "Short",
  },
  {
    id: "dua-007",
    title: "Beginning of Wudu",
    arabic: "بِسْمِ اللَّهِ",
    transliteration: "Bismillah",
    urdu: "اللہ کے نام سے۔",
    english: "In the name of Allah.",
    source: "Sunan Abu Dawud",
    category: "Prayer",
    difficulty: "Short",
  },
  {
    id: "dua-008",
    title: "After Wudu",
    arabic:
      "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    transliteration:
      "Ashhadu an la ilaha illallah wahdahu la sharika lah, wa ashhadu anna Muhammadan ‘abduhu wa rasuluh",
    urdu:
      "میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے اس کا کوئی شریک نہیں، اور میں گواہی دیتا ہوں کہ محمد ﷺ اللہ کے بندے اور اس کے رسول ہیں۔",
    english:
      "I bear witness that none has the right to be worshipped except Allah, alone with no partner, and I bear witness that Muhammad is His servant and Messenger.",
    source: "Sahih Muslim",
    category: "Prayer",
    difficulty: "Long",
  },
  {
    id: "dua-009",
    title: "Entering the Mosque",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    transliteration: "Allahumma iftah li abwaba rahmatik",
    urdu: "اے اللہ! میرے لیے اپنی رحمت کے دروازے کھول دے۔",
    english: "O Allah, open the doors of Your mercy for me.",
    source: "Sahih Muslim",
    category: "Prayer",
    difficulty: "Medium",
  },
  {
    id: "dua-010",
    title: "Leaving the Mosque",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    transliteration: "Allahumma inni as’aluka min fadlik",
    urdu: "اے اللہ! میں تجھ سے تیرا فضل مانگتا ہوں۔",
    english: "O Allah, I ask You of Your bounty.",
    source: "Sahih Muslim",
    category: "Prayer",
    difficulty: "Medium",
  },
  {
    id: "dua-011",
    title: "Breaking the Fast (Iftar)",
    arabic:
      "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ",
    transliteration:
      "Dhahaba az-zama’u wabtallatil-‘uruqu wa thabatal-ajru in sha’ Allah",
    urdu:
      "پیاس بجھ گئی، رگیں تر ہو گئیں، اور اگر اللہ نے چاہا تو اجر ثابت ہو گیا۔",
    english:
      "The thirst is gone, the veins are moistened, and the reward is confirmed, if Allah wills.",
    source: "Sunan Abu Dawud",
    category: "Fasting",
    difficulty: "Long",
  },
  {
    id: "dua-012",
    title: "Beginning the Fast (Suhoor)",
    arabic: "وَبِصَوْمِ غَدٍ نَوَيْتُ مِنْ شَهْرِ رَمَضَانَ",
    transliteration: "Wa bi-sawmi ghadin nawaytu min shahri Ramadan",
    urdu: "میں نے رمضان کے مہینے کے کل کے روزے کی نیت کی۔",
    english: "I intend to fast tomorrow in the month of Ramadan.",
    source: "Sunan Abu Dawud",
    category: "Fasting",
    difficulty: "Medium",
  },
  {
    id: "dua-013",
    title: "Travel Dua",
    arabic:
      "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُونَ",
    transliteration:
      "Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun",
    urdu:
      "پاک ہے وہ ذات جس نے اسے ہمارے لیے مسخر کیا اور ہم اس کو قابو میں کرنے والے نہ تھے، اور بے شک ہم اپنے رب کی طرف لوٹنے والے ہیں۔",
    english:
      "Glory be to Him who has subjected this to us, and we could never have done it by ourselves. Truly, to our Lord we are returning.",
    source: "Sahih Muslim",
    category: "Travel",
    difficulty: "Long",
  },
  {
    id: "dua-014",
    title: "Entering the Home",
    arabic:
      "بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
    transliteration:
      "Bismillahi walajna, wa bismillahi kharajna, wa ‘ala Allahi Rabbina tawakkalna",
    urdu:
      "اللہ کے نام سے ہم داخل ہوئے، اللہ کے نام سے ہم نکلے، اور اپنے رب اللہ پر ہم نے بھروسہ کیا۔",
    english:
      "In the name of Allah we enter, in the name of Allah we leave, and upon Allah, our Lord, we rely.",
    source: "Sunan Abu Dawud",
    category: "Daily",
    difficulty: "Long",
  },
  {
    id: "dua-015",
    title: "Morning Remembrance",
    arabic:
      "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",
    transliteration:
      "Asbahna wa asbahal-mulku lillah, wal-hamdu lillah",
    urdu:
      "ہم نے صبح کی اور بادشاہت اللہ کی ہو گئی، اور تمام تعریفیں اللہ کے لیے ہیں۔",
    english:
      "We have entered the morning and the dominion belongs to Allah, and all praise is for Allah.",
    source: "Sahih Muslim",
    category: "Morning & Evening",
    difficulty: "Long",
  },
  {
    id: "dua-016",
    title: "Evening Remembrance",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",
    transliteration: "Amsayna wa amsal-mulku lillah, wal-hamdu lillah",
    urdu:
      "ہم نے شام کی اور بادشاہت اللہ کی ہو گئی، اور تمام تعریفیں اللہ کے لیے ہیں۔",
    english:
      "We have entered the evening and the dominion belongs to Allah, and all praise is for Allah.",
    source: "Sahih Muslim",
    category: "Morning & Evening",
    difficulty: "Long",
  },
  {
    id: "dua-017",
    title: "Seeking Forgiveness",
    arabic: "أَسْتَغْفِرُ اللَّهَ",
    transliteration: "Astaghfirullah",
    urdu: "میں اللہ سے بخشش مانگتا ہوں۔",
    english: "I seek forgiveness from Allah.",
    source: "Sahih Muslim",
    category: "Forgiveness",
    difficulty: "Short",
  },
  {
    id: "dua-018",
    title: "Sayyid al-Istighfar",
    arabic:
      "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ",
    transliteration:
      "Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana ‘abduk",
    urdu:
      "اے اللہ! تو میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے مجھے پیدا کیا اور میں تیرا بندہ ہوں۔",
    english:
      "O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant.",
    source: "Sahih Bukhari",
    category: "Forgiveness",
    difficulty: "Long",
  },
  {
    id: "dua-019",
    title: "Protection from Evil",
    arabic:
      "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A‘udhu bi-kalimatillahit-tammati min sharri ma khalaq",
    urdu:
      "میں اللہ کے مکمل کلمات کی پناہ مانگتا ہوں ہر اس چیز کے شر سے جو اس نے پیدا کی۔",
    english:
      "I seek refuge in the perfect words of Allah from the evil of what He has created.",
    source: "Sahih Muslim",
    category: "Protection",
    difficulty: "Long",
  },
  {
    id: "dua-020",
    title: "Ayat al-Kursi (Beginning)",
    arabic:
      "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
    transliteration: "Allahu la ilaha illa huwal-hayyul-qayyum",
    urdu:
      "اللہ، اس کے سوا کوئی معبود نہیں، وہ زندہ ہے، سب کا قائم رکھنے والا ہے۔",
    english:
      "Allah! There is no deity except Him, the Ever-Living, the Sustainer of all.",
    source: "Quran 2:255",
    category: "Protection",
    difficulty: "Medium",
  },
];
