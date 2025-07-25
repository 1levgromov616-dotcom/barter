/*
  script.js
  Основна логіка для прототипу платформи Barter Buddy.
  Реалізує:
  – локальний масив оголошень;
  – переклад інтерфейсу (українська / англійська);
  – відображення та фільтрацію оголошень за категоріями та пошуком;
  – позначення «лайків» та доступ до чату після взаємного лайку (імітація);
  – простий офлайн‑чат на рівні локального сховища браузера.
*/

// Дані оголошень. Для справжньої платформи ці дані будуть надходити з сервера.
const posts = [
  {
    id: 1,
    category: 'electronics',
    recommended: true,
    ownerId: 'user1',
    title: { ua: 'Ноутбук Apple MacBook Air', en: 'Apple MacBook Air Laptop' },
    description: {
      ua: 'Мій улюблений ноутбук у відмінному стані — служив у навчанні та роботі. Хотів би обміняти його на планшет або смартфон, щоб спробувати щось нове!',
      en: 'My beloved laptop is in excellent shape, has served me for study and work. I\'d love to swap it for a tablet or smartphone to try something new!',
    },
    image: 'assets/images/products/post-1.png',
  },
  {
    id: 2,
    category: 'sport',
    recommended: false,
    ownerId: 'user2',
    title: { ua: 'Гірський велосипед Trek', en: 'Trek Mountain Bike' },
    description: {
      ua: 'Майже новий велосипед, катався всього кілька разів. Хочу змінити хобі — можливо, у вас є ролики чи скейт?',
      en: 'Almost new bike, rode just a few times. I\'d like to change hobbies — maybe you have skates or a skateboard?',
    },
    image: 'assets/images/products/post-2.png',
  },
  {
    id: 3,
    category: 'home-appliances',
    recommended: true,
    ownerId: 'user3',
    title: { ua: 'Мікрохвильова піч Samsung', en: 'Samsung Microwave Oven' },
    description: {
      ua: 'Мікрохвильовка, яка нас виручала, досі працює бездоганно. Поміняю на мультиварку — хочу готувати цікавіше!',
      en: 'A microwave that saved us many times still works flawlessly. Will swap for a slow cooker — I want to cook more interesting meals!',
    },
    image: 'assets/images/products/post-3.png',
  },
  {
    id: 4,
    category: 'mens-clothing',
    recommended: false,
    ownerId: 'user1',
    title: { ua: 'Чоловічий піджак M', en: 'Men’s Blazer M' },
    description: {
      ua: 'Класичний піджак в чудовому стані, розмір M. Шукаю щось зручніше — сорочку або светр.',
      en: 'Classic blazer in great condition, size M. Looking for something more casual — maybe a shirt or sweater.',
    },
    image: 'assets/images/products/post-4.png',
  },
  {
    id: 5,
    category: 'womens-clothing',
    recommended: false,
    ownerId: 'user2',
    title: { ua: 'Жіноче пальто L', en: 'Women’s Coat L' },
    description: {
      ua: 'Модне пальто, розмір L, носила зовсім трохи. Обміняю на стильні аксесуари.',
      en: 'Stylish coat, size L, worn just a few times. I\'d trade it for some fashionable accessories.',
    },
    image: 'assets/images/products/post-5.png',
  },
  {
    id: 6,
    category: 'kids',
    recommended: true,
    ownerId: 'user3',
    title: { ua: 'Дитяча коляска', en: 'Baby Stroller' },
    description: {
      ua: 'Наша коляска з дощовиком відслужила нам чудово. Тепер потрібне автокрісло — можемо обмінятись.',
      en: 'Our stroller with rain cover served us beautifully. Now we need a car seat — let\'s exchange!',
    },
    image: 'assets/images/products/post-6.png',
  },
  {
    id: 7,
    category: 'garden',
    recommended: false,
    ownerId: 'user1',
    title: { ua: 'Садовий набір інструментів', en: 'Garden Tool Set' },
    description: {
      ua: 'Набір садових інструментів, майже новий. Хотів би отримати цікаві рослини чи красиві горщики.',
      en: 'A set of garden tools, almost new. I\'d love to get some interesting plants or nice pots in return.',
    },
    image: 'assets/images/products/post-7.png',
  },
  {
    id: 8,
    category: 'materials',
    recommended: false,
    ownerId: 'user2',
    title: { ua: 'Пакет цементу 25кг', en: '25kg Bag of Cement' },
    description: {
      ua: 'Після ремонту залишилося кілька мішків цементу. Потрібні шпалери чи фарба — можливо, вам потрібен цемент?',
      en: 'After renovation we have a few bags of cement left. We need wallpaper or paint — maybe you need cement?',
    },
    image: 'assets/images/products/post-8.png',
  },
  {
    id: 9,
    category: 'tools',
    recommended: false,
    ownerId: 'user3',
    title: { ua: 'Перфоратор Bosch', en: 'Bosch Rotary Hammer' },
    description: {
      ua: 'Потужний перфоратор, майже новий — користувався пару разів. Хочу обміняти на дриль та шліфмашину для інших робіт.',
      en: 'A powerful rotary hammer, almost new — used only a couple of times. I\'d like to trade it for a drill and sander for other jobs.',
    },
    image: 'assets/images/products/post-9.png',
  },
  {
    id: 10,
    category: 'misc',
    recommended: true,
    ownerId: 'user1',
    title: { ua: 'Настільна гра “Монополія”', en: '“Monopoly” Board Game' },
    description: {
      ua: 'Класична «Монополія», майже не грали. З радістю обміняю на іншу настільну гру чи цікавий пазл.',
      en: 'Classic Monopoly, barely played. I\'d happily swap it for another board game or an interesting puzzle.',
    },
    image: 'assets/images/products/post-10.png',
  },

  // Додаткові оголошення для демонстрації
  {
    id: 11,
    category: 'sport',
    recommended: false,
    ownerId: 'user2',
    title: { ua: 'Футбольний м’яч Adidas', en: 'Adidas Football Ball' },
    description: {
      ua: 'М’яч офіційного розміру, лише тренувався у дворі. Обміняю на тренувальні конуси або улюблену футбольну футболку!',
      en: 'Official size ball, only used for backyard training. Will trade for some training cones or your favorite football jersey!',
    },
    image: 'assets/images/products/post-11.png',
  },
  {
    id: 12,
    category: 'electronics',
    recommended: false,
    ownerId: 'user3',
    title: { ua: 'Смартфон Samsung Galaxy S10', en: 'Samsung Galaxy S10 Smartphone' },
    description: {
      ua: 'Чудовий смартфон без подряпин, завжди носив у чохлі. Хочеться спробувати фотографію — цікавить фотоапарат або інший гаджет.',
      en: 'Great smartphone with no scratches, always kept in a case. Want to try photography — interested in a camera or another gadget.',
    },
    image: 'assets/images/products/post-12.png',
  },
  {
    id: 13,
    category: 'home-appliances',
    recommended: false,
    ownerId: 'user1',
    title: { ua: 'Пилосос Philips', en: 'Philips Vacuum Cleaner' },
    description: {
      ua: 'Наш старий друг — пилосос — працює бездоганно, щойно поміняли мішок та фільтр. Поміняв би його на блендер чи чайник для кухні.',
      en: 'Our old friend the vacuum works flawlessly, bag and filter just replaced. I\'d swap it for a blender or kettle for the kitchen.',
    },
    image: 'assets/images/products/post-13.png',
  },
  {
    id: 14,
    category: 'mens-clothing',
    recommended: false,
    ownerId: 'user2',
    title: { ua: 'Джинси Levi’s 32', en: 'Levi’s Jeans 32' },
    description: {
      ua: 'Класичні джинси Levi’s, розмір 32, сидять чудово. Захотілося оновити гардероб — можливо, у вас є крута футболка чи светр?',
      en: 'Classic Levi’s jeans, size 32, fit great. Time to refresh the wardrobe — maybe you have a cool T‑shirt or sweater?',
    },
    image: 'assets/images/products/post-14.png',
  },
  {
    id: 15,
    category: 'womens-clothing',
    recommended: false,
    ownerId: 'user3',
    title: { ua: 'Сукня літня M', en: 'Summer Dress M' },
    description: {
      ua: 'Легка літня сукня, розмір M, одягала тільки на свята. Обміняю на симпатичне взуття чи сумочку!',
      en: 'Light summer dress, size M, worn only on holidays. I would exchange it for cute shoes or a handbag!',
    },
    image: 'assets/images/products/post-15.png',
  },
  {
    id: 16,
    category: 'kids',
    recommended: false,
    ownerId: 'user1',
    title: { ua: 'Дитячий велосипед', en: 'Kids Bicycle' },
    description: {
      ua: 'Дитячий велосипед для малюка 3–5 років, каталися навколо дому. Хочемо самокат чи нові іграшки — пропонуйте!',
      en: 'Kids\' bicycle for a 3–5 year old, we only rode it around the house. We\'d like a scooter or new toys — make an offer!',
    },
    image: 'assets/images/products/post-16.png',
  },
  {
    id: 17,
    category: 'garden',
    recommended: false,
    ownerId: 'user2',
    title: { ua: 'Гамак тканевий', en: 'Fabric Hammock' },
    description: {
      ua: 'Тканевий гамак для відпочинку в саду, майже новий. Хочу мангал чи невеличкий столик для пікніків.',
      en: 'Fabric hammock for relaxing in the garden, almost new. I want a grill or a small table for picnics.',
    },
    image: 'assets/images/products/post-17.png',
  },
  {
    id: 18,
    category: 'materials',
    recommended: false,
    ownerId: 'user3',
    title: { ua: 'Дерев’яні дошки', en: 'Wooden Planks' },
    description: {
      ua: 'Є кілька метрів добротних дубових дощок після будівництва. Потрібна фарба або саморізи — можливо, домовимось.',
      en: 'A few metres of sturdy oak planks left over from construction. Need paint or screws — maybe we can make a deal.',
    },
    image: 'assets/images/products/post-18.png',
  },
  {
    id: 19,
    category: 'tools',
    recommended: false,
    ownerId: 'user1',
    title: { ua: 'Набір викруток', en: 'Screwdriver Set' },
    description: {
      ua: 'Набір викруток на всі випадки життя, майже нові. Обміняю на плоскогубці чи набір ключів.',
      en: 'A set of screwdrivers for every occasion, almost new. Will trade for pliers or a set of wrenches.',
    },
    image: 'assets/images/products/post-19.png',
  },
  {
    id: 20,
    category: 'misc',
    recommended: false,
    ownerId: 'user2',
    title: { ua: 'Настільний вентилятор', en: 'Desk Fan' },
    description: {
      ua: 'Компактний вентилятор, тихий і надійний. Поміняю на настільну лампу чи USB‑хаб для робочого місця.',
      en: 'Compact fan, quiet and reliable. I\'ll swap it for a desk lamp or a USB hub for my workspace.',
    },
    image: 'assets/images/products/post-20.png',
  },
];

