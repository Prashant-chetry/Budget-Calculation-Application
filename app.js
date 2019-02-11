/*===================
    Budget calculation
====================*/

var budgetCalculation = (function (){

 //function constructor for expense
//  let Expense = function(id, description, value){
//     this.id=id;
//     this.description=description;
//     this.value=value;
//  };
class Expense {
    constructor(id, description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    //Calculating the percentage of each of the expense
    calPercentage(totalIn){
    //Because we cannot divide a number with zero 
    if(totalIn > 0){
        //Creates a percentage funciton inside each of the object
     this.percentage = Math.round((this.value / totalIn) * 100);
    }else{
        // -1 indicates NULL
        this.percentage = -1;
    }
    };
    //Returning the calPercentage value 
    getPercentage(){
        return this.percentage;
    };
};


 //function constructor for income
//  let Income = function(id, description, value){
//     this.id = id;
//     this.description = description;
//     this.value = value;
//  };

    class Income{
        constructor(id, description, value){
            this.id = id;
            this.description =description;
            this.value = value;
        };
    };

 //Data container for the data being used in the program
 var data = {
     allitems: {
         exp: [],
         inc: []
     },

     total: {
         exp: 0,
         inc: 0
     },
     budget: 0,
     percentage: 0
 };

 //Calculate the total value of the INCOME and EXPENSE 
 var calculateTotal = function(type){
    var sum=0;
     //here the current represents the current object in the array
    data.allitems[type].forEach(function(current){
        sum += current.value;
    });
    data.total[type] = sum;
 };

 //Public object which is used to add Item to the 'data' object which is private
 return {
     addItem: function (type, des, val){
                var newItem, ID;

                //Creating new ID for every object
                if(data.allitems[type].length > 0){
                    ID = data.allitems[type][data.allitems[type].length - 1].id + 1;
                }
                else{
                    ID = 0;
                }

                if(type === 'exp'){
                    newItem = new Expense(ID, des, val);
                }
                else if(type === 'inc'){
                    newItem = new Income(ID, des, val);
                }

                //since the name of the value of type is same as the property of the object allitems i.e 'inc' or 'exp'
                //and Then pushing the newly created object into the Array
                data.allitems[type].push(newItem);

                return newItem;
     },
     deleteItem: function(type, id){
            // Select which array go to
            var ids = data.allitems[type].map(function(current){
                return current.id;
            });

            //get the IndexOf the id
            var index = ids.indexOf(id);

            //delete the object from the array

            if(index !== -1){
                data.allitems[type].splice(index, 1);
            }
            
     },
     calculateBudget: function(){
         //calculate total income and expense
            calculateTotal('exp');
            calculateTotal('inc');

         //calculate the budget: income - expense
            data.budget = data.total.inc - data.total.exp;

            // calculate the percentage of income that we spent
            if (data.total.inc > 0) {
                data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
            } else {
                data.percentage = -1;
            }            
            
     },
     calculatePercentage: function(){
         /*
         a=20
         b=50
         c=90
         income =100
         a = 20/100 = 20%
         b = 50/100 = 50%
         c = 90/100 = 90%
         */
        //Calling the calPercentage function for each of the Object inside exp array
        data.allitems.exp.forEach(function(curr){
            curr.calPercentage(data.total.inc);
        });
     },
     getBudget: function() {
        return {
            budget: data.budget,
            totalInc: data.total.inc,
            totalExp: data.total.exp,
            percentage: data.percentage
        };
    },
    getPercentages: function(){
        //creating and storing each percentage inside a array called allPer
        var allPer = data.allitems.exp.map(function(curr){
            return curr.getPercentage;
        });
        //returning the array
        return allPer;
    },
     test: function(){
         console.log(data);
        }
 };

})();


/*==================
    UI control
==================*/
var UiControl = (function(){

    // These Object containes all the Class Names being used in JavaScript
    let DOMstrings = {
        InputType: '.add__type',
        InputDescription: '.add__description',
        InputValue: '.add__value',
        InputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenceContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        expenseLabel: '.budget__expenses--value',
        incomeLabel: '.budget__income--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensePerLabel: '.item__percentage'
    };

    //
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.InputType).value,  //return either 'inc' or 'exp'
                description: document.querySelector(DOMstrings.InputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.InputValue).value)
            };
        },
        getDOMstrings: function(){
            return DOMstrings;
        },

        addListItem: function(obj, type){
            var html, newHTML, element;
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                //Create the HTML 
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }
            else if(type === 'exp'){
                element = DOMstrings.expenceContainer;
                //Create the HTML
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
                //Replace the desired elements
                newHTML = html.replace('%id%', obj.id);
                newHTML = newHTML.replace('%description%', obj.description);
                newHTML = newHTML.replace('%value%', obj.value);

                //Insert the HTMl in the DOM
                document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
        },
        deleteListitem: function(itemID){
            var el = document.getElementById(itemID);
            el.parentNode.removeChild(el);
        },
        clearItem: function(){
            let field ,fieldArr;
            field = document.querySelectorAll(DOMstrings.InputDescription + ', ' + DOMstrings.InputValue);
            console.log(field);

            //create a new array called fieldArr
            fieldArr = Array.prototype.slice.call(field);
            console.log(fieldArr);
            fieldArr.forEach(function(current, index, array){
                current.value='';
            });

            fieldArr[0].focus();
        },

        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent =  obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
            document.querySelector(DOMstrings.percentageLabel).textContent = '---';
        }
    },
    displayPercentage: function(){
        document.querySelector()
    }

    };

})();


