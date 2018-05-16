const random = (x, y) => {
  return {
    x: Number(`${x}.${Math.floor(Math.random() * 1000000 + 1)}`),
    y: Number(`${y}.${Math.floor(Math.random() * 1000000 + 1)}`)
  };
};

//console.log(random(14, 100));