// ---
// Додати службові поля до кожного оголошення.
// Спочатку оголошення створюються без полів "condition" та "location". Оскільки заповнення цих
// полів потребує доступу до масиву users (для визначення місцезнаходження власника), їх
// заповнення винесене в окрему функцію. Цю функцію слід викликати після оголошення масиву users.
function enrichPostsWithMeta() {
  // Додати поле condition: оголошення з непарним id вважаємо новими, з парним — б/у
  posts.forEach((p) => {
    if (!p.condition) {
      p.condition = p.id % 2 === 1 ? 'new' : 'used';
    }
  });
  // Додати поле location: якщо власник має локацію, використовуємо її; інакше розподіляємо циклічно
  const locCycle = ['kyiv', 'lviv', 'kharkiv', 'odessa'];
  posts.forEach((p, idx) => {
    // Якщо вже є location, не змінюємо
    if (p.location) return;
    // Отримати власника за ownerId (users буде оголошено пізніше)
    const owner = users.find((u) => u.id === p.ownerId);
    if (owner && owner.location) {
      p.location = owner.location;
    } else {
      p.location = locCycle[idx % locCycle.length];
    }
  });

  // Додати демонстраційні зображення з сервісу picsum.photos. Для кожного оголошення беремо
  // унікальний номер, щоб картинки відрізнялися. Якщо цей сервіс не доступний, браузер
  // просто показуватиме alt‑текст, і користувач завжди може замінити URL на свій.
  const picsumIds = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110,
                     111, 112, 113, 114, 115, 116, 117, 118, 119, 120];
  posts.forEach((p, idx) => {
    // Формуємо URL з розміром 600x400 – ідеально підходить для картки.
    const id = picsumIds[idx % picsumIds.length];
    p.image = `https://picsum.photos/id/${id}/600/400`;
    // Для кожного оголошення створюємо масив з декількома зображеннями. 
    // У демонстраційній версії використовуємо різні id для picsum, щоб картинки відрізнялися.
    const base = 200 + idx; // початковий ідентифікатор
    p.images = [
      `https://picsum.photos/id/${base}/600/400`,
      `https://picsum.photos/id/${base + posts.length}/600/400`,
      `https://picsum.photos/id/${base + posts.length * 2}/600/400`,
    ];
    // Основне зображення – перше у списку
    p.image = p.images[0];
  });
}

// Категорії з локалізованими назвами. 'recommended' – спеціальна категорія. Категорія 'new' прибрана, оскільки
// фільтр за станом (нове/б/у) реалізується окремо в conditionFilters.
const categories = [
  { slug: 'all', name: { ua: 'Усі', en: 'All' } },
  { slug: 'recommended', name: { ua: 'Рекомендовані', en: 'Recommended' } },
  { slug: 'sport', name: { ua: 'Спорт і відпочинок', en: 'Sport & Recreation' } },
  { slug: 'electronics', name: { ua: 'Електроніка', en: 'Electronics' } },
  { slug: 'home-appliances', name: { ua: 'Побутова техніка', en: 'Home Appliances' } },
  { slug: 'mens-clothing', name: { ua: 'Чоловічий одяг', en: 'Men’s Clothing' } },
  { slug: 'womens-clothing', name: { ua: 'Жіночий одяг', en: 'Women’s Clothing' } },
  { slug: 'kids', name: { ua: 'Дитяче', en: 'Kids' } },
  { slug: 'garden', name: { ua: 'Сад', en: 'Garden' } },
  { slug: 'materials', name: { ua: 'Матеріали', en: 'Materials' } },
  { slug: 'tools', name: { ua: 'Інструменти', en: 'Tools' } },
  { slug: 'misc', name: { ua: 'Різне', en: 'Misc' } },
];

// Фільтри за станом товару: усі, нове, б/у.
const conditions = [
  { slug: 'all', name: { ua: 'Всі', en: 'All' } },
  { slug: 'new', name: { ua: 'Нове', en: 'New' } },
  { slug: 'used', name: { ua: 'Б/у', en: 'Used' } },
];

// Локації для фільтрування товарів. Перший варіант – "Вся Україна", інші – популярні міста.
const locations = [
  { slug: 'all', name: { ua: 'Вся Україна', en: 'All Ukraine' } },
  { slug: 'kyiv', name: { ua: 'Київ', en: 'Kyiv' } },
  { slug: 'lviv', name: { ua: 'Львів', en: 'Lviv' } },
  { slug: 'kharkiv', name: { ua: 'Харків', en: 'Kharkiv' } },
  { slug: 'odessa', name: { ua: 'Одеса', en: 'Odesa' } },
];

// Поточно обрана локація
let selectedLocation = 'all';

// Опис користувачів для демонстрації
// Кожен користувач має перелік своїх товарів (ідентифікаторів постів) та список постів, які він уже вподобав.
const users = [
  {
    id: 'user1',
    name: { ua: 'Андрій', en: 'Andrii' },
    items: [1, 4, 7, 10, 13, 16, 19],
    liked: [8, 9],
    // Демонстраційне зображення профілю. Знаходиться у папці assets/images.
    avatar: 'assets/images/avatar-user1.png',
    // Локація користувача
    location: 'kyiv',
  },
  {
    id: 'user2',
    name: { ua: 'Олена', en: 'Olena' },
    items: [2, 5, 8, 11, 14, 17, 20],
    liked: [1],
    avatar: 'assets/images/avatar-user2.png',
    location: 'lviv',
  },
  {
    id: 'user3',
    name: { ua: 'Ігор', en: 'Ihor' },
    items: [3, 6, 9, 12, 15, 18],
    liked: [5, 2],
    avatar: 'assets/images/avatar-user3.png',
    location: 'kharkiv',
  },
  // Адміністратор – має можливість писати всім без взаємних лайків
  {
    id: 'admin',
    name: { ua: 'Адмін', en: 'Admin' },
    // Наразі адміністратор не володіє жодними товарами – у справжньому додатку він може мати спеціальні привілеї
    items: [],
    liked: [],
    // Спеціальна аватарка для адміністратора
    avatar: 'assets/images/avatar-admin.png',
    // Локацію можна змінити на будь‑яку – для прикладу використовуємо Київ
    location: 'kyiv',
    // Позначка адміністратора: показуємо галочку біля імені
    isAdmin: true,
  },
];

