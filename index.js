import MapGL from 'react-map-gl';

<MapGL 
	width={400}
	height={400}
	latitude={31.21}
	longitude={120.12}
	zoom={8}
	onChangeViewport={viewport => {
		const {latitude, longitude, zoom} = viewport;
	}}
/>