/*=====================
    Global Controller
=====================*/
var globalController = (function(budgetctrl, uictrl){

    //function for Initital Event Listener Setup
    var setupEventListener = function(){
        var DOMstrings = uictrl.getDOMstrings();

        //When pessed the click button, An item is Added
        document.querySelector(DOMstrings.InputBtn).addEventListener('click', ctrlAddItem);

        //When pressed a ENTER button, An item is Added
        document.addEventListener('keypress', function(event){
            if(event.keyCode===13 || event.which===13){
                console.log('Enter');
                ctrlAddItem();
            }
        });

        //When pressed the Click button, The clicked item is Deleted
        document.querySelector(DOMstrings.container).addEventListener('click', ctrlDeleteItem);

    };

    //Function for Adding item
    var ctrlAddItem = function(){
        // 1. Take the inputed value from the fields
        var input = uictrl.getInput();
        console.log(input);

        //to check if the value are empty or not
        if(input.description!== "" && !isNaN(input.value) && input.value > 0){
        //2. Add the value to the Budget Controller
        var newItem = budgetctrl.addItem(input.type, input.description, input.value);
        console.log(newItem);

        //3. Add the value to the Ui controller
        uictrl.addListItem(newItem, input.type);
        
        //4. Clear the Fields
        uictrl.clearItem();

        //5. Calculate and update the Budget
        updateBuget();
        
        //calculate and update the percentage
        updatePercentage();
        }
    };
    
    //Function for Deleting an item
    var ctrlDeleteItem = function(event){
        let itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        splitID = itemID.split('-');
        type = splitID[0];
        ID = parseInt(splitID[1]);
        if(itemID){

        //1. delete the Item from the data Structure
            budgetctrl.deleteItem(type, ID);
        
        //2. Delete the Item from the UI
            uictrl.deleteListitem(itemID);

        //3. Update and Show the new Budget
            updateBuget();
        //4.calculate and update the percentage
            updatePercentage();
            
        }
    };


    var updateBuget = function(){

        // 1. Calculate the value of the Budget
        budgetctrl.calculateBudget();

        // 2. Return the Budget
        //the return object is stored in the variable getvalue and the getValue become an object 
        var getValue = budgetctrl.getBudget();

        //3. Display the value to the UI 
        console.log(getValue);
        uictrl.displayBudget(getValue);
    };

    var updatePercentage = function(){
        //1. calculate the Percentage of each Object 
        budgetctrl.calculatePercentage();

        //2. Read the Percentage
        //getting the Percentage of each Object
        //and storing it inside a array called percentage
        var percentage = budgetctrl.getPercentages();

        //3. UI update 
        

    };

    return {
        inti: function(){
            setupEventListener();

            uictrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
        }
    };

})(budgetCalculation, UiControl);

globalController.inti();