// Тепер, коли оголошено масив користувачів, можна заповнити службові поля у масиві posts.
// Це важливо, щоб уникнути помилки ReferenceError при спробі звернутися до users до його оголошення.
enrichPostsWithMeta();

// Переклади інтерфейсу
const translations = {
  ua: {
    searchPlaceholder: 'Пошук…',
    allCategories: 'Усі категорії',
    send: 'Надіслати',
    enterMessage: 'Введіть повідомлення…',
    chatTitle: 'Чат',
    close: 'Закрити',
    like: 'Вподобати',
    unlike: 'Скасувати вподобання',
    chat: 'Чат',
    noPosts: 'Оголошень немає',
    profile: 'Профіль',
    myItems: 'Мої товари',
    mutualLikes: 'Взаємні лайки',
    openChat: 'Відкрити чат',
    incomingLike: 'Вам поставили лайк',
    selectUser: 'Виберіть користувача',
    recommended: 'Рекомендації',
    similarPosts: 'Схожі оголошення',
    superLike: 'Суперлайк',
    superChat: 'Повідомлення',
    login: 'Вхід',
    loginTitle: 'Вхід',
    loginDesc: 'Оберіть спосіб входу:',
    loginWithGoogle: 'Увійти через Google',
    cancel: 'Скасувати',
    chooseUser: 'Оберіть користувача',
  },
  en: {
    searchPlaceholder: 'Search…',
    allCategories: 'All categories',
    send: 'Send',
    enterMessage: 'Type a message…',
    chatTitle: 'Chat',
    close: 'Close',
    like: 'Like',
    unlike: 'Unlike',
    chat: 'Chat',
    noPosts: 'No posts found',
    profile: 'Profile',
    myItems: 'My Items',
    mutualLikes: 'Matches',
    openChat: 'Open chat',
    incomingLike: 'You received a like',
    selectUser: 'Select user',
    recommended: 'Recommendations',
    similarPosts: 'Similar posts',
    superLike: 'Super Like',
    superChat: 'Message',
    login: 'Login',
    loginTitle: 'Login',
    loginDesc: 'Choose how to sign in:',
    loginWithGoogle: 'Sign in with Google',
    cancel: 'Cancel',
    chooseUser: 'Choose user',
  },
};

// Поточні налаштування мови та категорії
let currentLang = 'ua';
let selectedCategory = 'all';

// Поточний вибраний стан (усі/нове/б/у)
let selectedCondition = 'all';

// Поточний вибраний користувач
let currentUserId = users[0].id;

// Теперішній відкритий пост у детальному перегляді. Зберігаємо, щоб оновлювати лайк та чат.
let currentPostId = null;

// Лайки за кожного користувача: обʼєкт { userId: { postId: true, ... }, ... }
// Структура userLikes дозволяє бачити, які оголошення лайкнув кожен користувач. При завантаженні сторінки ми
// намагаємося завантажити цю інформацію з localStorage. Якщо нічого не знайдено, ініціалізуємо
// userLikes на основі дефолтних лайків у масиві users (властивість liked).
let userLikes = {};
try {
  const storedUserLikes = localStorage.getItem('userLikes');
  if (storedUserLikes) {
    userLikes = JSON.parse(storedUserLikes) || {};
  }
} catch (e) {
  userLikes = {};
}
// Заповнити userLikes значеннями за замовчуванням для користувачів, які ще не мають запису.
users.forEach((u) => {
  if (!userLikes[u.id]) {
    userLikes[u.id] = {};
    if (Array.isArray(u.liked)) {
      u.liked.forEach((pid) => {
        userLikes[u.id][pid] = true;
      });
    }
  }
});
// Зберегти оновлені дані, щоб забезпечити консистентність localStorage
localStorage.setItem('userLikes', JSON.stringify(userLikes));


// Ініціалізація – викликається після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
  // Спробувати завантажити поточного користувача з localStorage
  const storedCurrentUser = localStorage.getItem('currentUserId');
  if (storedCurrentUser && users.some((u) => u.id === storedCurrentUser)) {
    currentUserId = storedCurrentUser;
  }
  initLanguage();
  populateCategorySelect();
  populateCategoryNav();
  populateConditionFilters();
  populateLocationSelect();
  // Не відображаємо селектор користувача у UI
  //populateUserSelect();
  renderPosts();
  // Відобразити поточного користувача (аватар і ім’я)
  renderCurrentUser();
  addEventListeners();
  // Після ініціалізації оновити бейдж повідомлень
  updateMessagesBadge(getMatchesFor(currentUserId).length);
});

// Встановити мову згідно currentLang
function initLanguage() {
  const langSwitch = document.getElementById('langSwitch');
  langSwitch.textContent = currentLang === 'ua' ? 'EN' : 'UA';
  document.documentElement.lang = currentLang;
  // Оновити placeholder пошуку
  const searchInput = document.getElementById('searchInput');
  searchInput.placeholder = translations[currentLang].searchPlaceholder;
  // Оновити кнопки у модальному вікні чату
  const chatTitle = document.getElementById('chatTitle');
  chatTitle.textContent = translations[currentLang].chatTitle;
  const chatInput = document.getElementById('chatInput');
  chatInput.placeholder = translations[currentLang].enterMessage;
  const sendBtn = document.querySelector('#chatForm button');
  if (sendBtn) sendBtn.textContent = translations[currentLang].send;

  // Оновити текст кнопки профілю
  const profileBtn = document.getElementById('profileBtn');
  if (profileBtn) {
    profileBtn.textContent = translations[currentLang].profile;
  }

  // Оновити текст кнопки входу
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.textContent = translations[currentLang].login;
  }

  // Оновити текст кнопки повідомлень та заголовок
  // Оновити назву в панелі повідомлень
  const messagesTitle = document.getElementById('messagesTitle');
  if (messagesTitle) {
    messagesTitle.textContent = currentLang === 'ua' ? 'Повідомлення' : 'Messages';
  }

  // Оновити назви фільтрів стану
  populateConditionFilters();

  // Оновити локації
  populateLocationSelect();

}

// Заповнює випадаючий список категорій
function populateCategorySelect() {
  const select = document.getElementById('categorySelect');
  // Якщо елемент відсутній (категорії у вигляді dropdown більше немає), припинити
  if (!select) return;
  // Очистити поточний список
  select.innerHTML = '';
  categories.forEach((cat) => {
    const option = document.createElement('option');
    option.value = cat.slug;
    option.textContent = cat.name[currentLang];
    select.appendChild(option);
  });
  select.value = selectedCategory;
}

// Створює горизонтальне меню категорій
function populateCategoryNav() {
  const nav = document.getElementById('categoryNav');
  nav.innerHTML = '';
  categories.forEach((cat) => {
    const link = document.createElement('button');
    link.type = 'button';
    link.className = 'px-4 py-2 text-sm sm:text-base rounded-full border border-secondary bg-surface text-gray-800 hover:bg-primary hover:text-white focus:outline-none focus:bg-primary focus:text-white';
    link.textContent = cat.name[currentLang];
    link.dataset.slug = cat.slug;
    if (cat.slug === selectedCategory) {
      link.classList.add('bg-primary', 'text-white');
    }
    nav.appendChild(link);
  });
}

