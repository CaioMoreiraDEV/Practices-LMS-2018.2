var data = [];
var urlGroups = "http://rest.learncode.academy/api/caio/groups";
var urlContacts = "http://rest.learncode.academy/api/caio/contacts";

var button_contacts = document.querySelector(".layout .main .aside .menu-type .contacts");
button_contacts.addEventListener("click", function(event){
    event.preventDefault();

    getItemsHTTP(urlContacts, "CONTACT");
});

var button_groups = document.querySelector(".layout .main .aside .menu-type .groups");
button_groups.addEventListener("click", function(event){
    event.preventDefault();

    getItemsHTTP(urlGroups, "GROUP");
});

function setHeading(type, name) {
    var heading = document.querySelector(".layout .main .container .heading");
    heading.innerHTML = "[ "+type+" ] - "+name;
}

function removeAside(data, length){
    if(length != 0) {
        for(var i = 0; i < length; i++){
            var node = document.getElementById(data[i].id_custom);
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
        }
    }
}

var aside_items = document.querySelector(".layout .main .aside .aside-items");
function asideItem(type, id, name) {
     var a = document.createElement("a");
     a.setAttribute("id", id);
     a.setAttribute("href", "#");
     a.classList.add("aside-item");

     if(type == "GROUP") {
        var img = document.createElement("img");
        img.classList.add("icon");
        img.src = "img/icon-person.png";
        img.alt = "icon-person";
        img.style.width = "13px";
        a.appendChild(img);
     }
     var span = document.createElement("span");
     span.classList.add("item-type");
     span.innerHTML = " [ "+ type +" ] "+ name;
     a.appendChild(span);
     aside_items.insertBefore(a, aside_items.lastElementChild);

     a.addEventListener("click", function(){
        var inputMessage = document.querySelector(".layout .main .container .send-message .message");
        inputMessage.removeAttribute("disabled");

        setHeading(type, name);
        if(type == "CONTACT") {
            getChat(urlContacts, id);
        } else if(type == "GROUP"){
            getChat(urlGroups, id);
        }
     });
}

var chat = document.querySelector(".layout .main .container .chat");
//Method for getting JSON.
function getChat(url, id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4) {
            chat.innerHTML = "";

            var chatJson = JSON.parse(xhttp.responseText);
            for(var i = 0; i < chatJson.length; i++) {
                if(chatJson[i].id_custom == id) {
                    for(var j = 0; j < chatJson[i].chat.length; j++) {
                        createChat(chatJson[i].chat[j].user, chatJson[i].chat[j].message);
                    }
                }
            }
        }
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}

function createChat(user, message) {
    var chatItem = document.createElement("div");
    chatItem.classList.add("item");
    chatItem.innerHTML = "["+user+" sent] : "+message;

    chat.insertBefore(chatItem, chat.firstChild);
}

var button_add_contacts = document.querySelector(".layout .main .aside .menu-add-type .add-contacts");
button_add_contacts.addEventListener("click", function(event){
    event.preventDefault();

    var form_id = document.querySelector(".layout .main .aside .aside-items .form-register .form-id");
    var form_name = document.querySelector(".layout .main .aside .aside-items .form-register .form-name");
    if(form_id.value != "" && form_name.value != "") {
        postItemHTTP(urlContacts, form_id.value, form_name.value, "CONTACT");
        form_id.value = "";
        form_name.value = "";
    } else {
        alert("Fill in all the fields required for creation.");
    }
});

var button_add_groups = document.querySelector(".layout .main .aside .menu-add-type .add-groups");
button_add_groups.addEventListener("click", function(event){
    event.preventDefault();

    var form_id = document.querySelector(".layout .main .aside .aside-items .form-register .form-id");
    var form_name = document.querySelector(".layout .main .aside .aside-items .form-register .form-name");
    if(form_id.value != "" && form_name.value != "") {
        postItemHTTP(urlGroups, form_id.value, form_name.value, "GROUP");
        form_id.value = "";
        form_name.value = "";
    } else {
        alert("Fill in all the fields required for creation.");
    }
});

//Method for getting JSON.
function getItemsHTTP(url, type) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4) {
            removeAside(data, data.length);
            data = JSON.parse(xhttp.responseText);
            if(data.length != 0) {
                for(var i = 0; i < data.length; i++){
                    asideItem(type, data[i].id_custom, data[i].name);
                }
            } else {
                if(type == "CONTACT") 
                    console.log("You do not have contacts.");
                if(type == "GROUP") 
                    console.log("You do not have groups.");
            }
        }
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}

//Method for posting JSON.
function postItemHTTP(url, id, name, type) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4) {
            getItemsHTTP(url, type);
        }
    }
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    var item = {
        id_custom : id,
        name : name,
        chat : [{
            user : "fulano",
            message : "mensagem teste"
        }, {
            user : "ciclano",
            message : "mensagem do ciclano asdadasd ada da asdasdad ad ad ad a dad adas dad asdadadasda"
        }]
    }
    xhttp.send(JSON.stringify(item));
}

window.onload = function() {
    getItemsHTTP(urlGroups, "GROUP");
}