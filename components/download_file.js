"use client";

// components/Download.js

import React from "react";
import axios from "axios";

const btnLink = [
	{
		id: 1,
		label: "Data Bidang Tanah",
		endpoint: "BidangTanahs",
	},
	{
		id: 2,
		label: "Data Penggunaan Lahan",
		endpoint: "PenggunaanLahans",
	},
	{
		id: 3,
		label: "Data Pola Ruang",
		endpoint: "PolaRuangs",
	},
	{
		id: 4,
		label: "Data Wilayah",
		endpoint: "Wilayahs",
	},
	{
		id: 5,
		label: "Data ZNT",
		endpoint: "ZNTs",
	},
];

const Download = () => {
	const handleDownload = async (endpoint) => {
		try {
			const response = await axios.get("http://localhost:3001/api/locations/all/datas?filter=" + endpoint);
			const data = response.data;

			const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "Data_" + endpoint + ".json";
			document.body.appendChild(a);
			a.click();
			a.remove();
		} catch (error) {
			console.error("Failed to fetch data:", error);
		}
	};

	return (
		<>
			<div className="text-center mt-20 lg:mt-40">
				<h1 className="text-6xl font-bold">Selamat Datang</h1>
				<h1 className="text-2xl">Di Pusat Data SITALA.</h1>
			</div>
			<div className="mt-20 container flex flex-wrap gap-2 justify-center  mx-auto">
				{btnLink.map(({ id, label, endpoint }) => (
					<div key={id}>
						<div className="card bg-base-100 w-80 h-50 shadow-xl">
							<div className="card-body">
								<h2 className="card-title font-bold">Download</h2>
								<p>{label}</p>
							</div>
							<div className="card-actions justify-end p-5">
								<button onClick={() => handleDownload(endpoint)} className="btn btn-primary">
									Download
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default Download;