// Створює кнопки для фільтрів стану (усі/нове/б/у)
function populateConditionFilters() {
  const filtersEl = document.getElementById('conditionFilters');
  if (!filtersEl) return;
  filtersEl.innerHTML = '';
  conditions.forEach((cond) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    /*
      Стили для фільтрів стану.
      Використовуємо більший відступ та товстішу рамку, щоб фільтри виділялися порівняно з кнопками категорій.
      Також додаємо responsive‑класи для адаптивності.
    */
    btn.className = 'px-5 py-2 rounded-full border-2 text-sm sm:text-base font-medium';
    if (cond.slug === selectedCondition) {
      // Активний фільтр: заповнюємо основним кольором
      btn.classList.add('border-primary', 'bg-primary', 'text-white');
    } else {
      // Неактивні: фон — акцент, рамка — основна, текст — основний. При наведенні – зміна на активні кольори.
      btn.classList.add('border-primary', 'bg-accent', 'text-primary', 'hover:bg-primary', 'hover:text-white');
    }
    btn.textContent = cond.name[currentLang];
    btn.dataset.slug = cond.slug;
    btn.addEventListener('click', () => {
      selectedCondition = cond.slug;
      // Перемалювати фільтри
      populateConditionFilters();
      // Перемалювати оголошення
      renderPosts();
    });
    filtersEl.appendChild(btn);
  });
}

// Заповнює список локацій у select #locationSelect
function populateLocationSelect() {
  const select = document.getElementById('locationSelect');
  if (!select) return;
  select.innerHTML = '';
  locations.forEach((loc) => {
    const option = document.createElement('option');
    option.value = loc.slug;
    option.textContent = loc.name[currentLang];
    select.appendChild(option);
  });
  select.value = selectedLocation;
}

// Заповнює випадаючий список користувачів
// У цьому прототипі випадаючий список прихований. Функція залишена для сумісності, але не використовується.
function populateUserSelect() {
  return;
}

// Отримує список користувачів, які лайкнули оголошення користувача userId
function getIncomingUsersFor(userId) {
  const incomingSet = new Set();
  // Перебираємо всі записи userLikes: хто що вподобав
  Object.entries(userLikes).forEach(([likerId, likes]) => {
    if (likerId === userId) return; // не враховуємо самого себе
    Object.keys(likes).forEach((pid) => {
      if (!likes[pid]) return;
      const post = posts.find((p) => p.id === parseInt(pid));
      if (post && post.ownerId === userId) {
        incomingSet.add(likerId);
      }
    });
  });
  return Array.from(incomingSet);
}

// Перевіряє, чи існує взаємний лайк між двома користувачами
function isMatchBetween(userAId, userBId) {
  if (!userLikes[userAId] || !userLikes[userBId]) return false;
  let aLikesB = false;
  let bLikesA = false;
  // Чи лайкнув A щось, що належить B
  Object.keys(userLikes[userAId]).forEach((pid) => {
    if (userLikes[userAId][pid]) {
      const post = posts.find((p) => p.id === parseInt(pid));
      if (post && post.ownerId === userBId) {
        aLikesB = true;
      }
    }
  });
  // Чи лайкнув B щось, що належить A
  Object.keys(userLikes[userBId]).forEach((pid) => {
    if (userLikes[userBId][pid]) {
      const post = posts.find((p) => p.id === parseInt(pid));
      if (post && post.ownerId === userAId) {
        bLikesA = true;
      }
    }
  });
  return aLikesB && bLikesA;
}

// Повертає список користувачів, з якими у userId є взаємні лайки
function getMatchesFor(userId) {
  const incoming = getIncomingUsersFor(userId);
  return incoming.filter((otherId) => isMatchBetween(userId, otherId));
}

