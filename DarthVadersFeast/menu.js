
function DishesViewModel() {
    var self = this;
    self.dishes = ko.observableArray([]);
    self.addDish = function (dish) {
        self.dishes.push(dish);
    }
    self.ctx = undefined;
    self.graph = undefined;
    self.totalPrice = ko.observable(0);
    self.numberOfDishes = ko.observable(0);
    self.orderAdresse = ko.observable("");
    self.clear = function () {
        self.totalPrice(0);
        self.numberOfDishes(0)
        self.orderAdresse("");
        for (var i = 0; i < self.dishes().length; i++) {
            var dish = self.dishes()[i];
            dish.count(0);
        }
    }
    self.getDishes = function() {
        var context = new SP.ClientContext('/');
        var targetList = context.get_web().get_lists().getByTitle("Menu");
        var query = SP.CamlQuery.createAllItemsQuery();
        listItems = targetList.getItems(query);
        context.load(listItems);
        context.executeQueryAsync(self.onLoadItemsSuccess, self.onLoadItemsFail);
    }
    self.addDishToOrder = function (dish) {
        self.totalPrice(self.totalPrice() + dish.price); // dish.price;
        self.numberOfDishes(self.numberOfDishes() + 1); // dish.price;
        dish.count(dish.count() + 1);
    }
    self.removeDishFromOrder = function (dish) {
        self.totalPrice(self.totalPrice() - dish.price); // dish.price;
        self.numberOfDishes(self.numberOfDishes() - 1); // dish.price;
        dish.count(dish.count() - 1);
    }
    self.dishLiked = function (dish) {
        dish.likes = dish.likes + 1;
        self.updateGraph();
        self.updateLikes(dish);
    }
    self.updateLikes = function (dish) {
        //alert(dish.id);
        var clientContext = new SP.ClientContext("/");
        var targetList = clientContext.get_web().get_lists().getByTitle("Menu");

        var targetListItem = targetList.getItemById(dish.id);
        targetListItem.set_item('Likes', dish.likes);

        targetListItem.update();

        clientContext.executeQueryAsync(function () { }, function () { });
        //clientContext.load(targetListItem, 'Title');
        //clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
    }
    self.onLoadItemsSuccess = function (sender, args) {
        var listEnumerator = listItems.getEnumerator();
        var item, pin, loc;
        var htmlString = "";
        var ctx = self.createCanvas("MostLikedCanvas");

        var graph = new BarGraph(ctx);
        self.graph = graph;
        graph.maxValue = 30;
        graph.margin = 2;
        graph.colors = ["#49a0d8", "#d353a0", "#ffc527", "#df4c27", "#72FFBB", "#848E2E", "#848EFF", "#df4c27", "#49a0d8", "#d353a0", "#ffc527", "#df4c27"];
        graph.xAxisLabelArr = [];
        graph.values = [];
        var i = 0;
        while (listEnumerator.moveNext()) {
            item = listEnumerator.get_current();
            var dish = {};
            dish.id = item.get_item('ID');
            dish.title = item.get_item('MenuItem');
            dish.picture = item.get_item('ItemPicture').$1_1;
            dish.description = item.get_item('MenuItemDescription');
            dish.price = item.get_item('PricePerUnit');
            dish.count = ko.observable(0);
            dish.likes = item.get_item('Likes') || 0;
            dish.color = graph.colors[i];
            graph.values.push(dish.likes);
            graph.maxValue = Math.max(graph.maxValue, dish.likes);
            dishesViewModel.addDish(dish);
            i++;
        }
        //alert(graph.colors.length);
        //alert(graph.xAxisLabelArr.length);
        //alert(graph.values.length);
        graph.update(graph.values);
        setInterval(function () {
            //graph.update(graph.values);
            //graph.update([Math.random() * 30, Math.random() * 30, Math.random() * 30, Math.random() * 30]);
        }, 1000);

        //$('#Dishes').on("click", "img", dishClicked);
    }
    self.updateGraph = function () {
        var values = [];
        for (var i = 0; i < self.dishes().length; i++) {
            var dish = self.dishes()[i];
            values.push(dish.likes);
            self.graph.maxValue = Math.max(self.graph.maxValue, dish.likes);
        }
        self.graph.update(values);
    }
    self.onLoadItemsFail = function(sender, args) {
        alert('Failed to get lists items. Error:' + args.get_message());
    }
    self.dishClicked = function(dish) {
        //var dish = $(this);
        //alert(JSON.stringify(dish));
        //createOrder(dish);
        //alert('thank you for your order');
    }
    self.placeOrder = function () {
        var clientContext = new SP.ClientContext('/');
        var oList = clientContext.get_web().get_lists().getByTitle('Delivery Orders');

        var itemCreateInfo = new SP.ListItemCreationInformation();
        var oListItem = oList.addItem(itemCreateInfo);
        oListItem.set_item('Title', 'Order placed');
        oListItem.set_item('Total_x0020_Price', self.totalPrice());
        oListItem.set_item('Address', self.orderAdresse());
        var details = "Dishes: "
        //alert(self.dishes().length);
        for (var i = 0; i < self.dishes().length; i++) {
            var dish = self.dishes()[i];
            //alert(JSON.stringify(dish));
            if (dish.count() > 0) {
                details = details + dish.count() + " x " + dish.title + ", ";
            }
        }
        //alert(details);
        oListItem.set_item('Order_x0020_Details', details);
        oListItem.update();

        clientContext.load(oListItem);
        clientContext.executeQueryAsync(
            function () {
                //alert('success');
                self.startRollingText();
            },
            function (sender, args) {
                alert('Request failed. ' + args.get_message() +
                    '\n' + args.get_stackTrace());
            }
        );
    }
    self.startRollingText = function () {
        var placedOrderString = $('#OrderPlacedText').html();
        var menuString = $('#DishesOverview').html();
        $('#DishesOverview').fadeOut()
        $('#OrderReply').fadeIn();
        $('#OrderReply').html(placedOrderString);
        setTimeout(function () {
            $('#DishesOverview').fadeIn()
            $('#OrderReply').fadeOut();
            $('#OrderReply').html();
            self.clear();
            //$('#DishesOverview').html(menuString);
        }, 20000);
    }
    self.createCanvas = function(divName) {

        var div = document.getElementById(divName);
        var canvas = document.createElement('canvas');
        div.appendChild(canvas);
        if (typeof G_vmlCanvasManager != 'undefined') {
            canvas = G_vmlCanvasManager.initElement(canvas);
        }
        var ctx = canvas.getContext("2d");
        return ctx;
    }

}



