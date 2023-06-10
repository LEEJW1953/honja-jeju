import React, { useEffect, useRef, useState } from 'react';
import styles from './MapWithWaypoints.module.scss';
import { MapWithWaypointsPropsType } from '../../../types/DestinationListTypes';

declare global {
  interface Window {
    kakao: any;
  }
}

const DEFAULT_LOCATION = {
  LATITUDE: 33.379654159813256,
  LONGITUDE: 126.56036071539428
};

const MARKER_IMAGE_SRC = {
  MAXIMUM_INDEX: 14,
  NUMBERED_MARKER: `https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png`,
  DEFAULT_MARKER: `http://t1.daumcdn.net/localimg/localimages/07/2018/pc/img/marker_spot.png`
};

const { kakao } = window;

const setImageOps = (index: number) => {
  let imageSrc = '';
  if (index <= MARKER_IMAGE_SRC.MAXIMUM_INDEX) {
    imageSrc = MARKER_IMAGE_SRC.NUMBERED_MARKER;
  } else {
    imageSrc = MARKER_IMAGE_SRC.DEFAULT_MARKER;
  }
  const imageSize = new kakao.maps.Size(36, 37);
  const imageOptions = {
    spriteSize: new kakao.maps.Size(36, 691),
    spriteOrigin: new kakao.maps.Point(0, index * 46 + 10),
    offset: new kakao.maps.Point(13, 37)
  };

  const markerImage = new kakao.maps.MarkerImage(
    imageSrc,
    imageSize,
    imageOptions
  );
  return markerImage;
};

function MapWithWaypoints({
  markersLocations
}: {
  markersLocations: MapWithWaypointsPropsType[];
}) {
  const [renderedMap, setRenderedMap] = useState<any>(null);
  const prevMarkers = useRef<any[]>([]);
  const prevPolyline = useRef<any>(null);

  useEffect(() => {
    const container = document.getElementById('mapWithWaypoints');
    const options = {
      center: new kakao.maps.LatLng(
        DEFAULT_LOCATION.LATITUDE,
        DEFAULT_LOCATION.LONGITUDE
      ),
      level: 10
    };
    const map = new kakao.maps.Map(container, options);

    setRenderedMap(() => map);
  }, []);

  useEffect(() => {
    if (renderedMap === null) {
      return;
    }

    if (markersLocations.length <= 0) {
      return;
    }

    const positions = markersLocations?.map(
      (marker) =>
        new kakao.maps.LatLng(Number(marker?.mapy), Number(marker?.mapx))
    );

    const newMarkers = positions.map(
      (position, index) =>
        new kakao.maps.Marker({
          position,
          map: renderedMap,
          image: setImageOps(index)
        })
    );

    const bounds = positions.reduce(
      (bounds, latlng) => bounds.extend(latlng),
      new kakao.maps.LatLngBounds()
    );

    const polylinePath = Array.from(
      markersLocations.map(
        (marker) =>
          new kakao.maps.LatLng(Number(marker?.mapy), Number(marker?.mapx))
      )
    );

    const newPolyline = new kakao.maps.Polyline({
      path: polylinePath,
      strokeWeight: 3,
      strokeColor: '#654E92',
      strokeOpacity: 0.7,
      strokeStyle: 'solid'
    });

    if (prevMarkers.current.length > 0) {
      prevMarkers.current.forEach((marker: any) => {
        marker.setMap(null);
      });
    }

    if (prevPolyline.current) {
      prevPolyline.current.setMap(null);
    }

    prevMarkers.current = newMarkers;

    prevPolyline.current = newPolyline;

    newMarkers.forEach((marker: any) => marker.setMap(renderedMap));

    newPolyline.setMap(renderedMap);

    renderedMap?.setBounds(bounds);
  }, [markersLocations, renderedMap]);

  return <div className={styles.mapWithWaypoints} id='mapWithWaypoints'></div>;
}

export default MapWithWaypoints;
