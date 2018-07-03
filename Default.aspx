<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>calculate distance between two points google maps javascript</title>
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBLMa7emvhGQMK0uYYrS-9aymoEhlX-4sU"></script>
    <script src="jquery-1.7.2.js" type="text/javascript"></script>
    <script type="text/javascript" src="utility.js"></script>

    <style type="text/css">
        html, body, #map-canvas {
            margin: 0;
            padding: 0;
            height: 350px;
            width: auto;
        }
    </style>


    <script type="text/javascript">
        var map;
        var infoHandler;
        var DistanceBearingPolyline;
        var isDistanceFlag = false;
        var DistBearingPolylineClickHdl = 0;
        var DistBearingMapClickHdl = 0;
        var InfoWindowCloseClickHdl = 0;

        function initialize() {
            var mapOptions = {
                zoom: 11,                                    // Set Zoom Level
                center: new google.maps.LatLng(28.667696, 77.224059),     // Set the Latitude and longitude of the location
                mapTypeId: google.maps.MapTypeId.ROADMAP    // Set Map Type Here ROADMAP, TERRAIN, SATELLITE
            };


            map = new google.maps.Map(document.getElementById('map-canvas'),      // Creating the map object to desplay
                mapOptions);

            /*Global mousemove event, developer has to manage the event while coding to use flags for different functionalities*/
            google.maps.event.addListener(map, 'mousemove', function (event) {
                // $('#divCoords').html(roundNumber(event.latLng.lat(), 5) + "," + roundNumber(event.latLng.lng(), 5));
                if (isDistanceFlag) {
                    if (DistanceBearingPolyline != null) {
                        var path = DistanceBearingPolyline.getPath();
                        var len = path.getLength();
                        $('#divLength').html("<span>Length: " + DistanceBearingPolyline.inKm() + " km</span>");
                        if (len == 1) {
                            path.push(event.latLng);
                        } else {
                            path.setAt(len - 1, event.latLng);
                        }
                    }
                }
            });
        }
    </script>

</head>
<body onload="initialize();">
    <form id="form1" runat="server">
        <h1>Calculate Distance Between two points Google Maps JavaScript</h1>
        <a href="#" onclick="MeasureDistance();" style="font-family: Verdana; font-size: 14px;">Click here to measure distance using google maps</a>
        <br />
        <br />

        <div id="divLength">
            <span style="font-family: Verdana; font-size: 14px; color: red"><b>Distance: 0 km</b></span>
        </div>
        <br />

        <div id="map-canvas">
        </div>
    </form>
</body>
</html>
