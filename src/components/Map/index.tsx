import { useSelector } from "react-redux";
import { Map, Marker } from "pigeon-maps";
import { RootState } from "../../store";

const MapCustom = () => {
  const latitude = useSelector((state: RootState) => state.map.latitude);
  const longitude = useSelector((state: RootState) => state.map.longitude);

  return (
    <Map center={[latitude, longitude]} zoom={11}>
      <Marker width={50} anchor={[latitude, longitude]} />
    </Map>
  );
};

export default MapCustom;
