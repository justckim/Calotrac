// Storage Controller
const StorageCtrl = (function() {
  
  return {
    storeItem: function(item) {
      let items;
      // Check if any items in local storage
      if(localStorage.getItem('items') === null) {
        items = [];
        // Push new item to items array
        items.push(item); 
        // Set local storage item
        localStorage.setItem('items', JSON.stringify(items));
      }
      else {
        // Get items already in local storage
        items = JSON.parse(localStorage.getItem('items'));

        // Push new item
        items.push(item); 

        // Re set local storage
        localStorage.setItem('items', JSON.stringify(items));
      }
    }, 
    getItemsFromStorage: function() {
      let items;
      if(localStorage.getItem('items') === null) {
        items = [];
      }
      else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items; 
    },
    updateItemStorage: function(updatedItem) {
      // Get items from local storage
      let items = JSON.parse(localStorage.getItem('items'));
      
      // Loop through items and replace old item with updated Item
      items.forEach(function(item, index) {
        if(updatedItem.id === item.id){
          items.splice(index, 1, updatedItem);
        }
      });

      // Update local storage with updated item
      localStorage.setItem('items', JSON.stringify(items));
    }, 
    deleteItemFromStorage: function(id) {
      // Get items from local storage
      let items = JSON.parse(localStorage.getItem('items'));

      // Loop through items and find item to remove
      items.forEach(function(item, index) {
        if(item.id === id) {
          items.splice(index, 1)
        }
      });

      // Update local storage with deleted item
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearStorage: function() {
      localStorage.removeItem('items'); 
    }
  }
})();

// Item Controller
const ItemCtrl = (function() {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name; 
    this.calories = calories; 
  }

  // Data Structure / State
  const data = {
    // items: [
    //   // {id: 0, name: 'Steak Dinner', calories: 1200},
    //   // {id: 1, name: 'Cookie', calories: 400},
    //   // {id: 2, name: 'Eggs', calories: 300}
    // ], 
    items: StorageCtrl.getItemsFromStorage(), 
    currentItem: null,
    totalCalories: 0
  }

  return {
    getItems: function() {
      return data.items; 
    },
    addItem: function(name, calories) {
      let ID; 
      // Create item ID
      if(data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1; 
      } 
      else {
        ID = 0; 
      }

      // Parse calories to number
      calories = parseInt(calories);
      // Create new item
      newItem = new Item(ID, name, calories); 
      // Add to items array
      data.items.push(newItem);

      return newItem; 
    },
    getItemById: function(id) {
      let found = null; 
      
      // Loop through items and return item with matching id 
      data.items.forEach(function(item) {
        if(item.id === id) {
          found = item;
        }
      });
      return found;

      // return data.items[id];
    },
    updateItem: function(name, calories) {
      // Parse calories to number
      calories = parseInt(calories); 

      let found = null; 

      // Change current item name and calories to form input values 
      data.items.forEach(function(item) {
        if(item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
    
      return found; 

      // data.items[id].name = name;
      // data.items[id].calories = calories; 

      // return data.items[id];
    },
    deleteItem: function(id) {
      // Get ids
      ids = data.items.map(function(item) {
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id); 

      // Remove item
      data.items.splice(index, 1); 
    },
    clearAllItems: function() {
      data.items = [];
    },
    setCurrentItem: function(item) {
      data.currentItem = item; 
    },
    getCurrentItem: function() {
      return data.currentItem; 
    },
    getTotalCalories: function() {
      let total = 0; 

      // Loop through items and add calories
      data.items.forEach(function(item) {
        total += item.calories
      });
      
      // Set total calories in data structure
      data.totalCalories = total;

      return data.totalCalories; 
    },
    logData: function() {
      return data; 
    }
  }
})();

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: '#item-list', 
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  return {
    // Insert all items into the list UI 
    populateItemList: function(items) {
      let html = ''; 

      // Loop through items data structure and append to html 
      items.forEach(function(item) {
        html += `
          <li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil-alt"></i></a>
          </li>
          `;
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html; 
    }, 
    // Get item input values
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    // Add item to list UI 
    addListItem: function(item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      
      // Create <li> element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      // Add id 
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil-alt"></i>
        </a>
      `;
      // Insert <li> 
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },
    // Update list item in UI
    updateListItem(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node list into array 
      listItems = Array.from(listItems);

      // Loop through listItems and check for matching id
      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute('id');
        if(itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil-alt"></i>
            </a>
          `;
        }
      });
    },
    // Delete list item from UI
    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove(); 
    },
    // Clear form inputs
    clearInputs: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    // Add current item to form
    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.setEditState(); 
    },
    clearItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems); 

      // Turn Node List into Array
      listItems = Array.from(listItems);

      listItems.forEach(function(item) {
        item.remove(); 
      })
    },
    // Hide List 
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    // Update total calories 
    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    // Set inital state / clear edit state
    setInitState: function() {
      UICtrl.clearInputs(); 
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    // Set edit state
    setEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    // Get DOM selectors
    getSelectors: function(){
      return UISelectors;
    }
  }
})();


// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors(); 

    // Add-item click event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit on 'enter' key press
    document.addEventListener('keypress', function(e) {
      if(e.keyCode === 13 || e.which === 13) {
        e.preventDefault(); 
        return false; 
      }
    });

    // Edit-icon click event (added to the parent element of the edit icon, the item list)
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update item click event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
    
    // Delete item click event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Back button click event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.setInitState);
    
    // Clear button click event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
  }

  // Add item event
  const itemAddSubmit = function(e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput(); 

    // Check if name and calories input are empty
    if(input.name !== '' && input.calories !== '') {
      // Add item to data structure
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      
      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories(); 

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories); 

      // Store in localStorage
      StorageCtrl.storeItem(newItem);

      // Clear meal and calorie input fields
      UICtrl.clearInputs(); 
    }

    e.preventDefault(); 
  }

  // Edit item event
  const itemEditClick = function(e) {
    if(e.target.classList.contains('edit-item')) {
      // Get list item id (item-0, item-1, etc.)
      const listId = e.target.parentNode.parentNode.id;
      
      // Break list item into an array 
      const listIdArr = listId.split('-');
      
      // Get id 
      const id = parseInt(listIdArr[1]);

      // Get item 
      const itemToEdit = ItemCtrl.getItemById(id); 

      // Set item to currentItem
      ItemCtrl.setCurrentItem(itemToEdit); 

      // Add item to form
      UICtrl.addItemToForm(); 
    }
    
    e.preventDefault(); 
  };

  // Update item event
  const itemUpdateSubmit = function(e) {
    // Get item inputs
    const input = UICtrl.getItemInput(); 

    // Get item id 
    const id = ItemCtrl.getCurrentItem().id; 

    // Update item in data structure
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories); 

    // Update item in UI
    UICtrl.updateListItem(updatedItem); 

    // Get total calories
    totalCalories = ItemCtrl.getTotalCalories(); 
  
    // Update total calories in UI 
    UICtrl.showTotalCalories(totalCalories); 

    // Update local storage
    StorageCtrl.updateItemStorage(updatedItem);

    // Clear edit state (set back to initial state)
    UICtrl.setInitState(); 

    e.preventDefault(); 
  };

  // Delete item event
  const itemDeleteSubmit = function(e) {
    // Get current item 
    const currentItem = ItemCtrl.getCurrentItem(); 

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get total calories
    totalCalories = ItemCtrl.getTotalCalories(); 
  
    // Update total calories in UI 
    UICtrl.showTotalCalories(totalCalories); 

    // Delete item from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id); 

    // Clear edit state (set back to initial state)
    UICtrl.setInitState(); 

    e.preventDefault(); 
  }

  // Clear all items event
  const clearAllItemsClick = function() {
    // Delete all items from data structure
    ItemCtrl.clearAllItems(); 

    // Get total calories
    totalCalories = ItemCtrl.getTotalCalories(); 
  
    // Update total calories in UI 
    UICtrl.showTotalCalories(totalCalories); 

    // Clear all items from UI
    UICtrl.clearItems(); 

    //Clear all items from local storage
    StorageCtrl.clearStorage(); 
    
    // Hide UL 
    UICtrl.hideList(); 
  }

  // App Controller returns init function which initializes application and functions
  return {
    init: function() {
      // Set initial state
      UICtrl.setInitState(); 

      // Fetch items from data structure
      const items = ItemCtrl.getItems(); 

      // Check if any items 
      if(items.length === 0) {
        UICtrl.hideList(); 
      }
      else {
        // Populate list with items
        UICtrl.populateItemList(items); 
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories(); 

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories); 
    
      // Load event listeners
      loadEventListeners(); 
    }
  }

})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();