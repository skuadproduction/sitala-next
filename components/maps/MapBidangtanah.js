import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap, LayersControl, LayerGroup, ZoomControl, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-search/dist/leaflet-search.src.css";
import "leaflet-search/dist/leaflet-search.src";
import "@/components/maps/MapBidangtanah.css";

// import images

// import Data

// Ensure leaflet-search is properly imported
import L from "leaflet";

function ResetCenterView(props) {
	const { selectPosition } = props;
	const map = useMap();

	useEffect(() => {
		if (selectPosition) {
			map.setView(L.latLng(selectPosition?.lat, selectPosition?.lon), map.getZoom(), {
				animate: true,
			});
		}
	}, [selectPosition]);

	return null;
}

const SearchControl = ({ geoJsonLayer }) => {
	const map = useMap();
	const searchControlRef = useRef(null);

	useEffect(() => {
		if (map && geoJsonLayer && !searchControlRef.current) {
			searchControlRef.current = new L.Control.Search({
				layer: geoJsonLayer,
				propertyName: "NOMOR_HAK",
				zoom: 18,
				collapsed: false,
				textPlaceholder: "Cari Nama..",
				position: "topright",
				textErr: "Pemilik tidak sesuai.",
			});
			map.addControl(searchControlRef.current);
		}
	}, [map, geoJsonLayer]);

	return null;
};

const MapBidangtanah = (props) => {
	const center = [-8.046229306245607, 110.81319196357789];

	const { selectPosition } = props;
	const locationSelection = [selectPosition?.lat, selectPosition?.lon];

	const [geoJsonData, setGeoJsonData] = useState(null);
	const geoJsonLayerRef = useRef(null);

	const url = "https://sitala-api.jurnalpendidikan.online:9000/api/locations/all/datas?filter=BidangTanahs";
	// const url = "http://localhost:3001/api/locations/all/datas?filter=BidangTanahs";

	const fetchGeoJSONData = async () => {
		try {
			const response = await fetch(url);
			const { datas } = await response.json();
			setGeoJsonData(datas);
			// console.log(datas);
		} catch (error) {
			console.error("Error fetching GeoJSON data:", error);
		}
	};

	useEffect(() => {
		fetchGeoJSONData();
	}, []);

	const onEachData = (feature, layer) => {
		const id = feature.id;
		const nomor_hak = feature.properties.NOMOR_HAK;
		const pemilik = feature.properties.PEMILIK;

		if ((nomor_hak, pemilik)) {
			layer.bindPopup(`<strong>KETERANGAN</strong></br><strong>NOMOR_HAK: ${nomor_hak}</strong> <br/> PEMILIK: ${pemilik}`);
		} else if ((pemilik === null) & (nomor_hak !== null)) {
			layer.bindPopup(`<strong>KETERANGAN</strong></br><strong>NOMOR_HAK: ${nomor_hak}</strong> <br/> PEMILIK: ${pemilik}`);
		} else {
			layer.bindPopup("<strong>KETERANGAN</strong><br/> Pemilik Tidak ditemukan <br/> atau <br/> Bidang ini tidak berpemilik.");
		}
	};

	let BelumSertifikat = null;
	let BidangBersertifikat = null;
	let Pemerintah = null;
	let TanpaNama = null;

	if (geoJsonData) {
		Pemerintah = geoJsonData.features.filter((list) => list.properties.CODE === 1);
		// console.log(Pemerintah);
	}
	if (geoJsonData) {
		BidangBersertifikat = geoJsonData.features.filter((list) => list.properties.CODE === 2);
		// console.log(BidangBersertifikat);
	}
	if (geoJsonData) {
		BelumSertifikat = geoJsonData.features.filter((list) => list.properties.CODE === 3);
		// console.log(BelumSertifikat);
	}
	if (geoJsonData) {
		TanpaNama = geoJsonData.features.filter((list) => list.properties.CODE === 4);
		// console.log(TanpaNama);
	}

	return (
		<>
			{/* Page content here */}
			<MapContainer center={center} zoom={14} style={{ height: "93.2dvh", width: "100%" }} zoomControl={false}>
				<div className="z-[10000] flex justify-center items-center h-full">
					{geoJsonData === null && (
						<div className="flex justify-center items-center h-full w-full z-[10000] text-6xl backdrop-blur-sm bg-slate-600/30">
							<span className="loading loading-spinner loading-lg text-primary"></span>
						</div>
					)}
				</div>
				<ZoomControl position="bottomright" />
				<LayersControl position="bottomleft" collapsed={false}>
					<LayersControl.BaseLayer name="Base" checked={true}>
						<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
					</LayersControl.BaseLayer>
					<LayersControl.BaseLayer name="Dark">
						<TileLayer
							url="http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						/>
					</LayersControl.BaseLayer>
					<LayersControl.Overlay checked name="Tubokarto Belum Bersertifikat">
						<LayerGroup>{BelumSertifikat && <GeoJSON data={BelumSertifikat} style={{ weight: 2, color: "#ff4d4d" }} ref={geoJsonLayerRef} onEachFeature={onEachData} />}</LayerGroup>
					</LayersControl.Overlay>
					<LayersControl.Overlay checked name="Tubokarto Bidang Bersertifikat">
						<LayerGroup>{BidangBersertifikat && <GeoJSON data={BidangBersertifikat} style={{ weight: 2, color: "#fbed74" }} ref={geoJsonLayerRef} onEachFeature={onEachData} />}</LayerGroup>
					</LayersControl.Overlay>
					<LayersControl.Overlay checked name="Tubokarto Pemerintah Wonogiri">
						<LayerGroup>{Pemerintah && <GeoJSON data={Pemerintah} style={{ weight: 2, color: "#53fb56" }} ref={geoJsonLayerRef} onEachFeature={onEachData} />}</LayerGroup>
					</LayersControl.Overlay>
					<LayersControl.Overlay checked name="Tubokarto Tanpa Nama">
						<LayerGroup>{TanpaNama && <GeoJSON data={TanpaNama} style={{ weight: 2, color: "#5c5cff" }} ref={geoJsonLayerRef} onEachFeature={onEachData} />}</LayerGroup>
					</LayersControl.Overlay>
					{/* <LayersControl.Overlay checked name="All">
						<LayerGroup>{geoJsonData && <GeoJSON data={geoJsonData} style={{ weight: 2 }} ref={geoJsonLayerRef} onEachFeature={onEachData} />}</LayerGroup>
					</LayersControl.Overlay> */}
				</LayersControl>
				{selectPosition && (
					<Marker
						position={locationSelection}
						icon={L.divIcon({
							iconSize: [38, 38],
							className: "pi pi-map-marker text-4xl text-red-600",
						})}
					>
						<Popup>Anda disini.</Popup>
					</Marker>
				)}
				<ResetCenterView selectPosition={selectPosition} />
				<div className="flex">{geoJsonData && geoJsonLayerRef.current && <SearchControl geoJsonLayer={geoJsonLayerRef.current} />}</div>
			</MapContainer>
		</>
	);
};

export default MapBidangtanah;