// Відображає профіль користувача у вигляді сітки оголошень
function openUserProfile(userId) {
  const user = users.find((u) => u.id === userId);
  const modal = document.getElementById('profileModal');
  if (!modal) return;
  // Встановити заголовок
  const titleEl = document.getElementById('userProfileTitle');
  if (titleEl) {
    // Формуємо заголовок профілю: назва та ім'я користувача
    let titleText = currentLang === 'ua' ? 'Профіль' : 'Profile';
    if (user) {
      titleText += ` – ${user.name[currentLang]}`;
      // Якщо користувач – адміністратор, додаємо галочку
      if (user.isAdmin) {
        titleText += ' ✔️';
      }
      // Якщо у користувача вказана локація, додаємо її в дужках
      if (user.location) {
        const locObj = locations.find((l) => l.slug === user.location);
        if (locObj) {
          titleText += ` (${locObj.name[currentLang]})`;
        }
      }
    }
    titleEl.textContent = titleText;
  }
  // Отримати контейнер для карток
  const grid = document.getElementById('userProfileGrid');
  if (grid) {
    grid.innerHTML = '';
    // Фільтруємо пости користувача
    const userPosts = posts.filter((p) => p.ownerId === userId);
    userPosts.forEach((post) => {
      const card = document.createElement('div');
      card.className = 'bg-surface rounded-xl shadow-md overflow-hidden flex flex-col border border-secondary transition-shadow hover:shadow-lg';
      const img = document.createElement('img');
      img.src = post.image;
      img.alt = post.title[currentLang];
      img.className = 'w-full h-48 object-cover';
      card.appendChild(img);
      const body = document.createElement('div');
      body.className = 'p-4 flex-1 flex flex-col';
      const title = document.createElement('h3');
      title.className = 'font-semibold text-lg mb-1';
      title.textContent = post.title[currentLang];
      const desc = document.createElement('p');
      desc.className = 'text-sm text-gray-700 mb-4 flex-1';
      desc.textContent = post.description[currentLang];
      // Локалізована назва міста для поста
      let locName = '';
      const locObjPost = locations.find((l) => l.slug === post.location);
      if (locObjPost) {
        locName = locObjPost.name[currentLang];
      }
      const locElPost = document.createElement('p');
      locElPost.className = 'text-xs text-gray-600 mb-2';
      locElPost.textContent = locName;
      body.appendChild(title);
      body.appendChild(desc);
      body.appendChild(locElPost);
      // Рядок з кнопками
      const btnRow = document.createElement('div');
      btnRow.className = 'flex items-center justify-between';
      // Кнопка лайку
      const likeBtn = document.createElement('button');
      likeBtn.className = 'text-3xl focus:outline-none';
      likeBtn.innerHTML = '❤️';
      likeBtn.dataset.id = post.id;
      // Чи лайкнув поточний користувач цей пост
      const likedByCurrent = (userLikes[currentUserId] && userLikes[currentUserId][post.id]) || false;
      if (likedByCurrent) {
        likeBtn.classList.add('text-red-500');
      } else {
        likeBtn.classList.add('text-gray-400');
      }
      likeBtn.addEventListener('click', () => {
        toggleLike(post.id);
      });
      // Кнопка чату
      const chatBtn = document.createElement('button');
      chatBtn.className = 'px-3 py-1.5 text-sm md:text-base rounded border border-primary text-primary hover:bg-primary hover:text-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
      chatBtn.textContent = translations[currentLang].chat;
      // Чат можливий, якщо взаємний лайк
      // Чат доступний завжди – не вимикаємо кнопку
      const canChat = true;
      chatBtn.disabled = false;
      chatBtn.addEventListener('click', () => {
        // Закрити профіль, якщо відкритий
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        // Передаємо ідентифікатор поста, щоб у чаті відобразити прев’ю
        openChatWithUser(userId, post.id);
      });
      btnRow.appendChild(likeBtn);
      btnRow.appendChild(chatBtn);
      body.appendChild(btnRow);
      card.appendChild(body);
      grid.appendChild(card);
    });
  }
  // Показати модальне вікно
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

// Відображає список метчів/повідомлень
function renderMessagesList() {
  const listEl = document.getElementById('messagesList');
  if (!listEl) return;
  listEl.innerHTML = '';
  const matches = getMatchesFor(currentUserId);
  // Оновити бейдж на кнопці повідомлень із кількістю метчів
  updateMessagesBadge(matches.length);
  if (matches.length === 0) {
    const p = document.createElement('p');
    p.className = 'text-center text-gray-600';
    p.textContent = currentLang === 'ua' ? 'Немає взаємних лайків' : 'No matches yet';
    listEl.appendChild(p);
    return;
  }
  matches.forEach((uid) => {
    const user = users.find((u) => u.id === uid);
    const item = document.createElement('div');
    item.className = 'flex items-center justify-between border border-secondary rounded px-3 py-2 bg-surface';
    // Ліва частина: аватар та ім’я
    const left = document.createElement('div');
    left.className = 'flex items-center space-x-2';
    const avatarImg = document.createElement('img');
    avatarImg.src = user && user.avatar ? user.avatar : '';
    avatarImg.alt = user ? user.name[currentLang] : '';
    avatarImg.className = 'w-8 h-8 rounded-full';
    left.appendChild(avatarImg);
    const nameSpan = document.createElement('span');
    // Відображаємо галочку для адміністратора
    let displayName = user ? user.name[currentLang] : uid;
    if (user && user.isAdmin) {
      displayName += ' ✔️';
    }
    nameSpan.textContent = displayName;
    left.appendChild(nameSpan);
    // Права частина: кнопка «Чат»
    const btn = document.createElement('button');
    btn.className = 'px-2 py-1 text-xs rounded border border-primary text-primary hover:bg-primary hover:text-white';
    btn.textContent = translations[currentLang].chat;
    btn.addEventListener('click', () => {
      // Закрити панель повідомлень перед відкриттям чату
      const drawer = document.getElementById('messagesDrawer');
      if (drawer) {
        drawer.classList.add('hidden');
      }
      openChatWithUser(uid);
    });
    item.appendChild(left);
    item.appendChild(btn);
    listEl.appendChild(item);
  });
}

// Оновлює бейдж на кнопці повідомлень. Якщо count > 0, показує цифру, інакше приховує бейдж.
function updateMessagesBadge(count) {
  const badge = document.getElementById('messagesBadge');
  if (!badge) return;
  if (count > 0) {
    badge.textContent = count;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

// Основна функція для відображення оголошень
function renderPosts() {
  const feed = document.getElementById('feed');
  feed.innerHTML = '';
  // Отримуємо пошуковий запит
  const searchQuery = document.getElementById('searchInput').value.trim().toLowerCase();
  // Фільтруємо оголошення за категорією та пошуком
  let filtered = posts.filter((post) => {
    // Категорія
    let categoryMatch = true;
    if (selectedCategory === 'recommended') {
      categoryMatch = post.recommended;
    } else if (selectedCategory === 'new') {
      // Для MVP «нові» виводяться у зворотному порядку. Поки що не фільтруємо окремо.
      categoryMatch = true;
    } else if (selectedCategory !== 'all') {
      categoryMatch = post.category === selectedCategory;
    }
    // Пошук
    const title = post.title[currentLang].toLowerCase();
    const desc = post.description[currentLang].toLowerCase();
    const searchMatch = title.includes(searchQuery) || desc.includes(searchQuery);
    // Стан
    let conditionMatch = true;
    if (selectedCondition !== 'all') {
      conditionMatch = post.condition === selectedCondition;
    }
    // Локація
    let locationMatch = true;
    if (selectedLocation && selectedLocation !== 'all') {
      locationMatch = post.location === selectedLocation;
    }
    return categoryMatch && (searchMatch || !searchQuery) && conditionMatch && locationMatch;
  });
  // Якщо обрана категорія "new", виводити оголошення у зворотному порядку (останнє – першим)
  if (selectedCategory === 'new') {
    filtered = [...filtered].reverse();
  }
  // Якщо жодного оголошення не знайдено
  if (filtered.length === 0) {
    const noItem = document.createElement('div');
    noItem.className = 'col-span-full text-center text-gray-500';
    noItem.textContent = translations[currentLang].noPosts;
    feed.appendChild(noItem);
    return;
  }
  filtered.forEach((post) => {
    // Пропустити оголошення, які належать поточному користувачу
    if (post.ownerId === currentUserId) {
      return;
    }
    // Карта для оголошення: однакова карточка для всіх
    const card = document.createElement('div');
    // Більш округлі картки з бордюром у новій палітрі
    card.className = 'bg-surface rounded-xl shadow-md overflow-hidden flex flex-col border border-secondary transition-shadow hover:shadow-lg';
    // Зображення
    const img = document.createElement('img');
    img.src = post.image;
    img.alt = post.title[currentLang];
    // Висота зображення для багатоколонкового відображення
    img.className = 'w-full h-56 object-cover';
    card.appendChild(img);
    // Текстовий блок
    const body = document.createElement('div');
    body.className = 'p-4 flex-1 flex flex-col';
    const title = document.createElement('h3');
    title.className = 'font-semibold text-lg mb-1';
    title.textContent = post.title[currentLang];
    const desc = document.createElement('p');
    desc.className = 'text-sm text-gray-700 mb-4 flex-1';
    desc.textContent = post.description[currentLang];
    // Блок автора: аватар + ім’я як посилання
    const owner = users.find((u) => u.id === post.ownerId);
    const ownerRow = document.createElement('div');
    ownerRow.className = 'flex items-center space-x-2 mb-2';
    // Аватар автора (більший розмір для кращої видимості)
    const ownerAvatar = document.createElement('img');
    ownerAvatar.src = owner && owner.avatar ? owner.avatar : '';
    ownerAvatar.alt = owner ? owner.name[currentLang] : '';
    ownerAvatar.className = 'w-6 h-6 rounded-full';
    ownerRow.appendChild(ownerAvatar);
    // Кнопка з ім’ям автора. Тепер більший шрифт і жирний текст, щоб користувач розумів, що це посилання
    const ownerBtn = document.createElement('button');
    ownerBtn.className = 'text-sm font-semibold text-primary hover:underline focus:outline-none text-left';
    ownerBtn.textContent = owner ? owner.name[currentLang] : post.ownerId;
    ownerBtn.addEventListener('click', (e) => {
      // Зупинити спливання, щоб не відкривалося детальне вікно поста
      e.stopPropagation();
      openUserProfile(post.ownerId);
    });
    ownerRow.appendChild(ownerBtn);
    // Якщо власник – адміністратор, додаємо галочку
    if (owner && owner.isAdmin) {
      const check = document.createElement('span');
      check.textContent = '✔️';
      check.className = 'text-primary ml-1';
      ownerRow.appendChild(check);
    }
    // Додати рядок із локацією (містом)
    // Отримати локалізовану назву міста
    let locName = '';
    const locObj = locations.find((l) => l.slug === post.location);
    if (locObj) {
      locName = locObj.name[currentLang];
    }
    const locEl = document.createElement('p');
    locEl.className = 'text-xs text-gray-600 mb-1';
    locEl.textContent = locName;
    // Додати елементи до body: спочатку автор, потім назва, опис, місце
    body.appendChild(ownerRow);
    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(locEl);
    // Контейнер кнопок
    const btnRow = document.createElement('div');
    btnRow.className = 'flex items-center justify-between';
    // Кнопка лайку
    const likeBtn = document.createElement('button');
    // Збільшимо іконку сердечка (але менше, ніж у версії 1‑кардка)
    likeBtn.className = 'text-3xl focus:outline-none';
    likeBtn.innerHTML = '❤️';
    likeBtn.setAttribute('aria-label', translations[currentLang].like);
    likeBtn.dataset.id = post.id;
    // Позначити, якщо лайкнуто
    const likedByCurrent = (userLikes[currentUserId] && userLikes[currentUserId][post.id]) || false;
    if (likedByCurrent) {
      likeBtn.classList.add('text-red-500');
    } else {
      likeBtn.classList.add('text-gray-400');
    }
    // Кнопка чату
    const chatBtn = document.createElement('button');
    chatBtn.className = 'px-3 py-1.5 text-sm md:text-base rounded border border-primary text-primary hover:bg-primary hover:text-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
    // Текст кнопки — «Чат»/«Chat»
    chatBtn.textContent = translations[currentLang].chat;
    chatBtn.dataset.id = post.id;
    // Дозволити чат лише якщо є взаємний лайк
    // Чат тепер доступний завжди – кнопка активна без взаємного лайку
    const canChat = true;
    chatBtn.disabled = false;
    // Обробник натискання на лайк
    // Обробник лайку: зупиняємо спливання, щоб клік по картці не активувався
    likeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleLike(post.id);
    });
    // Обробник відкриття чату: зупиняємо спливання
    chatBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      // Передаємо ідентифікатор поста, щоб у чаті зʼявилося прев’ю оголошення
      openChatWithUser(post.ownerId, post.id);
    });
    btnRow.appendChild(likeBtn);
    btnRow.appendChild(chatBtn);
    body.appendChild(btnRow);
    card.appendChild(body);
    // Додати обробник натискання на картку: відкриває детальний перегляд
    card.addEventListener('click', () => {
      openPostDetail(post.id);
    });
    feed.appendChild(card);
  });
  // Оновити бейдж повідомлень після перерисування оголошень (кількість метчів може змінитися)
  updateMessagesBadge(getMatchesFor(currentUserId).length);
}

