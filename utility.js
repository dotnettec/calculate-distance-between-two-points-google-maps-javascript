
// Calculate measure distance between points      
function MeasureDistance() {
    removeClickListnrs();
    $('#divLength').html("<span>Distance: 0 km</span>");
    if (DistanceBearingPolyline) {
        DistanceBearingPolyline.setMap(null);
        DistanceBearingPolyline = null;
        map.setOptions({ draggableCursor: '' });
    }
    else {
        map.setOptions({ draggableCursor: 'crosshair' });
        google.maps.event.addListenerOnce(map, "click", function (event) {
            addPolyline(event.latLng);
        });
    }
}

// To set default cursor pointer to the map
function DefaultCursorPointer() {
    map.setOptions({ draggableCursor: '' });

    removeDistanceLine();
    removeClickListnrs();
    measureReset();
}

// To remove click listener
function removeClickListnrs() {
    google.maps.event.removeListener(infoHandler);
}

// To add polyline to the map
function addPolyline(latlng) {
    if (!isDistanceFlag) {
        DistanceBearingPolyline = new google.maps.Polyline
            ({
                strokeColor: '#0000FF', //"#0000FF"=blue
                strokeOpacity: 1,
                strokeWeight: 2,
                path: [latlng],
                map: map
            });

        google.maps.event.addListener(DistanceBearingPolyline, 'click', adddistancePoint);
        google.maps.event.addListenerOnce(DistanceBearingPolyline, "dblclick", function (event) {
            addPolyline(event.latLng);
        });
        isDistanceFlag = true;
    }
    else {
        isDistanceFlag = false; var eDist = DistanceBearingPolyline.inKm();
        var eInfoWindowContent = "<b>Measurement Info</b><br><br><b>Distance (km):</b> " + eDist; //+ "<br><b>Bearing (deg) :</b> "+eBear;

        infoWindowPOly = new google.maps.InfoWindow({ content: eInfoWindowContent, position: latlng, size: new google.maps.Size(50, 50) });
        infoWindowPOly.open(map);

        InfoWindowCloseClickHdl = google.maps.event.addListener(infoWindowPOly, "closeclick", function (event) {
            ClearEvents_ComputeDistanceBearing();
        });
        map.setOptions({ draggableCursor: '' });

    }
}

// To clear events when close infowindow
function ClearEvents_ComputeDistanceBearing() {
    google.maps.event.removeListener(DistBearingPolylineClickHdl);
    google.maps.event.removeListener(DistBearingMapClickHdl);
    google.maps.event.removeListener(InfoWindowCloseClickHdl);
    map.setOptions({ draggableCursor: '' });
    if (DistanceBearingPolyline) {
        DistanceBearingPolyline.setMap(null);
        infoWindowPOly.close(map);
    }

    DistanceBearingPolyline = null;
    isDistanceFlag = false;

    DistBearingMapClickHdl = null;
    InfoWindowCloseClickHdl = null;
    DistBearingPolylineClickHdl = null;
}

// adding distance point to the map
function adddistancePoint(e) {
    var vertices = DistanceBearingPolyline.getPath();
    vertices.push(e.latLng);
    $('#divLength').html("<span>Distance: " + DistanceBearingPolyline.inKm() + " km</span>");
}
google.maps.Polyline.prototype.inKm = function (n) {
    var a = this.getPath(n), len = a.getLength(), dist = 0;
    for (var i = 0; i < len - 1; i++) {
        dist += a.getAt(i).kmTo(a.getAt(i + 1));
    }
    return roundNumber(dist, 2);
}

google.maps.LatLng.prototype.kmTo = function (a) {
    var e = Math, ra = e.PI / 180;
    var b = this.lat() * ra, c = a.lat() * ra, d = b - c;
    var g = this.lng() * ra - a.lng() * ra;
    var f = 2 * e.asin(e.sqrt(e.pow(e.sin(d / 2), 2) + e.cos(b) * e.cos(c) * e.pow(e.sin(g / 2), 2)));
    return f * 6378.137;
}

google.maps.LatLng.prototype.bearing = function (a) {
    var e = Math, ra = e.PI / 180; deg = 180 / e.PI;
    var x = a.lng() - this.lng();
    var y = a.lat() - this.lat();
    var f = 0;
    if (x >= 0 && y >= 0) {
        y = y * ra; x = x * ra;
        f = 90 - e.atan(y / x) * deg;
    } else if (x >= 0 && y <= 0) {
        y = y * ra; x = x * ra;
        f = 90 + e.abs(e.atan(y / x) * deg);
    } else if (x <= 0 && y <= 0) {
        y = y * ra; x = x * ra;
        f = 270 - e.atan(y / x) * deg;
    } else if (x <= 0 && y >= 0) {
        y = y * ra; x = x * ra;
        f = 270 + e.abs(e.atan(y / x) * deg);
    }
    return f;
}

// function to round an number
function roundNumber(num, dec) {
    var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec) + '';
    var r = result.indexOf('.');
    if (r == -1) result += ".00";
    return result;
}