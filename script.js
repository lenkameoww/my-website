// Элементы
const titleInput = document.getElementById('artifact-title');
const categoryInput = document.getElementById('artifact-category');
const imageInput = document.getElementById('artifact-image');
const addBtn = document.getElementById('add-btn');
const searchInput = document.getElementById('search-input');
const gallery = document.getElementById('gallery');
const counter = document.getElementById('count');
const themeBtn = document.getElementById('theme-btn');
const errorBanner = document.getElementById('error-banner');
const categoryTabs = document.getElementById('category-tabs');
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('close-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalCategory = document.getElementById('modal-category');

// Данные
let allCards = [];
let allCategories = ['Все'];

// обновление категорий
function updateCategories() {
    // Получаем все уникальные категории из существующих карточек
    const existingCategories = new Set();
    allCards.forEach(card => {
        existingCategories.add(card.dataset.category);
    });

    // Добавляем "Все" в список категорий
    const allCategoriesList = ['Все', ...Array.from(existingCategories)];

    // Обновляем вкладки категорий
    categoryTabs.innerHTML = ''; // Очищаем все вкладки

    // Создаем новые вкладки только для существующих категорий
    allCategoriesList.forEach(cat => {
        const tab = document.createElement('button');
        tab.className = 'category-tab';
        tab.textContent = cat;
        tab.dataset.category = cat;

        // Общий обработчик для ВСЕХ вкладок (включая "Все")
        tab.onclick = function() {
            // Убираем active у всех вкладок
            document.querySelectorAll('.category-tab').forEach(t => {
                t.classList.remove('active');
            });

            // Добавляем active этой вкладке
            this.classList.add('active');

            // Фильтруем карточки
            const selectedCat = this.dataset.category;
            allCards.forEach(card => {
                if (selectedCat === 'Все') {
                    card.style.display = 'block';
                } else {
                    const cardCat = card.dataset.category;
                    card.style.display = cardCat === selectedCat ? 'block' : 'none';
                }
            });
        };

        // Если это вкладка "Все", делаем ее активной по умолчанию
        if (cat === 'Все') {
            tab.classList.add('active');
        }

        categoryTabs.appendChild(tab);
    });
}

// 1. Создание карточки
function createCard(title, category, image) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.category = category; // сохраняем категорию в data-атрибут

    const img = document.createElement('img');
    img.className = 'card-image';
    img.src = image;
    img.alt = title;

    // Клик на картинку открывает модалку
    img.onclick = function() {
        modalImg.src = image;
        modalTitle.textContent = title;
        modalCategory.textContent = 'Категория: ' + category;
        modal.style.display = 'block';
        modal.classList.add('show'); // используем show вместо
    };

    const content = document.createElement('div');
    content.className = 'card-content';

    const h3 = document.createElement('h3');
    h3.className = 'card-title';
    h3.textContent = title;

    const p = document.createElement('p');
    p.className = 'card-category';
    p.textContent = 'Категория: ' + category;

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Удалить';

    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = 'favorite-btn';
    favoriteBtn.innerHTML = '🤍';

    // Удаление
    deleteBtn.onclick = function() {
        card.remove();
        allCards = allCards.filter(c => c !== card);
        counter.textContent = allCards.length;

        updateCategories();
    };

    // Избранное
    favoriteBtn.onclick = function() {
        if (card.classList.contains('favorite')) {
            card.classList.remove('favorite');
            favoriteBtn.innerHTML = '🤍';
        } else {
            card.classList.add('favorite');
            favoriteBtn.innerHTML = '❤️';
        }
    };

    actions.appendChild(deleteBtn);
    actions.appendChild(favoriteBtn);
    content.appendChild(h3);
    content.appendChild(p);
    content.appendChild(actions);
    card.appendChild(img);
    card.appendChild(content);

    return card;
}

// 2. Добавление карточки
addBtn.onclick = function() {
    const title = titleInput.value.trim();
    const category = categoryInput.value.trim();
    const image = imageInput.value.trim();

    if (!title || !category || !image) {
        errorBanner.style.display = 'block';
        return;
    }

    errorBanner.style.display = 'none';

    const card = createCard(title, category, image);
    gallery.appendChild(card);
    allCards.push(card);

    counter.textContent = allCards.length;

    // Добавляем категорию
    addCategory(category);

    titleInput.value = '';
    categoryInput.value = '';
    imageInput.value = '';
};

// 3. Добавление категории
function addCategory(category) {
    if (!allCategories.includes(category)) {
        allCategories.push(category);

        const tab = document.createElement('button');
        tab.className = 'category-tab';
        tab.textContent = category;
        tab.dataset.category = category;

        tab.onclick = function() {
            // Убираем active у всех
            document.querySelectorAll('.category-tab').forEach(t => {
                t.classList.remove('active');
            });

            // Добавляем active этому
            this.classList.add('active');

            // Фильтруем
            const cat = this.dataset.category;
            allCards.forEach(card => {
                if (cat === 'all') {
                    card.style.display = 'block';
                } else {
                    // Используем dataset.category карточки
                    const cardCat = card.dataset.category;
                    card.style.display = cardCat === cat ? 'block' : 'none';
                }
            });
        };

        categoryTabs.appendChild(tab);
    }
}

// 4. Поиск
searchInput.oninput = function() {
    const search = this.value.toLowerCase().trim();

    allCards.forEach(card => {
        // Получаем элемент с категорией
        const categoryElement = card.querySelector('.card-category');

        if (categoryElement) {
            // Получаем текст категории и преобразуем
            const categoryText = categoryElement.textContent.toLowerCase();
            // Убираем "Категория: " и лишние пробелы
            const category = categoryText.replace('категория:', '').trim();

            if (search === '' || category.includes(search)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
};

// 5. Тема
themeBtn.onclick = function() {
    document.body.classList.toggle('dark-theme');
    this.textContent = document.body.classList.contains('dark-theme')
        ? 'Светлая тема'
        : 'Тёмная тема';
};

// 6. Закрытие модалки
closeModalBtn.onclick = function() {
    modal.style.display = 'none';
};

// Клик вне модалки тоже закрывает
modal.onclick = function(e) {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
};

// 7. Загрузка примеров
window.onload = function() {
    const examples = [
        { title: 'Горный пейзаж', category: 'Природа', image: 'images/Architect.jpg' },
        { title: 'Город ночью', category: 'Город', image: 'images/Forest.jpg' },
        { title: 'Лесная тропа', category: 'Природа', image: 'images/Mountain.jpg' },
        { title: 'Архитектура', category: 'Город', image: 'images/NightCity.jpg' }
    ];

    examples.forEach(example => {
        const card = createCard(example.title, example.category, example.image);
        gallery.appendChild(card);
        allCards.push(card);
        addCategory(example.category);
    });

    counter.textContent = allCards.length;

    //ОБРАБОТЧИК ДЛЯ КНОПКИ "ВСЕ"
    const allTab = document.querySelector('[data-category="all"]');
    allTab.onclick = function() {
        // Убираем active у всех вкладок
        document.querySelectorAll('.category-tab').forEach(t => {
            t.classList.remove('active');
        });

        // Добавляем active этой вкладке
        this.classList.add('active');

        // Показываем все карточки
        allCards.forEach(card => {
            card.style.display = 'block';
        });
    };
};