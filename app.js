// LocalStorage
const StorageCtrl = (function () {
    return {
        storeItem: function (item) {
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];

                items.push(item);

                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));

                items.push(item);

                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        restoreStorage: function () {
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        },
        updateItemStorage: function (currentItem) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function (item, index) {
                if (item.id === currentItem.id) {
                    items.splice(index, 1, currentItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemStorage: function (id) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function (item, index) {
                if (item.id === id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        }
    }
})();

// Item Controller
const ItemCtrl = (function () {
    //Item Constructor
    const Item = function (id, name, calorie) {
        this.id = id;
        this.name = name;
        this.calorie = calorie;
    }

    const data = {
        items: StorageCtrl.restoreStorage(),
        currentItem: null,
        totalCalories: 0
    }

    return {
        addData: function (name, calories) {
            let ID = '';
            // Create ID
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            calories = parseInt(calories);
            const newItem = new Item(ID, name, calories);
            data.items.push(newItem);
            return newItem;
        },
        logData: function () {
            return data;
        },
        getItems: function () {
            return data.items;
        },
        addCalories: function () {
            let total = 0;
            data.items.forEach(function (item) {
                total += item.calorie;
            });

            data.totalCalories = total;
        },
        getTotalCalories: function () {
            return data.totalCalories;
        },
        getSelectedData: function (id) {
            let found = null;
            data.items.forEach(function (item) {
                if (item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        setCurrentItem: function (item) {
            data.currentItem = {
                id: item.id,
                name: item.name,
                calorie: item.calorie
            };
            return data.currentItem;
        },
        removeCurrentItem: function () {
            data.currentItem = null;
        },
        updateItem: function (name, calorie) {
            calorie = parseInt(calorie);
            let found = null;

            data.items.forEach(function (item) {
                if (data.currentItem.id === item.id) {
                    item.name = name;
                    item.calorie = calorie;
                    found = item;
                }
            });

            return found;
        },
        getCurrentItem: function () {
            return data.currentItem;
        },
        deleteItem: function (id) {
            const ids = data.items.map(function (item) {
                return item.id
            });

            const index = ids.indexOf(id);

            data.items.splice(id, 1);
        },
        reduceTotalCalories: function (calories) {
            data.totalCalories = data.totalCalories - calories;
        }

    }

})();

// Storage Controller

// UI Controller
const UICtrl = (function () {
    const UISelector = {
        itemList: '#item-list',
        listItem: '#item-list li',
        addBtn: '.add-btn',
        name: '#item-name',
        calories: '#item-calories',
        totalCal: '.total-calories',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn'
    }
    return {
        populateItems: function (items) {
            let html = '';

            items.forEach(function (data) {
                html += ` <li class="collection-item" id="item-${data.id}">
                <strong>${data.name}: </strong> <em>${data.calorie} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
              </li>`;
            });

            document.querySelector(UISelector.itemList).innerHTML = html;
        },
        getSelector: function () {
            return UISelector;
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelector.name).value,
                calorie: document.querySelector(UISelector.calories).value
            }
        },
        addNewItem: function (item) {
            document.querySelector(UISelector.itemList).style.display = 'block';
            const li = document.createElement('li');

            li.className = 'collection-item';

            li.id = `item-${item.id}`;

            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calorie} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;

            document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend', li);

        },
        updateListItem: function (item) {
            let listItems = document.querySelectorAll(UISelector.listItem);

            listItems = Array.from(listItems);
            listItems.forEach(function (listItem) {
                const itemID = listItem.getAttribute('id');
                if (itemID === `item-${item.id}`) {

                    document.querySelector(`#${itemID}`).innerHTML = `
                    <strong>${item.name}: </strong> <em>${item.calorie} Calories</em>
                    <a href="#" class="secondary-content">
                      <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            });
        },
        deleteListItem: function (item) {
            let listItems = document.querySelectorAll(UISelector.listItem);

            listItems = Array.from(listItems);
            listItems.forEach(function (listItem) {
                const itemID = listItem.getAttribute('id');
                if (itemID === `item-${item}`) {

                    document.querySelector(`#${itemID}`).remove();
                }
            });
        },
        hideItems: function () {
            document.querySelector(UISelector.itemList).style.display = 'none';
        },
        removeValues: function () {
            document.querySelector(UISelector.name).value = '';
            document.querySelector(UISelector.calories).value = '';
        },
        displayTotalCalories: function (total) {
            document.querySelector(UISelector.totalCal).textContent = total;
        },
        hideButtons: function () {
            UICtrl.removeValues();
            document.querySelector(UISelector.updateBtn).style.display = 'none';
            document.querySelector(UISelector.deleteBtn).style.display = 'none';
            document.querySelector(UISelector.backBtn).style.display = 'none';
            document.querySelector(UISelector.addBtn).style.display = 'inline';
        },
        showButtons: function () {
            document.querySelector(UISelector.updateBtn).style.display = 'inline';
            document.querySelector(UISelector.deleteBtn).style.display = 'inline';
            document.querySelector(UISelector.backBtn).style.display = 'inline';
            document.querySelector(UISelector.addBtn).style.display = 'none';
        },
        showData: function (data) {
            document.querySelector(UISelector.name).value = data.name;
            document.querySelector(UISelector.calories).value = data.calorie;
            UICtrl.showButtons();
        }

    }
})();

// App Controller
const AppCtrl = (function (ItemCtrl, StorageCtrl, UICtrl) {
    const loadEventListeners = function () {
        const selectors = UICtrl.getSelector();
        document.querySelector(selectors.addBtn).addEventListener('click', itemAddSubmit);
        document.querySelector(selectors.itemList).addEventListener('click', itemUpdateSubmit);
        document.querySelector(selectors.backBtn).addEventListener('click', itemBack);
        document.querySelector(selectors.updateBtn).addEventListener('click', itemUpdateItem);
        document.querySelector(selectors.deleteBtn).addEventListener('click', itemDeleteItem);
    }

    const itemAddSubmit = function (e) {
        const values = UICtrl.getItemInput();
        if (values.name !== '' && values.calorie !== '') {
            const add = ItemCtrl.addData(values.name, values.calorie);
            UICtrl.addNewItem(add);
            UICtrl.removeValues();
            ItemCtrl.addCalories();
            StorageCtrl.storeItem(add);
            const calories = ItemCtrl.getTotalCalories();
            UICtrl.displayTotalCalories(calories)
        }
        e.preventDefault();
    }

    const itemUpdateSubmit = function (e) {
        if (e.target.classList.contains('edit-item')) {
            const listId = e.target.parentNode.parentNode.id;

            const liArr = listId.split('-');

            const selectedData = ItemCtrl.getSelectedData(parseInt(liArr[1]));
            ItemCtrl.setCurrentItem(selectedData);
            // console.log(currentData);
            UICtrl.showData(selectedData);
        }
        e.preventDefault();
    }

    const itemUpdateItem = function (e) {
        const newData = UICtrl.getItemInput();
        const completeData = ItemCtrl.updateItem(newData.name, newData.calorie);
        ItemCtrl.addCalories();
        const calories = ItemCtrl.getTotalCalories();
        UICtrl.updateListItem(completeData);
        UICtrl.displayTotalCalories(calories)
        StorageCtrl.updateItemStorage(completeData);
        e.preventDefault();
    }

    const itemBack = function (e) {
        UICtrl.hideButtons();
        ItemCtrl.removeCurrentItem();
        e.preventDefault();
    }

    const itemDeleteItem = function (e) {
        const currItem = ItemCtrl.getCurrentItem();
        ItemCtrl.deleteItem(currItem.id);
        ItemCtrl.reduceTotalCalories(currItem.calorie)
        UICtrl.deleteListItem(currItem.id);



        const calories = ItemCtrl.getTotalCalories();
        UICtrl.displayTotalCalories(calories);
        StorageCtrl.deleteItemStorage(currItem.id);

        UICtrl.hideButtons();
        ItemCtrl.removeCurrentItem();
        e.preventDefault();
    }

    return {
        init: () => {
            // Hide Items
            UICtrl.hideButtons();
            // Gets the stored items
            const data = ItemCtrl.getItems();

            if (data.length === 0) {
                UICtrl.hideItems();
            } else {
                // Load data on the list
                UICtrl.populateItems(data);
            }

            // Adds the cal on load
            ItemCtrl.addCalories();
            const calories = ItemCtrl.getTotalCalories();
            UICtrl.displayTotalCalories(calories);

            // Load eventListeners
            loadEventListeners();
        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);


AppCtrl.init();