// Переключення лайку для поточного користувача
function toggleLike(postId) {
  // Ініціалізувати список лайків для поточного користувача, якщо відсутній
  if (!userLikes[currentUserId]) {
    userLikes[currentUserId] = {};
  }
  const currentUserLikes = userLikes[currentUserId];
  const isLiked = !!currentUserLikes[postId];
  if (isLiked) {
    // Скасувати лайк
    delete currentUserLikes[postId];
  } else {
    // Поставити лайк
    currentUserLikes[postId] = true;
  }
  // Оновити у пам’яті
  userLikes[currentUserId] = currentUserLikes;
  // Зберегти до localStorage
  localStorage.setItem('userLikes', JSON.stringify(userLikes));
  // Після зміни лайку необхідно перерендерити оголошення та список повідомлень,
  // щоб відобразити нові матчі
  renderPosts();
  renderMessagesList();
}

// Відкрити чат між поточним користувачем та іншим користувачем
// Якщо вказано postId, відобразити превʼю оголошення, до якого стосується чат
function openChatWithUser(otherUserId, postId = null) {
  const chatModal = document.getElementById('chatModal');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatForm = document.getElementById('chatForm');
  // Назва чату: «Чат – [Імʼя]» з аватаром та ім’ям співрозмовника
  const otherUser = users.find((u) => u.id === otherUserId);
  const chatTitleEl = document.getElementById('chatTitle');
  chatTitleEl.textContent = '';
  const container = document.createElement('div');
  container.className = 'flex items-center space-x-2';
  // Префікс "Чат –"
  const prefix = document.createElement('span');
  prefix.textContent = `${translations[currentLang].chat} –`;
  container.appendChild(prefix);
  // Аватар співрозмовника
  const avatar = document.createElement('img');
  avatar.src = otherUser && otherUser.avatar ? otherUser.avatar : '';
  avatar.alt = otherUser ? otherUser.name[currentLang] : '';
  avatar.className = 'w-6 h-6 rounded-full';
  container.appendChild(avatar);
  // Кнопка з ім’ям, натиснувши на яку можна перейти до профілю
  const nameBtn = document.createElement('button');
  nameBtn.className = 'text-primary underline focus:outline-none';
  // Додаємо галочку для адміністратора
  let otherName = otherUser ? otherUser.name[currentLang] : '';
  if (otherUser && otherUser.isAdmin) {
    otherName += ' ✔️';
  }
  nameBtn.textContent = otherName;
  nameBtn.addEventListener('click', () => {
    closeChat();
    openUserProfile(otherUserId);
  });
  container.appendChild(nameBtn);
  chatTitleEl.appendChild(container);
  // Попередній перегляд оголошення
  const previewContainer = document.getElementById('chatPostPreview');
  const previewImage = document.getElementById('chatPostImage');
  const previewTitle = document.getElementById('chatPostTitle');
  const previewDesc = document.getElementById('chatPostDesc');
  if (previewContainer && previewImage && previewTitle && previewDesc) {
    if (postId) {
      // Знайти пост за ідентифікатором
      const postObj = posts.find((p) => p.id === postId);
      if (postObj) {
        previewImage.src = postObj.image;
        previewImage.alt = postObj.title[currentLang];
        previewTitle.textContent = postObj.title[currentLang];
        // Скоротити опис до 80 символів для компактності
        const fullDesc = postObj.description[currentLang];
        previewDesc.textContent = fullDesc.length > 80 ? fullDesc.slice(0, 77) + '…' : fullDesc;
        previewContainer.classList.remove('hidden');
      } else {
        previewContainer.classList.add('hidden');
      }
    } else {
      // Якщо postId не заданий, приховуємо прев’ю
      previewContainer.classList.add('hidden');
    }
  }
  // Ключ чату: сортуємо ідентифікатори, щоб обидва користувачі мали доступ до однієї історії
  const participants = [currentUserId, otherUserId].sort();
  const chatKey = `chat-${participants[0]}-${participants[1]}`;
  // Очистити та завантажити повідомлення з localStorage
  chatMessages.innerHTML = '';
  let messages = [];
  const stored = localStorage.getItem(chatKey);
  if (stored) {
    try {
      messages = JSON.parse(stored) || [];
    } catch (e) {
      messages = [];
    }
  }
  // Відобразити повідомлення
  messages.forEach((msg) => {
    const div = document.createElement('div');
    div.className = 'mb-1';
    const senderName = msg.senderId === currentUserId ? (currentLang === 'ua' ? 'Я' : 'Me') : (users.find((u) => u.id === msg.senderId)?.name[currentLang] || '');
    div.innerHTML = `<span class="font-semibold">${senderName}:</span> ${msg.text}`;
    chatMessages.appendChild(div);
  });
  // Показати модальне вікно
  chatModal.classList.remove('hidden');
  chatModal.classList.add('flex');
  // Автопрокрутка
  chatMessages.scrollTop = chatMessages.scrollHeight;
  chatInput.focus();
  // Обробник відправлення повідомлення
  chatForm.onsubmit = (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    // Додати нове повідомлення
    const newMsg = { senderId: currentUserId, text };
    messages.push(newMsg);
    // Зберегти у localStorage
    localStorage.setItem(chatKey, JSON.stringify(messages));
    // Відобразити
    const div = document.createElement('div');
    div.className = 'mb-1';
    const senderName2 = currentLang === 'ua' ? 'Я' : 'Me';
    div.innerHTML = `<span class="font-semibold">${senderName2}:</span> ${text}`;
    chatMessages.appendChild(div);
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };
}

// Закриття модального вікна чату
function closeChat() {
  const chatModal = document.getElementById('chatModal');
  chatModal.classList.add('hidden');
  chatModal.classList.remove('flex');
}

