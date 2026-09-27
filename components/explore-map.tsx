'use client';

import {useEffect,useRef,useState} from 'react';
import type {City} from '../lib/cities';

export type ExploreMapResult={city:City;score:number};
type MapLibre=typeof import('maplibre-gl');

const lngLat=(city:City):[number,number]=>[city.coordinates[1],city.coordinates[0]];

function markerElement(city:City,score:number,onClick:()=>void){
  const marker=document.createElement('button');
  marker.type='button';
  marker.className='atlasMapMarker';
  marker.setAttribute('aria-label',`${city.name}, match ${score}`);
  const dot=document.createElement('span');
  dot.className='atlasMapMarkerDot';
  const label=document.createElement('span');
  label.className='atlasMapMarkerLabel';
  const name=document.createElement('b');
  name.textContent=city.name;
  const value=document.createElement('small');
  value.textContent=String(score);
  label.appendChild(name);
  label.appendChild(value);
  marker.appendChild(dot);
  marker.appendChild(label);
  marker.addEventListener('click',onClick);
  return marker;
}

export default function ExploreMap({results,selectedId,onSelect}:{results:ExploreMapResult[];selectedId?:string;onSelect:(city:City)=>void}){
  const containerRef=useRef<HTMLDivElement>(null);
  const libRef=useRef<MapLibre|null>(null);
  const mapRef=useRef<import('maplibre-gl').Map|null>(null);
  const markersRef=useRef(new Map<string,import('maplibre-gl').Marker>());
  const onSelectRef=useRef(onSelect);
  const[ready,setReady]=useState(false);
  const[failed,setFailed]=useState(false);

  useEffect(()=>{onSelectRef.current=onSelect},[onSelect]);

  useEffect(()=>{
    let disposed=false;
    let observer:ResizeObserver|undefined;
    const markers=markersRef.current;
    const timeout=window.setTimeout(()=>{if(!disposed&&!mapRef.current?.loaded())setFailed(true)},12000);
    void import('maplibre-gl').then(lib=>{
      if(disposed||!containerRef.current)return;
      libRef.current=lib;
      try{
        const map=new lib.Map({
          container:containerRef.current,
          style:'https://tiles.openfreemap.org/styles/positron',
          center:[8,22],
          zoom:1.15,
          minZoom:1,
          maxZoom:8,
          attributionControl:false,
          renderWorldCopies:false,
        });
        mapRef.current=map;
        map.addControl(new lib.NavigationControl({showCompass:false}),'top-right');
        map.addControl(new lib.AttributionControl({compact:true}),'bottom-left');
        map.once('load',()=>{if(!disposed){window.clearTimeout(timeout);setFailed(false);setReady(true)}});
        observer=new ResizeObserver(()=>map.resize());
        observer.observe(containerRef.current);
      }catch{
        window.clearTimeout(timeout);
        setFailed(true);
      }
    }).catch(()=>{window.clearTimeout(timeout);if(!disposed)setFailed(true)});
    return()=>{
      disposed=true;
      window.clearTimeout(timeout);
      observer?.disconnect();
      markers.forEach(marker=>marker.remove());
      markers.clear();
      mapRef.current?.remove();
      mapRef.current=null;
    };
  },[]);

  // Rebuild markers only when the result set or scores change.
  useEffect(()=>{
    const map=mapRef.current;
    const lib=libRef.current;
    if(!ready||!map||!lib)return;
    const markers=markersRef.current;
    markers.forEach(marker=>marker.remove());
    markers.clear();
    results.forEach(({city,score})=>{
      const element=markerElement(city,score,()=>onSelectRef.current(city));
      markers.set(city.id,new lib.Marker({element,anchor:'center'}).setLngLat(lngLat(city)).addTo(map));
    });
  },[ready,results]);

  // Selection only toggles a class; markers stay in place.
  useEffect(()=>{
    if(!ready)return;
    markersRef.current.forEach((marker,id)=>marker.getElement().classList.toggle('isSelected',id===selectedId));
  },[ready,results,selectedId]);

  // Re-frame the map only when the set of visible cities changes, not when
  // the ranking metric reorders the same cities.
  const boundsKey=results.map(({city})=>lngLat(city).join(',')).sort().join(';');
  useEffect(()=>{
    const map=mapRef.current;
    const lib=libRef.current;
    if(!ready||!map||!lib||!boundsKey)return;
    const points=boundsKey.split(';').map(point=>point.split(',').map(Number) as [number,number]);
    const bounds=new lib.LngLatBounds();
    points.forEach(point=>bounds.extend(point));
    if(points.length===1){
      map.flyTo({center:bounds.getCenter(),zoom:3.2,duration:650,essential:false});
    }else{
      map.fitBounds(bounds,{padding:72,maxZoom:2.8,duration:700});
    }
  },[ready,boundsKey]);

  const selected=results.find(result=>result.city.id===selectedId)?.city;
  const selectedLng=selected?.coordinates[1];
  const selectedLat=selected?.coordinates[0];
  useEffect(()=>{
    const map=mapRef.current;
    if(!ready||!map||selectedLng===undefined||selectedLat===undefined)return;
    map.flyTo({center:[selectedLng,selectedLat],zoom:Math.max(map.getZoom(),2),duration:650,essential:false});
  },[ready,selectedLng,selectedLat]);

  return <div className="atlasMapWrap">
    <div ref={containerRef} className="atlasMap" aria-label="Interactive map of matching cities"/>
    {!ready&&!failed&&<div className="atlasMapStatus" role="status">Loading map…</div>}
    {failed&&<div className="atlasMapStatus atlasMapError" role="status"><b>Map temporarily unavailable</b><span>You can still explore every result below.</span></div>}
  </div>;
}
