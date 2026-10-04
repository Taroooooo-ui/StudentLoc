import { useEffect } from "react";
import { Badge } from "react-bootstrap";
import { Icon } from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const studentMarkerIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const defaultCenter = [14.5995, 120.9842];

function MapViewUpdater({ students }) {
  const map = useMap();

  useEffect(() => {
    if (students.length === 0) {
      return;
    }

    const latestStudent = students[students.length - 1];

    map.flyTo(
      [latestStudent.latitude, latestStudent.longitude],
      13,
      {
        duration: 1.2,
      },
    );
  }, [students, map]);

  return null;
}

function StudentMap({ students }) {
  return (
    <div className="h-[480px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:h-[560px] xl:h-[680px]">
      <MapContainer
        center={defaultCenter}
        zoom={9}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapViewUpdater students={students} />

        {students.map((student) => (
          <Marker
            key={student.id}
            position={[student.latitude, student.longitude]}
            icon={studentMarkerIcon}
          >
            <Popup>
              <div className="min-w-44">
                <h3 className="mb-2 text-lg font-semibold">
                  {student.firstName} {student.lastName}
                </h3>

                <Badge bg="primary" className="mb-3">
                  {student.course}
                </Badge>

                <p className="mb-2">
                  <strong>Email:</strong>
                  <br />
                  {student.email}
                </p>

                <p className="mb-2">
                  <strong>Address:</strong>
                  <br />
                  {student.address}
                </p>

                <p className="mb-0">
                  <strong>Coordinates:</strong>
                  <br />
                  {student.latitude.toFixed(5)},{" "}
                  {student.longitude.toFixed(5)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default StudentMap;