// Додавання глобальних обробників
function addEventListeners() {
  // Переключення мови
  document.getElementById('langSwitch').addEventListener('click', () => {
    currentLang = currentLang === 'ua' ? 'en' : 'ua';
    initLanguage();
    populateCategorySelect();
    populateCategoryNav();
    renderPosts();
  });
  // Зміна пошуку
  document.getElementById('searchInput').addEventListener('input', () => {
    renderPosts();
  });
  // Зміна категорії у select (dropdown). В цьому дизайні dropdown відсутній, але залишаємо обробник тільки якщо елемент існує.
  const categorySelectEl = document.getElementById('categorySelect');
  if (categorySelectEl) {
    categorySelectEl.addEventListener('change', (e) => {
      selectedCategory = e.target.value;
      // Оновити виділення у навігації
      const navButtons = document.querySelectorAll('#categoryNav button');
      navButtons.forEach((btn) => {
        btn.classList.remove('bg-primary', 'text-white');
        if (btn.dataset.slug === selectedCategory) {
          btn.classList.add('bg-primary', 'text-white');
        }
      });
      renderPosts();
    });
  }
  // Клік по кнопці в навігації
  document.getElementById('categoryNav').addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      selectedCategory = e.target.dataset.slug;
      // Оновити select
      // Якщо елемент select існує (у поточному дизайні його може не бути), оновлюємо його значення
      const catSelectEl = document.getElementById('categorySelect');
      if (catSelectEl) {
        catSelectEl.value = selectedCategory;
      }
      // Перемалювати навігацію з новою виділеною кнопкою
      populateCategoryNav();
      renderPosts();
    }
  });
  // Закриття модального вікна чату
  document.getElementById('chatClose').addEventListener('click', () => {
    closeChat();
  });
  // Чат розташовано внизу і не перекриває сторінку, тому додатковий обробник
  // кліку по затемненій області не потрібен.


  // Вибір користувача прихований у цьому прототипі, тож немає обробника зміни користувача.

  // Профіль власний не використовується у цьому прототипі, тому кнопка профілю відсутня.
  // Закриття профілю (тепер це сторінка профілю користувача)
  document.getElementById('profileClose').addEventListener('click', () => {
    const profileModal = document.getElementById('profileModal');
    profileModal.classList.add('hidden');
    profileModal.classList.remove('flex');
  });
  // Закриття профілю при кліку на затемнену область
  document.getElementById('profileModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('profileModal')) {
      const profileModal = document.getElementById('profileModal');
      profileModal.classList.add('hidden');
      profileModal.classList.remove('flex');
    }
  });

  // Натискання на логотип повертає на головну стрічку.
  const logoHomeEl = document.getElementById('logoHome');
  if (logoHomeEl) {
    logoHomeEl.addEventListener('click', () => {
      // Скинути вибрані категорію, стан та локацію
      selectedCategory = 'all';
      selectedCondition = 'all';
      selectedLocation = 'all';
      // Оновити навігацію та фільтри
      populateCategoryNav();
      populateConditionFilters();
      populateLocationSelect();
      // Перемалювати оголошення
      renderPosts();
      // Приховати модальні вікна, якщо відкриті
      const profModal = document.getElementById('profileModal');
      if (profModal) {
        profModal.classList.add('hidden');
        profModal.classList.remove('flex');
      }
      const msgDrawer = document.getElementById('messagesDrawer');
      if (msgDrawer) {
        msgDrawer.classList.add('hidden');
      }
      // Закрити чат
      closeChat();
    });
  }

  // Відкриття/закриття списку повідомлень/метчів через плаваючу кнопку
  const messagesToggleBtn = document.getElementById('messagesToggleBtn');
  if (messagesToggleBtn) {
    messagesToggleBtn.addEventListener('click', () => {
      const drawer = document.getElementById('messagesDrawer');
      if (!drawer) return;
      if (drawer.classList.contains('hidden')) {
        // Перед відкриттям заповнити список
        renderMessagesList();
        drawer.classList.remove('hidden');
      } else {
        drawer.classList.add('hidden');
      }
    });
  }
  // Закриття панелі повідомлень натисканням на хрестик
  const messagesClose = document.getElementById('messagesClose');
  if (messagesClose) {
    messagesClose.addEventListener('click', () => {
      const drawer = document.getElementById('messagesDrawer');
      if (drawer) drawer.classList.add('hidden');
    });
  }

  // Зміна вибору локації
  const locationSelectEl = document.getElementById('locationSelect');
  if (locationSelectEl) {
    locationSelectEl.addEventListener('change', (e) => {
      selectedLocation = e.target.value;
      renderPosts();
    });
  }

  // Прокрутка категорій за допомогою стрілок
  const catLeftBtn = document.getElementById('categoryLeft');
  const catRightBtn = document.getElementById('categoryRight');
  const categoryNav = document.getElementById('categoryNav');
  if (catLeftBtn && categoryNav) {
    catLeftBtn.addEventListener('click', () => {
      categoryNav.scrollBy({ left: -200, behavior: 'smooth' });
    });
  }
  if (catRightBtn && categoryNav) {
    catRightBtn.addEventListener('click', () => {
      categoryNav.scrollBy({ left: 200, behavior: 'smooth' });
    });
  }

  // Закриття детального перегляду поста
  const postCloseBtn = document.getElementById('postClose');
  if (postCloseBtn) {
    postCloseBtn.addEventListener('click', () => {
      closePostModal();
    });
  }

  // Кнопка назад – повертається на попередній крок. Закриває відкрите модальне вікно або повертає на головну.
  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      handleBackNavigation();
    });
  }
  // Кнопка головна – повертає на головну сторінку (середню стрічку)
  const homeBtn = document.getElementById('homeBtn');
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      // Використовуємо логіку логотипа для повернення
      if (typeof resetToHome === 'function') {
        resetToHome();
      } else {
        // fallback: перезавантажити сторінку
        selectedCategory = 'all';
        selectedCondition = 'all';
        selectedLocation = 'all';
        populateCategoryNav();
        populateConditionFilters();
        populateLocationSelect();
        renderPosts();
        closeChat();
        const profModal = document.getElementById('profileModal');
        if (profModal) profModal.classList.add('hidden');
        const postModal = document.getElementById('postModal');
        if (postModal) postModal.classList.add('hidden');
        const msgDrawer = document.getElementById('messagesDrawer');
        if (msgDrawer) msgDrawer.classList.add('hidden');
      }
    });
  }

  // Відкрити модальне вікно входу при натисканні на кнопку "Вхід"
  const loginBtnEl = document.getElementById('loginBtn');
  if (loginBtnEl) {
    loginBtnEl.addEventListener('click', () => {
      const modal = document.getElementById('loginModal');
      if (!modal) return;
      // Оновити заголовок та опис модального вікна згідно мови
      const loginTitle = document.getElementById('loginTitle');
      const loginDesc = modal.querySelector('p');
      if (loginTitle) loginTitle.textContent = translations[currentLang].loginTitle;
      if (loginDesc) loginDesc.textContent = translations[currentLang].loginDesc;
      populateLoginOptions();
      modal.classList.remove('hidden');
    });
  }
  // Закриття модального вікна входу
  const loginCloseEl = document.getElementById('loginClose');
  if (loginCloseEl) {
    loginCloseEl.addEventListener('click', () => {
      const modal = document.getElementById('loginModal');
      if (modal) modal.classList.add('hidden');
    });
  }
}

// Скидає всі фільтри та приховує всі модальні, повертаючи користувача на головну сторінку
function resetToHome() {
  selectedCategory = 'all';
  selectedCondition = 'all';
  selectedLocation = 'all';
  populateCategoryNav();
  populateConditionFilters();
  populateLocationSelect();
  renderPosts();
  // Приховати всі модальні
  closeChat();
  const profModal = document.getElementById('profileModal');
  if (profModal) {
    profModal.classList.add('hidden');
    profModal.classList.remove('flex');
  }
  const postModalEl = document.getElementById('postModal');
  if (postModalEl) {
    postModalEl.classList.add('hidden');
    postModalEl.classList.remove('flex');
  }
  const msgDrawer = document.getElementById('messagesDrawer');
  if (msgDrawer) {
    msgDrawer.classList.add('hidden');
  }
}

// Обробляє кнопку «Назад»: закриває відкрите модальне вікно, якщо таке існує, або повертає на головну
function handleBackNavigation() {
  const postModalEl = document.getElementById('postModal');
  if (postModalEl && !postModalEl.classList.contains('hidden')) {
    closePostModal();
    return;
  }
  const profileModalEl = document.getElementById('profileModal');
  if (profileModalEl && !profileModalEl.classList.contains('hidden')) {
    profileModalEl.classList.add('hidden');
    profileModalEl.classList.remove('flex');
    return;
  }
  const msgDrawer = document.getElementById('messagesDrawer');
  if (msgDrawer && !msgDrawer.classList.contains('hidden')) {
    msgDrawer.classList.add('hidden');
    return;
  }
  const chatModal = document.getElementById('chatModal');
  if (chatModal && !chatModal.classList.contains('hidden')) {
    closeChat();
    return;
  }
  // Якщо нічого не відкрите, повертаємося на головну
  resetToHome();
}

