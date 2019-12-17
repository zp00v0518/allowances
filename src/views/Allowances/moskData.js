import {time} from "./utils";

const moskData = [
  {
    name: "Ivan",
    projects: [],
    data: {},
    settings: {
      full: 8
    }
  },
  {
    name: "Olga",
    projects: [],
    data: {},
    settings: {
      full: 8
    }
  }
];

const listProjects = [
  { name: "first", id: "1" },
  { name: "second", id: "2" },
  { name: "third", id: "3" },
  { name: "fourth", id: "4" }
];
const count = 200;

function createData(arr) {
  arr.forEach(item => {
    const numProjects = getRandom(listProjects.length);
    item.projects = listProjects.slice(0, numProjects);
    item.projects.forEach(proj => {
      for (let i = 0; i < count; i++) {
        const key = getKey();
        if (!item.data[key]) {
          item.data[key] = {};
        }
        item.data[key] = {};
        const field = item.data[key];
        field.projects = {};
        field.projects[proj.id] = getRandom(4);
        // field.code = time.getDateString(new Date(key))
      }
    });
  });
}

function getRandom(num) {
  return Math.floor(Math.random() * num);
}

function getKey() {
  const month = getRandom(12) + 1;
  const day = getRandom(30) + 1;
  const date = new Date(`2019-${month}-${day}`)
  // time.setMidnight(date);
  return time.setMidnight(date).getTime();
}
createData(moskData);
window.moskData = moskData;

export default moskData;
