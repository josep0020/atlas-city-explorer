'use client';

import {useEffect,useRef,useState} from 'react';
import type {City} from './cities';

export type ExploreMapResult={city:City;score:number};

export default function ExploreMap({results,selectedId,onSelect}:{results:ExploreMapResult[];selectedId?:string;onSelect:(city:City)=>void}){
  const containerRef=useRef<HTMLDivElement>(null);
  const mapRef=useRef<import('maplibre-gl').Map|null>(null);
  const markersRef=useRef<import('maplibre-gl').Marker[]>([]);
  const[ready,setReady]=useState(false);
  const[failed,setFailed]=useState(false);

  useEffect(()=>{
    let disposed=false;
    let observer:ResizeObserver|undefined;
    const timeout=window.setTimeout(()=>{if(!disposed&&!mapRef.current?.loaded())setFailed(true)},12000);
    void import('maplibre-gl').then(({AttributionControl,Map,NavigationControl})=>{
      if(disposed||!containerRef.current)return;
      try{
        const map=new Map({
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
        map.addControl(new NavigationControl({showCompass:false}),'top-right');
        map.addControl(new AttributionControl({compact:true}),'bottom-left');
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
      markersRef.current.forEach(marker=>marker.remove());
      markersRef.current=[];
      mapRef.current?.remove();
      mapRef.current=null;
    };
  },[]);

  useEffect(()=>{
    if(!ready||!mapRef.current)return;
    let cancelled=false;
    void import('maplibre-gl').then(({Marker})=>{
      if(cancelled||!mapRef.current)return;
      markersRef.current.forEach(marker=>marker.remove());
      markersRef.current=results.map(({city,score})=>{
        const marker=document.createElement('button');
        marker.type='button';
        marker.className=`atlasMapMarker${city.id===selectedId?' isSelected':''}`;
        marker.setAttribute('aria-label',`${city.name}, match ${score}`);
        marker.innerHTML=`<span class="atlasMapMarkerDot"></span><span class="atlasMapMarkerLabel"><b>${city.name}</b><small>${score}</small></span>`;
        marker.addEventListener('click',()=>onSelect(city));
        return new Marker({element:marker,anchor:'center'}).setLngLat([city.coordinates[1],city.coordinates[0]]).addTo(mapRef.current!);
      });
    });
    return()=>{cancelled=true};
  },[onSelect,ready,results,selectedId]);

  useEffect(()=>{
    const map=mapRef.current;
    if(!ready||!map||results.length===0)return;
    void import('maplibre-gl').then(({LngLatBounds})=>{
      const bounds=new LngLatBounds();
      results.forEach(({city})=>bounds.extend([city.coordinates[1],city.coordinates[0]]));
      if(results.length===1){
        map.flyTo({center:bounds.getCenter(),zoom:3.2,duration:650,essential:false});
      }else{
        map.fitBounds(bounds,{padding:72,maxZoom:2.8,duration:700});
      }
    });
  },[ready,results]);

  useEffect(()=>{
    const map=mapRef.current;
    const selected=results.find(result=>result.city.id===selectedId)?.city;
    if(!ready||!map||!selected)return;
    map.flyTo({center:[selected.coordinates[1],selected.coordinates[0]],zoom:Math.max(map.getZoom(),2),duration:650,essential:false});
  },[ready,results,selectedId]);

  return <div className="atlasMapWrap">
    <div ref={containerRef} className="atlasMap" aria-label="Interactive map of matching cities"/>
    {!ready&&!failed&&<div className="atlasMapStatus" role="status">Loading live atlas…</div>}
    {failed&&<div className="atlasMapStatus atlasMapError" role="status"><b>Map temporarily unavailable</b><span>You can still explore every result below.</span></div>}
  </div>;
}
