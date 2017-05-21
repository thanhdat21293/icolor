/*
* Author : nguyenpham93
* This file is to create and add data to Elasticsearch
*/

const elas = require("./elastic/index");
const moment = require("moment");
const shortid = require("shortid");
const data = require("./data.json");
const async = require("async");
const coll = require("./models/collection");
const bcrypt = require('bcrypt-nodejs');
//Create Index
function createIndex () {
    elas.createIndex("icolor",(err,stt)=>{
        if (err) {
            console.log(err);
        } else {
            console.log(stt);
        }
    });
}
 //createIndex();

//Delete Index
function deleteIndex () {
    elas.deleteIndex("icolor",(err, stt)=>{
        if (err) console.log(err);
        else console.log(stt);
    });
}
//deleteIndex();

// Merge Data into ElasticSearch
function initData() {
    let colors = [];
    for (let count in data) {
        delete data[count].key;
        delete data[count].key1;
        data[count].id = shortid.generate();
        data[count].name = data[count]['string'];
        delete data[count]["string"];
        data[count].color1 = data[count]['array'][0];
        data[count].color2 = data[count]['array'][1];
        data[count].color3 = data[count]['array'][2];
        data[count].color4 = data[count]['array'][3];
        data[count].color5 = data[count]['array'][4];
        delete data[count]["array"];
        data[count].date = moment().format("DD-MM-YYYY HH:mm:ss");
        data[count].description = "Color collection";
        data[count]['id_user'] = "rJBkgtYyb";
        delete data[count].author;
        delete data[count].author_email;
        data[count].like = Math.floor((Math.random() * 100) + 1)/2;
        data[count].dislike = Math.floor((Math.random() * 100) + 1)/2;

        data[count].share = 0;
        colors.push(data[count]);
    }
    async.mapSeries (colors, merge, (err, rs) => {
        console.log(rs);
    });
}

 //initData();

function merge(item, cb){
    coll.addCollection(item)
    .then (data => {
        cb(null,data);
    },
    error => {
        console.log(error);
        cb (null, error);
    });
}


// Add author
let author = {
    "id"  : 'rJBkgtYyb',
    "email" : "bluevn@gmail.com",
    "password" : "rootvn",
    'facebook_id' : "",
    "facebook_access_token" : "",
    'google_id' : "",
    "google_access_token" : "",
    "date" :  moment().format("DD-MM-YYYY HH:mm:ss")
}

function addAuthor (author){
    bcrypt.hash(author['password'], null, null, function(err, hash) {
                        author['password'] = hash;
                        elas.insertDocument ("icolor", "users", author)
            .then ((data) => {
                console.log(data);
            });
                    });
}

//addAuthor(author);

let collection = {
    id: shortid.generate(),
    name: "The Shepherd's Boy",
    color1: '#FE4365',
    color2: '#036564',
    color3: '#B38184',
    color4: '#F77825',
    color5: '#E6AC27',
    date: moment().format("DD-MM-YYYY HH:mm:ss"),
    description: 'Pro color',
    id_user: 'rJBkgtYyb',
    like: 0,
    dislike: 0,
    share: 0
}

function addCollection2 (collection){
    coll.addCollection(collection)
    .then (data => {
        console.log(data);
    },
    error => {
        console.log (error);
    });
}
// addCollection2(collection);

let doc1 = [ {
    id: 'B1GkgJ3xb'
} ];

function deleteDocument (doc2){
    elas.deleteDocument ("icolor","collection", doc2)
    .then ( data => {
        console.log (data);
    }, 
    err => {
        console.log (err);
    });
}
doc1.forEach((i) => {
    //deleteDocument(i);
})

// Add Like & Dislike
let like = {
    "id"            : shortid.generate(),
    "id_collection" : "r1-bxZIEe-",
    "id_user"       : "rJBkgtYyb",
    "status"        : 0,
    "date"          : moment().format("DD-MM-YYYY HH:mm:ss")
}
function addLike () {
    elas.insertDocument ("icolor", "like_dislike", like)
    .then ((data) => {
        console.log(data);
    });
}
//addLike();


//update
let like1 = [{ id: 'S12bArMthxb',
    like: 30,
    dislike: 30,
}];
function update (val) {
    elas.updateDocument('icolor','collection', val);
}

like1.forEach((i) => {
    //update (i)
});

//update();

// Search ALl for test
function searchAll (){
	elas.searchAll("icolor","like_dislike")
     .then (data => {
         console.log(data);
         console.log(data.length);
     });
}
searchAll();

// elas.search("icolor","color_related", "#D95B43")
//  .then (data => {
//      console.log(data);
//  });

// rJDog98lb
let allPallet = [
    {
        id: 'B1GkgJ3xb',
        name: 'TD123',
        color1: '#234567',
        color2: '#234568',
        color3: '#234569',
        color4: '#234560',
        color5: '#234561',
        date: '19-05-2017',
        description: '',
        id_user: 'rJDog98lb',
        share: 0
    },
    {
        id: 'B1GkgJ3xb1',
        name: 'TD',
        color1: '#234567',
        color2: '#234568',
        color3: '#234569',
        color4: '#234560',
        color5: '#234561',
        date: '19-05-2017',
        description: '',
        id_user: 'rJDog98lb',
        share: 0
    },
];

let userPallet = {
        id: 'rJW-xyngZ',
        name: ' td123 ',
        color1: '#234567',
        color2: '#234568',
        color3: '#234569',
        color4: '#234560',
        color5: '#234561',
        date: '19-05-2017',
        description: '',
        id_user: 'rJDog98lb',
        share: 0
    };

let isSamePallet = ( allPallet , userPallet ) => {
    let n = allPallet.length;
    let check = 0;
    for(let i = 0; i < n; i++){
        let name_old = allPallet[i].name.trim().toLowerCase();
        let name_new = userPallet.name.trim().toLowerCase();

        if(name_old === name_new){
            check = 1;
        }
    }
    if(check === 1){
        return true
    }else{
        return false;
    }
};

//console.log(isSamePallet ( allPallet , userPallet ));
