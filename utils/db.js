import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("LittleLemon");

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          "create table if not exists menuitems (id integer primary key not null, name text, price text, description text, image text, category text);"
        );
      },
      reject,
      resolve
    );
  });
}

export function saveMenuItems(menuItems) {
  let queryString=``;
  menuItems.forEach((element,idx) => {
    queryString=queryString+`("${element.id}", "${element.name}","${element.price}","${element.description}","${element.image}","${element.category}")`;
    if (idx<(menuItems.length-1)) queryString+=",";
  });

  db.transaction(tx => {
    tx.executeSql(
      `insert into menuitems (id, name, price, description, image, category) values ${queryString}`
    );
  });
}

export async function getMenuItems() {
  return new Promise(resolve => {
    db.transaction(tx => {
      tx.executeSql("select * from menuitems", [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
}
export function getSectionListData(data) {
  if (data.length==0) return [];
  let sectionData=[];
  let item={category:data[0].category,data:[]};
  data.forEach((val,idx,arr)=>{
    if ((val.category!=item.category) ){
      let tmpObj={...item};
      sectionData.push(tmpObj);
      item.category=val.category;
      item.data=[];
      
    }
  item.data.push({id:val.id,name:val.name,price:val.price,description:val.description,image:val.image});

  });
  sectionData.push(item);

  return sectionData;
}
export async function filterByQueryAndCategories(query, activeCategories) {
  let queryString=activeCategories.join("','");
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `select * from menuitems where name like ? and category in ('${queryString}')`,
        [`%${query}%`],
        (_, { rows }) => {
        resolve(rows._array);
        }
      );
    }, reject);
  });
}
