/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        document.addEventListener("backbutton", onBackKeyDown, false); //Listen to the User clicking on the back button
        document.addEventListener("mainbutton", onMenuKeyDown, false); //Listen to the User clicking on the main button
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        console.log('Received Event: ' + id);
    }
};

function onBackKeyDown() {
    location.href = "#main";
}
;

function onMenuKeyDown() {
    navigator.app.close();
}
;

(function () {
    // recolecta los valores en localstorage
    var dataUser = localStorage.user;
    var dataPassword = localStorage.password;

    $.getJSON(get_base_url() + "user/Login/loginUser?jsoncallback=?", {user: dataUser, password: dataPassword}).done(function (requestServer) {

        if (requestServer.validation === "ok") {
            var user = dataUser;
            var pass = dataPassword;
            console.log(requestServer.request);
            console.log(requestServer.user);
            console.log(requestServer.generador);
            /// si la validation es correcta, muestra la pantalla "home"
            $.mobile.changePage("#main");
            geoloc();
        }
        if (requestServer.validation === "error1") {
            return false;
        }
        if (requestServer.validation === "error2") {
            return false;
        }
    });
    return false;
});

function Login() {

    // recolecta los valores que inserto el user
    var dataUser = $("#username").val();
    var dataPassword = $("#password").val();

    $.getJSON(get_base_url() + "user/Login/loginUser?jsoncallback=?", {user: dataUser, password: dataPassword}).done(function (requestServer) {

        if (requestServer.validation === "ok") {
            var user = document.getElementById("username").value;
            var pass = document.getElementById("password").value;
            localStorage.user = user;
            localStorage.password = pass;
            console.log(requestServer.request);
            console.log(requestServer.user);
            /// si la validation es correcta, muestra la pantalla "home"
            $.mobile.changePage("#main");
            geoloc();
        }
        if (requestServer.validation === "error1") {
            alert(requestServer.request);
        }
        if (requestServer.validation === "error2") {
            alert(requestServer.request);
        }
    });
    return false;
}
;

$("#logout").click(function () {
    window.localStorage.clear();
    navigator.app.exitApp();
});

function onBackKeyDown() {
    $.mobile.changePage("#main");
}
;

function onMenuKeyDown() {
    navigator.app.close();
}
;


function geoloc() {
    var optn = {
        frequency: 30000, enableHighAccuracy: true
    };
    var watchID = navigator.geolocation.watchPosition(showPosition, showError, optn);
    //loading();
}

function showPosition(position) {
    //hideLoading();
    
    var altoVentana = window.innerHeight;
    var mapObj, googleMap;
    $('#Latitud').val(position.coords.latitude);
    $('#Longitud').val(position.coords.longitude);

    $("div#mapdiv").css("height", altoVentana);
    var googlePos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var mapOptions = {
        zoom: 16,
        center: googlePos,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    mapObj = document.getElementById('mapdiv');
    googleMap =  new google.maps.Map(mapObj, mapOptions);
    var bike = 'img/bike.png';
    var markerOpt = {
        map: googleMap,
        position: googlePos,
        icon: bike
                //animation: google.maps.Animation.BOUNCE
    };

    var googleMarker = new google.maps.Marker(markerOpt);
    var geocoder = new google.maps.Geocoder();
    var city;
    geocoder.geocode({
        'latLng': googlePos
    }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                var popOpts = {
                    content: results[0].formatted_address,
                    position: googlePos
                };
                $("#ubicacionsos").html(results[0].formatted_address);
                var popup = new google.maps.InfoWindow(popOpts);
                google.maps.event.addListener(googleMarker, 'click', function () {
                    popup.open(googleMap);
                    city = results[0].address_components[3].long_name;
                });
            } else {
                alert('No se han encontrado resultados');
            }
        }
    });
    var imgContratados = 'img/carga.png';
    $.getJSON(get_base_url() + "user/Oferts/services?jsoncallback=?").done(function (respuestaServer) {
        if (respuestaServer["validation"] === "ok") {
            $.each(respuestaServer["services"], function (x, services) {
                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(services.USRS_Lat, services.USRS_Long);

                geocoder.geocode({'latLng': latlng}, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            var name = services.USRS_first_name + " " + services.USRS_last_name;
                            var location = results[0].formatted_address;
                            var marcador = new google.maps.Marker({
                                position: new google.maps.LatLng(services.USRS_Lat, services.USRS_Long),
                                map: googleMap,
                                icon: imgContratados
                                //animation: google.maps.Animation.BOUNCE
                            });
                            /*var infowindow_contratados = plugin.google.maps.InfoWindow({
                                content: contenido
                            });*/
                            google.maps.event.addListener(marcador, 'click', function () {
                                //infowindow_contratados.open(googleMap, marcador);
                                $("#name").html("<h1>"+name+"</h1>");
                                $("#location").html(location);
                                $.mobile.changePage("#driver");
                            });
                        } else {
                            alert('No se encontraron resultados!');
                        }
                    } /*else {
                        alert('Fallo al codificar coordenadas: ' + status);
                    }*/
                });
            });
        }
    });
}

function hideLoading() {
    $.mobile.loading("hide");
}
function stopWatch() {
    if (watchID) {
        navigator.geolocation.clearWatch(watchID);
        watchID = null;
    }
}
function showError(error) {
    var err = document.getElementById('map_canvas');
    switch (error.code) {
        case error.PERMISSION_DENIED:
            err.innerHTML = "El usuario a denegado la solicitud de ubicación."
            break;
        case error.POSITION_UNAVAILABLE:
            err.innerHTML = "La informacion de ubicación no está disponible."
            break;
        case error.TIMEOUT:
            err.innerHTML = "La peticion para obtener la ubicación ha excedido el tiempo."
            break;
        case error.UNKNOWN_ERROR:
            err.innerHTML = "Error desconocido."
            break;
    }
}
