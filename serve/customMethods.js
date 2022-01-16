String.prototype.toCamelCase = function toCamelCase() {
  const words = this.split(' ');
  return words.map((word, i) => i ? word.toCapitalCase() : word.toLowerCase()).join('');
}

String.prototype.toCapitalCase = function toCapitalCase() {
  return this[0].toUpperCase() + this.slice(1).toLowerCase();
}

