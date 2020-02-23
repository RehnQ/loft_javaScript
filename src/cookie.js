/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответсвует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

function loadCookies() {
    return document.cookie
        .split('; ')
        .reduce((p, c) => {
            let [name, value] = c.split('=');
            if (value) {
                p.push({
                    name,
                    value
                });
            }

            return p;
        }, [])
        .filter(cookie => isMatching(cookie.name, filterNameInput.value) || isMatching(cookie.value, filterNameInput.value));
}

function addToTable(cookies, where) {
    where.innerHTML = '';

    for (let cookie of cookies) {
        addCookieTable(cookie.name, cookie.value, where);
    }
}

function isMatching(full, chunk) {
    return full.toLowerCase().indexOf(chunk.toLowerCase()) !== -1;
}

function addCookieTable(cookieKey, cookieValue, where) {
    let element = document.createElement('tr');
    element.innerHTML = `<td>${cookieKey}</td><td>${cookieValue}</td><td><button data-key="${cookieKey}">Удалить</button></td>`;
    where.appendChild(element);
}

function deleteCookie(key) {
    let date = new Date();

    date.setDate(date.getDate() - 1);
    document.cookie = `${key}=''; expires=${date.toUTCString()}`;
}

filterNameInput.addEventListener('keyup', function() {
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
    addToTable(loadCookies(), listTable);
});

addButton.addEventListener('click', () => {
    // здесь можно обработать нажатие на кнопку "добавить cookie"
    document.cookie = `${addNameInput.value}=${addValueInput.value}`;

    //addNameInput.value = '';
    //addValueInput.value = '';
    addToTable(loadCookies(), listTable);
});

listTable.addEventListener('click', e => {
    if (e.target.getAttribute('data-key')) {
        deleteCookie(e.target.getAttribute('data-key'));

        let parentTR = e.target.closest('tr');
        if (parentTR) {
            listTable.removeChild(parentTR);
        }
    }
});

addToTable(loadCookies(), listTable);
