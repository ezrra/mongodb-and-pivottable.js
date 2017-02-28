var items = [
  { "Product" : "Samsung Galaxy S", "OS" : "1.0.2", "Price" : "500" },
  { "Product" : "Samsung Galaxy Nexus", "OS" : "5.0.1", "Price" : "400" },
  { "Product" : "Samsung Galaxy S III", "OS" : "4.4.2", "Price" : "300" },
  { "Product" : "Samsung Galaxy S5", "OS" : "4.4.2", "Price" : "200" },
];

var i = 0;
var row = {};
var random = 0;
var count = items.length - 1;

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

for (i = 0; i < 100; i++) {
  random = getRandom(1, count)
  row = items[random];
  row.Date = new Date();
  db.data.insert(row)
}
