import utils from "./utils";

const getArcVals = (i) => {
  const ang = utils.map(i, 0, 9, 0, Math.PI);
  const x = 2 * Math.sin(ang) + 3;
  const z = 2 * Math.cos(ang);
  return { position: [x, 0.5, z], rotation: [0, ang, 0] };
};

const getDominos = () => {
  const dominos = [];

  utils.range(10).forEach((i) => {
    dominos.push({
      ...getArcVals(i)
    });
  });

  utils.range(15).forEach((i) => {
    dominos.push({
      position: [utils.map(i, 0, 15, -5, 3), 0.51, -2]
    });
    dominos.push({
      position: [utils.map(i, 0, 15, -5, 3), 0.51, 2]
    });
  });

  return dominos;
};

export default getDominos;