// Відкрити модальне вікно з детальним переглядом оголошення
function openPostDetail(postId) {
  const post = posts.find((p) => p.id === postId);
  if (!post) return;
  currentPostId = postId;
  const modal = document.getElementById('postModal');
  if (!modal) return;
  // Заголовок
  const titleEl = document.getElementById('postDetailTitle');
  if (titleEl) {
    titleEl.textContent = post.title[currentLang];
  }
  // Галерея зображень
  const mainImg = document.getElementById('postDetailMainImage');
  const thumbContainer = document.getElementById('postDetailThumbnails');
  if (mainImg && thumbContainer) {
    // Очистити контейнер з мініатюрами
    thumbContainer.innerHTML = '';
    // Якщо пост має масив зображень, використовуємо його; інакше створюємо масив з одного зображення
    const imgs = Array.isArray(post.images) && post.images.length > 0 ? post.images : [post.image];
    // Встановити перше зображення як головне
    mainImg.src = imgs[0];
    mainImg.alt = post.title[currentLang];
    // Для кожної картинки створити мініатюру
    imgs.forEach((imgUrl, index) => {
      const thumb = document.createElement('img');
      thumb.src = imgUrl;
      thumb.alt = post.title[currentLang] + ' ' + (index + 1);
      thumb.className = 'w-16 h-16 object-cover rounded cursor-pointer border-2';
      // Підсвічення активної мініатюри
      if (index === 0) {
        thumb.classList.add('border-primary');
      } else {
        thumb.classList.add('border-transparent');
      }
      thumb.addEventListener('click', () => {
        // Змінити головне зображення
        mainImg.src = imgUrl;
        // Оновити підсвічення
        Array.from(thumbContainer.children).forEach((child) => {
          child.classList.remove('border-primary');
          child.classList.add('border-transparent');
        });
        thumb.classList.remove('border-transparent');
        thumb.classList.add('border-primary');
      });
      thumbContainer.appendChild(thumb);
    });
  }
  // Опис
  const descEl = document.getElementById('postDetailDesc');
  if (descEl) {
    descEl.textContent = post.description[currentLang];
  }
  // Локація (місто)
  const locEl = document.getElementById('postDetailLocation');
  if (locEl) {
    const locObj = locations.find((l) => l.slug === post.location);
    locEl.textContent = locObj ? locObj.name[currentLang] : '';
  }
  // Великі кнопки: лайк і чат
  const likeBtn = document.getElementById('postDetailLike');
  const chatBtn = document.getElementById('postDetailChat');
  if (likeBtn) {
    // Встановити стан кольору
    const liked = (userLikes[currentUserId] && userLikes[currentUserId][post.id]) || false;
    likeBtn.classList.remove('text-red-500', 'text-gray-400');
    likeBtn.classList.add(liked ? 'text-red-500' : 'text-gray-400');
    likeBtn.innerHTML = '❤️';
    likeBtn.onclick = () => {
      toggleLike(post.id);
      // Оновити велику кнопку
      const isLikedNow = (userLikes[currentUserId] && userLikes[currentUserId][post.id]) || false;
      likeBtn.classList.remove('text-red-500', 'text-gray-400');
      likeBtn.classList.add(isLikedNow ? 'text-red-500' : 'text-gray-400');
    };
  }
  if (chatBtn) {
    chatBtn.textContent = translations[currentLang].chat;
    // Чат доступний завжди – не вимикаємо кнопку
    chatBtn.disabled = false;
    chatBtn.classList.remove('opacity-50');
    chatBtn.onclick = () => {
      // Закрити детальне вікно
      closePostModal();
      openChatWithUser(post.ownerId, post.id);
    };
  }
  // Заповнення рекомендованих (схожих) оголошень
  const recTitle = document.getElementById('recommendedTitle');
  if (recTitle) {
    recTitle.textContent = translations[currentLang].recommended;
  }
  const recGrid = document.getElementById('recommendedGrid');
  if (recGrid) {
    recGrid.innerHTML = '';
    const recommendations = posts.filter((p) => p.category === post.category && p.id !== post.id).slice(0, 3);
    recommendations.forEach((rec) => {
      const recCard = document.createElement('div');
      recCard.className = 'bg-surface rounded-xl shadow-sm overflow-hidden flex flex-col border border-secondary cursor-pointer hover:shadow-md';
      const recImg = document.createElement('img');
      recImg.src = rec.image;
      recImg.alt = rec.title[currentLang];
      recImg.className = 'w-full h-32 object-cover';
      recCard.appendChild(recImg);
      const recBody = document.createElement('div');
      recBody.className = 'p-2';
      const recTitleEl = document.createElement('h4');
      recTitleEl.className = 'font-semibold text-sm mb-1';
      recTitleEl.textContent = rec.title[currentLang];
      recBody.appendChild(recTitleEl);
      recCard.appendChild(recBody);
      recCard.addEventListener('click', (e) => {
        // Перейти до детального перегляду обраного поста
        openPostDetail(rec.id);
      });
      recGrid.appendChild(recCard);
    });
  }
  // Показати модальне вікно
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

// Закриває детальне вікно поста
function closePostModal() {
  const modal = document.getElementById('postModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  currentPostId = null;
}

// Показати дані поточного користувача у шапці (аватар, ім’я, галочка для адміністратора)
function renderCurrentUser() {
  const loginBtn = document.getElementById('loginBtn');
  const langSwitch = document.getElementById('langSwitch');
  if (!loginBtn || !langSwitch) return;
  const container = langSwitch.parentElement;
  // Видалити попереднє відображення, якщо існує
  const prev = document.getElementById('currentUserDisplay');
  if (prev) {
    prev.remove();
  }
  // Знайти користувача за ідентифікатором
  const user = users.find((u) => u.id === currentUserId);
  if (user) {
    // Приховати кнопку входу
    loginBtn.classList.add('hidden');
    // Створити контейнер для поточного користувача
    const display = document.createElement('div');
    display.id = 'currentUserDisplay';
    display.className = 'flex items-center space-x-2';
    // Аватар
    const avatar = document.createElement('img');
    avatar.src = user.avatar;
    avatar.alt = user.name[currentLang];
    avatar.className = 'w-6 h-6 rounded-full';
    display.appendChild(avatar);
    // Ім’я з галочкою для адміністратора
    const nameSpan = document.createElement('span');
    let nameText = user.name[currentLang];
    if (user.isAdmin) nameText += ' ✔️';
    nameSpan.textContent = nameText;
    nameSpan.className = 'text-sm font-semibold';
    display.appendChild(nameSpan);
    // Додати до контейнера поруч з перемикачем мови
    container.appendChild(display);
  } else {
    // Якщо користувача не знайдено, показати кнопку входу
    loginBtn.classList.remove('hidden');
  }
}

// Заповнює список опцій входу в модальному вікні
function populateLoginOptions() {
  const optionsContainer = document.getElementById('loginOptions');
  if (!optionsContainer) return;
  optionsContainer.innerHTML = '';
  // Створити кнопки для кожного користувача
  users.forEach((u) => {
    const btn = document.createElement('button');
    btn.className = 'w-full flex items-center space-x-3 px-3 py-2 border border-secondary rounded hover:bg-secondary hover:text-white focus:outline-none';
    // Аватар
    const avatar = document.createElement('img');
    avatar.src = u.avatar;
    avatar.alt = u.name[currentLang];
    avatar.className = 'w-6 h-6 rounded-full';
    btn.appendChild(avatar);
    // Ім’я
    const nameSpan = document.createElement('span');
    let nameText = u.name[currentLang];
    if (u.isAdmin) nameText += ' ✔️';
    nameSpan.textContent = nameText;
    nameSpan.className = 'text-sm font-medium flex-1 text-left';
    btn.appendChild(nameSpan);
    // Позначка ролі (Admin / User)
    const roleSpan = document.createElement('span');
    roleSpan.textContent = u.isAdmin ? 'Адмін' : 'Користувач';
    roleSpan.className = 'text-xs italic text-gray-500';
    btn.appendChild(roleSpan);
    // Обробник натискання
    btn.addEventListener('click', () => {
      currentUserId = u.id;
      // Зберегти у localStorage
      localStorage.setItem('currentUserId', currentUserId);
      // Закрити модальне вікно
      const modal = document.getElementById('loginModal');
      if (modal) modal.classList.add('hidden');
      // Оновити відображення користувача
      renderCurrentUser();
      // Перерисувати пости та список повідомлень
      renderPosts();
      renderMessagesList();
      // Оновити бейдж з матчами
      updateMessagesBadge(getMatchesFor(currentUserId).length);
    });
    optionsContainer.appendChild(btn);
  });
  // Додати кнопку входу через Google (демо – вибирає першого користувача)
  const googleBtn = document.createElement('button');
  googleBtn.className = 'w-full flex items-center justify-center px-3 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white focus:outline-none';
  googleBtn.textContent = translations[currentLang].loginWithGoogle;
  googleBtn.addEventListener('click', () => {
    // У демонстраційній версії вибираємо адміністратора як результат входу через Google
    const admin = users.find((u) => u.isAdmin) || users[0];
    currentUserId = admin.id;
    localStorage.setItem('currentUserId', currentUserId);
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.add('hidden');
    renderCurrentUser();
    renderPosts();
    renderMessagesList();
    updateMessagesBadge(getMatchesFor(currentUserId).length);
  });
  optionsContainer.appendChild(googleBtn);
}