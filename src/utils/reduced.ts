type Details = {
  distance: any;
  duration: any;
  status: string;
};

function reduced(addresses: string[], distDetails: Details[]) {
  const store: any = {};

  for (let index = 0; index < distDetails.length; index++) {
    if (!store[addresses[index]] && distDetails[index].status === 'OK') {
      store[addresses[index]] = distDetails[index];
    }
  }

  return store;
}

interface obj {
  [key: string]: any;
}

export function getNearestAddress(object1: obj) {
  let minVal = Infinity;
  let minDist;

  const newArr = Object.entries(object1);

  for (let index = 0; index < newArr.length; index++) {
    let [key, value] = newArr[index];

    if (value.distance.value < minVal) {
      minVal = value.distance.value;
      minDist = key;
    }
    continue;
  }

  return { minVal, minDist };
}

export default reduced;
