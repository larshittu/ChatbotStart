const Order = require("./assignment1Order");

const OrderState = Object.freeze({
  WELCOMING: Symbol("welcoming"),
  SIZE: Symbol("size"),
  TOPPINGS: Symbol("toppings"),
  DRINKS: Symbol("drinks"),
});

var sizePrice = 0;
var drinkPrice = 0;

//Creating available size list
var itemsize = ["Small", "Medium", "Large"];
//setting up available size prices
var itemprice = [484, 534, 645];

//Creating available drinks list
var drinksName = [
  "Canada Dry",
  "Cannonball",
  "Clearly Canadian",
  "Cott",
  "Pop Shoppe",
  "President's Choice",
];
//setting up available drinks prices
var drinksPrice = [184, 234, 45, 84, 54, 48];

//Generating available item size list
var sizelist = "\n";
for (var i = 0; i < itemsize.length; i++) {
  sizelist += `${[i]} - ${itemsize[i]}: $${itemprice[i]}` + "\n";
}

//Generating available drinks list
var drinklist = "\n";
for (var i = 0; i < drinksName.length; i++) {
  drinklist += `${[i]} - ${drinksName[i]}: $${drinksPrice[i]}` + "\n";
}
drinklist += "\n\n" + "You may say no.";

module.exports = class ShwarmaOrder extends Order {
  constructor() {
    super();
    this.stateCur = OrderState.WELCOMING;
    this.sSize = "";
    this.sToppings = "";
    this.sDrinks = "";
    this.sItem = "Shawarama";
  }

  //Customer Input filtering
  handleInput(sInput) {
    let aReturn = [];
    switch (this.stateCur) {
      case OrderState.WELCOMING:
        this.stateCur = OrderState.SIZE;
        aReturn.push("Welcome to Prisca's Shawarma.");
        aReturn.push(`What size would you like? ${sizelist}`);
        break;
      case OrderState.SIZE:
        //Checking if customer selection is available is the displayed list
        if (typeof itemsize[sInput] == "undefined") {
          this.stateCur = OrderState.SIZE;
          aReturn.push(`Wrong size, kindly choose within size: ${sizelist}`);
          break;
        }
        this.stateCur = OrderState.TOPPINGS;
        this.sSize = sInput;
        aReturn.push("What toppings would you like?");
        break;
      case OrderState.TOPPINGS:
        this.stateCur = OrderState.DRINKS;
        this.sToppings = sInput;
        aReturn.push(`Would you like drinks with that? ${drinklist}`);
        break;
      case OrderState.DRINKS:
        if (sInput.toLowerCase() != "no") {
          //Checking if customer selection is available is the displayed list
          if (typeof drinksName[sInput] == "undefined") {
            this.stateCur = OrderState.DRINKS;
            aReturn.push(
              `Wrong drink, kindly choose within available drinks: ${drinklist}`
            );
            break;
          }
          this.sDrinks = sInput;
        }
        this.isDone(true);

        aReturn.push("Thank-you for your order of");
        //Setting any prevoius drinks select value to 0
        drinkPrice = 0;
        //Checking if drinks is choosen
        if (this.sDrinks) {
          drinkPrice = drinksPrice[`${this.sDrinks}`];
        }

        sizePrice = itemprice[`${this.sSize}`];
        var total = sizePrice + drinkPrice;
        switch (drinkPrice) {
          case 0:
            //Customer order reciept pushing
            aReturn.push(
              "Order Reciept:" +
                "\n" +
                itemsize[`${this.sSize}`] +
                ` ${this.sItem} with ${this.sToppings}: $` +
                itemprice[`${this.sSize}`] +
                "\n" +
                `Total: $${total}`
            );
            break;
          default:
            aReturn.push(
              "Order Reciept:" +
                "\n" +
                itemsize[`${this.sSize}`] +
                ` ${this.sItem} with ${this.sToppings}: $` +
                itemprice[`${this.sSize}`] +
                "\n" +
                "Drinks " +
                drinksName[`${this.sDrinks}`] +
                ": $" +
                drinksPrice[`${this.sDrinks}`] +
                "\n" +
                `Total: $${total}`
            );
            break;
        }

        let d = new Date();
        d.setMinutes(d.getMinutes() + 20);
        aReturn.push(`Please pick it up at ${d.toTimeString()}`);
        break;
    }
    return aReturn;
  }
};
