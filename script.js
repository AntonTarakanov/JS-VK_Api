"use strict";
let access_token = "4c1d90f91eff3f1d623f8c3f81d65cd06abb079fe20e7153b314df88106d44b2090b6291f8826ef1073b9";

$("#loadFriends").on("click", loadFriends);
$("#loadGroups").on("click", loadGroups);
$("#setToken").on("click", setToken);
$("#send-message").on("click", sendMessage);


$(document).on("click", '.message', function (event) {
    event.preventDefault();
    let id = $(event.target).data("id");
    console.log("id = " + id);
    loadInfoUser(id);
});

function setToken () {
    let valueToken = document.getElementById("access-token");
    if (!valueToken.value) alert ("error");
    if (valueToken.value === "Copy the token into field") {}
    else {
        access_token = valueToken.value;
        console.log("access_token = " + access_token);
    }
}

function getURL (id, scope) {
    let url = "https://oauth.vk.com/authorize?client_id="+id+"&display=popup&redirect_uri=&scope="+scope+"&response_type=token&v=5.52";
    let outLink = document.getElementById("linkToken");
    outLink.href = url;
    console.log("link - "+url);
    return url;
}

function getMethod (param){
    let token = "access_token="+access_token;
    return "https:api.vk.com/method/"+param+token+"&v=5.52users.get"
}

function createAjax (param, func){
    $.ajax({
        url: getMethod(param),
        method: "GET",
        dataType: "JSONP",
        success: func,
    })
}

function loadInfoUser (id){
    let param = "users.get?user_ids="+id+"&fields=photo_400_orig&";
    console.log("param = " + param);
    let data = createAjax(param, function (data) {
        createMessage(data)
    });
}

function createMessage (data) {
    console.log(data);
    let user = data.response[0];
    console.log(user);
    let $detail = $(".detail");
    $detail.find("img").attr("src", user.photo_400_orig);
    $detail.find("h3").text(user.first_name+" "+user.last_name);
    $detail.find('button').attr("data-id", user.id);
    $detail.show();
}

function sendMessage (event){
    let id = $(event.target).attr('data-id');
    let text = $('textarea').val();
    let data = $('#get-data').val();
    let phone = $('#phone').val();
    let name = $('#name').val();
    let address = $('#address').val();
    let message = text+" "+data+" "+phone+" "+name+" "+address;
    console.log("id = " + id+". area = "+message);
    if (!message) alert ("Enter your message");
    else {
        let param = "messages.send?user_id="+id+"&message="+message+"&";
        createAjax(param, function (data) {
            console.log("Message sent - "+data);
        });
    }
}

function loadFriends (){
    let data = createAjax("friends.search?count=10&fields=photo_100&", function (data){
        console.log(data);
        showRequest(data.response.items);
    });
}

function loadGroups () {
    let data = createAjax("groups.get?extended=1&count=10&fields=photo_100&", function (data) {
        console.log(data);
        showRequest(data.response.items);
    })
}

function showRequest (data){
    let qwe = '';

    for (let i=0; i < data.length; i++) {
        qwe += '<li>'+
            '<a target="_blank">'+ //href="https://vk.com/id'+data[i].id+'"
                '<img src="'+data[i].photo_100+'"/><div>'+
                '<h4>'+data[i].name+' '+data[i].first_name+' '+data[i].last_name+'</h4>'+
                '<button data-id="'+data[i].id+'" class="message">do</button>'+
                '</div></a></li>';
    }
    $('ul').html(qwe);
}

getURL("6092212", "friends,groups,messages");