SP.SOD.executeFunc('sp.js', 'SP.ClientContext', initMenu);

var dishesViewModel = new DishesViewModel();

function initMenu() {
    ko.applyBindings(dishesViewModel);
    dishesViewModel.getDishes("Menu");
}



function createOrder(dish) {
    var clientContext = new SP.ClientContext('/');
    var oList = clientContext.get_web().get_lists().getByTitle('Delivery Orders');

    var itemCreateInfo = new SP.ListItemCreationInformation();
    this.oListItem = oList.addItem(itemCreateInfo);
    oListItem.set_item('Title', 'Order: ' + dish.title);
    oListItem.set_item('Total_x0020_Price', dish.price);
    oListItem.set_item('Order_x0020_Details', "Dish name: " + dish.title);
    oListItem.update();

    clientContext.load(oListItem);
    clientContext.executeQueryAsync(
        Function.createDelegate(this, this.onQuerySucceeded),
        Function.createDelegate(this, this.onQueryFailed)
    );
}

function onQuerySucceeded() {
    alert('Item created: ' + oListItem.get_id());
}

function onQueryFailed(sender, args) {
    alert('Request failed. ' + args.get_message() +
        '\n' + args.get_stackTrace());
}


// Copyright 2011 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

function BarGraph(ctx) {

    // Private properties and methods

    var that = this;
    var startArr;
    var endArr;
    var looping = false;

    // Loop method adjusts the height of bar and redraws if neccessary
    var loop = function () {

        var delta;
        var animationComplete = true;

        // Boolean to prevent update function from looping if already looping
        looping = true;

        // For each bar
        for (var i = 0; i < endArr.length; i += 1) {
            // Change the current bar height toward its target height
            delta = (endArr[i] - startArr[i]) / that.animationSteps;
            that.curArr[i] += delta;
            // If any change is made then flip a switch
            if (delta) {
                animationComplete = false;
            }
        }
        // If no change was made to any bars then we are done
        if (animationComplete) {
            looping = false;
        } else {
            // Draw and call loop again
            draw(that.curArr);
            setTimeout(loop, that.animationInterval / that.animationSteps);
        }
    };

    // Draw method updates the canvas with the current display
    var draw = function (arr) {

        var numOfBars = arr.length;
        var barWidth;
        var barHeight;
        var border = 2;
        var ratio;
        var maxBarHeight;
        var gradient;
        var largestValue;
        var graphAreaX = 0;
        var graphAreaY = 0;
        var graphAreaWidth = that.width;
        var graphAreaHeight = that.height;
        var i;

        // Update the dimensions of the canvas only if they have changed
        if (ctx.canvas.width !== that.width || ctx.canvas.height !== that.height) {
            ctx.canvas.width = that.width;
            ctx.canvas.height = that.height;
        }

        // Draw the background color
        ctx.fillStyle = that.backgroundColor;
        ctx.fillRect(0, 0, that.width, that.height);

        // If x axis labels exist then make room	
        if (that.xAxisLabelArr.length) {
            graphAreaHeight -= 40;
        }

        // Calculate dimensions of the bar
        barWidth = graphAreaWidth / numOfBars - that.margin * 2;
        maxBarHeight = graphAreaHeight - 25;

        // Determine the largest value in the bar array
        var largestValue = 0;
        for (i = 0; i < arr.length; i += 1) {
            if (arr[i] > largestValue) {
                largestValue = arr[i];
            }
        }

        // For each bar
        for (i = 0; i < arr.length; i += 1) {
            // Set the ratio of current bar compared to the maximum
            if (that.maxValue) {
                ratio = arr[i] / that.maxValue;
            } else {
                ratio = arr[i] / largestValue;
            }

            barHeight = ratio * maxBarHeight;

            // Turn on shadow
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowBlur = 2;
            ctx.shadowColor = "#999";

            // Draw bar background
            ctx.fillStyle = "#333";
            ctx.fillRect(that.margin + i * that.width / numOfBars,
              graphAreaHeight - barHeight,
              barWidth,
              barHeight);

            // Turn off shadow
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 0;

            // Draw bar color if it is large enough to be visible
            if (barHeight > border * 2) {
                // Create gradient
                gradient = ctx.createLinearGradient(0, 0, 0, graphAreaHeight);
                gradient.addColorStop(1 - ratio, that.colors[i % that.colors.length]);
                gradient.addColorStop(1, "#ffffff");

                ctx.fillStyle = gradient;
                // Fill rectangle with gradient
                ctx.fillRect(that.margin + i * that.width / numOfBars + border,
                  graphAreaHeight - barHeight + border,
                  barWidth - border * 2,
                  barHeight - border * 2);
            }

            // Write bar value
            ctx.fillStyle = "#333";
            ctx.font = "bold 12px sans-serif";
            ctx.textAlign = "center";
            // Use try / catch to stop IE 8 from going to error town
            try {
                ctx.fillText(parseInt(arr[i], 10),
                  i * that.width / numOfBars + (that.width / numOfBars) / 2,
                  graphAreaHeight - barHeight - 10);
            } catch (ex) { }
            // Draw bar label if it exists
            if (that.xAxisLabelArr[i]) {
                // Use try / catch to stop IE 8 from going to error town				
                ctx.fillStyle = "#333";
                ctx.font = "bold 12px sans-serif";
                ctx.textAlign = "center";
                try {
                    ctx.fillText(that.xAxisLabelArr[i],
                      i * that.width / numOfBars + (that.width / numOfBars) / 2,
                      that.height - 10);
                } catch (ex) { }
            }
        }
    };

    // Public properties and methods

    this.width = 300;
    this.height = 150;
    this.maxValue;
    this.margin = 5;
    this.colors = ["purple", "red", "green", "yellow"];
    this.curArr = [];
    this.backgroundColor = "#fff";
    this.xAxisLabelArr = [];
    this.yAxisLabelArr = [];
    this.animationInterval = 100;
    this.animationSteps = 10;

    // Update method sets the end bar array and starts the animation
    this.update = function (newArr) {

        // If length of target and current array is different 
        if (that.curArr.length !== newArr.length) {
            that.curArr = newArr;
            draw(newArr);
        } else {
            // Set the starting array to the current array
            startArr = that.curArr;
            // Set the target array to the new array
            endArr = newArr;
            // Animate from the start array to the end array
            if (!looping) {
                loop();
            }
        }
    };
}

function createCanvas(divName) {

    var div = document.getElementById(divName);
    var canvas = document.createElement('canvas');
    div.appendChild(canvas);
    if (typeof G_vmlCanvasManager != 'undefined') {
        canvas = G_vmlCanvasManager.initElement(canvas);
    }
    var ctx = canvas.getContext("2d");
    return ctx;
}

