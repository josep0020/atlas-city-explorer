'use client';

import {useEffect,useRef} from 'react';

type DnaBackdropProps={accent:string};
type NavigatorWithMemory=Navigator&{deviceMemory?:number};

export default function DnaBackdrop({accent}:DnaBackdropProps){
  const rootRef=useRef<HTMLDivElement>(null);
  const canvasRef=useRef<HTMLCanvasElement>(null);

  useEffect(()=>{
    const root=rootRef.current;
    const canvas=canvasRef.current;
    const section=root?.parentElement;
    if(!root||!canvas||!section)return;

    let disposed=false;
    let started=false;
    let release=()=>{};

    const init=async()=>{
      try{
        const THREE=await import('three');
        if(disposed)return;

        const motionQuery=window.matchMedia('(prefers-reduced-motion: reduce)');
        const coarseQuery=window.matchMedia('(pointer: coarse)');
        const dataQuery=window.matchMedia('(prefers-reduced-data: reduce)');
        const device=navigator as NavigatorWithMemory;
        const lowPower=coarseQuery.matches||dataQuery.matches||(device.hardwareConcurrency||8)<=4||(device.deviceMemory||8)<=4;
        const targetFrameTime=1000/(lowPower?24:30);
        const renderer=new THREE.WebGLRenderer({
          canvas,
          alpha:true,
          antialias:!lowPower,
          powerPreference:'high-performance',
          premultipliedAlpha:true
        });
        renderer.setClearColor(0x000000,0);
        renderer.outputColorSpace=THREE.SRGBColorSpace;

        const scene=new THREE.Scene();
        const camera=new THREE.PerspectiveCamera(34,1,.1,40);
        camera.position.set(0,.08,7.4);

        const cityColor=new THREE.Color(accent);
        const waterUniforms={
          uTime:{value:0},
          uAccent:{value:cityColor.clone()},
          uPointer:{value:new THREE.Vector2()}
        };
        const waterGeometry=new THREE.PlaneGeometry(17,9.5,lowPower?30:48,lowPower?18:28);
        const waterMaterial=new THREE.ShaderMaterial({
          uniforms:waterUniforms,
          vertexShader:`
            uniform float uTime;
            uniform vec2 uPointer;
            varying vec2 vUv;
            varying float vElevation;
            void main(){
              vUv=uv;
              vec3 p=position;
              float swell=sin(p.x*.72+uTime*.48)*.11;
              swell+=sin(p.y*1.14-uTime*.37)*.085;
              swell+=sin((p.x+p.y)*1.62+uTime*.24)*.045;
              p.z+=swell;
              p.x+=uPointer.x*(1.0-uv.y)*.07;
              p.y+=uPointer.y*(1.0-uv.x)*.045;
              vElevation=swell;
              gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
            }
          `,
          fragmentShader:`
            uniform float uTime;
            uniform vec3 uAccent;
            varying vec2 vUv;
            varying float vElevation;
            float caustic(vec2 p){
              float a=sin(p.x*18.0+sin(p.y*7.0-uTime*.35)*2.1+uTime*.42);
              float b=cos(p.y*21.0+sin(p.x*6.0+uTime*.28)*2.0-uTime*.31);
              float c=sin((p.x+p.y)*13.0+uTime*.23);
              return pow(clamp(abs(a+b+c)*.34,0.0,1.0),6.0);
            }
            void main(){
              float depth=smoothstep(0.0,1.0,vUv.y*.82+vUv.x*.18);
              vec3 pearl=vec3(.88,.985,1.0);
              vec3 aqua=vec3(.34,.82,.86);
              vec3 pool=mix(pearl,aqua,depth*.72);
              pool=mix(pool,uAccent,.055);
              float light=caustic(vUv+vElevation*.22);
              float shimmer=.5+.5*sin((vUv.x-vUv.y)*24.0+uTime*.32);
              pool+=vec3(.82,1.0,1.0)*light*.28;
              pool+=vec3(.96,1.0,1.0)*shimmer*.025;
              pool+=vElevation*.16;
              gl_FragColor=vec4(pool,1.0);
            }
          `,
          depthWrite:true,
          depthTest:true
        });
        const water=new THREE.Mesh(waterGeometry,waterMaterial);
        water.position.set(0,0,-2.45);
        scene.add(water);

        const waveUniforms={
          uTime:{value:0},
          uAccent:{value:cityColor.clone()},
          uPointer:{value:new THREE.Vector2()}
        };
        const waveGeometry=new THREE.PlaneGeometry(10.8,4.4,lowPower?32:56,lowPower?18:30);
        const waveMaterial=new THREE.ShaderMaterial({
          uniforms:waveUniforms,
          vertexShader:`
            uniform float uTime;
            uniform vec2 uPointer;
            varying vec2 vUv;
            varying float vCrest;
            void main(){
              vUv=uv;
              vec3 p=position;
              float crest=sin(p.x*.92+uTime*.58)*.48;
              crest+=sin(p.x*1.87-uTime*.31)*.16;
              float lift=smoothstep(-2.2,1.65,p.y);
              p.z+=crest*(.42+lift*.72);
              p.z+=sin(p.y*2.2+p.x*.52+uTime*.44)*.14;
              p.y+=sin(p.x*.66+uTime*.36)*.22*(1.0-lift*.35);
              p.x+=uPointer.x*.13*(1.0-uv.y);
              p.y+=uPointer.y*.08*(1.0-uv.x);
              vCrest=crest;
              gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
            }
          `,
          fragmentShader:`
            uniform float uTime;
            uniform vec3 uAccent;
            varying vec2 vUv;
            varying float vCrest;
            void main(){
              float edge=min(min(vUv.x,1.0-vUv.x),min(vUv.y,1.0-vUv.y));
              float rim=1.0-smoothstep(0.0,.22,edge);
              float ribbon=.5+.5*sin(vUv.x*18.0-vUv.y*7.0+uTime*.42+vCrest*2.0);
              float pearl=pow(.5+.5*sin((vUv.x+vUv.y)*10.0-uTime*.23),5.0);
              vec3 glass=mix(vec3(.79,.97,1.0),uAccent,.08);
              glass=mix(glass,vec3(1.0),ribbon*.32+pearl*.22);
              float alpha=.13+rim*.28+ribbon*.08+pearl*.09;
              gl_FragColor=vec4(glass,alpha);
            }
          `,
          transparent:true,
          depthWrite:false,
          depthTest:true,
          side:THREE.DoubleSide
        });
        const wave=new THREE.Mesh(waveGeometry,waveMaterial);
        wave.position.set(2.05,-1.12,.18);
        wave.rotation.set(-.08,-.16,-.055);
        wave.renderOrder=2;
        scene.add(wave);

        let frame=0;
        let scrollTimer=0;
        let visible=true;
        let scrolling=false;
        let lastRender=0;
        let targetX=0;
        let targetY=0;
        let pointerX=0;
        let pointerY=0;

        const render=(timestamp:number)=>{
          const time=timestamp*.001;
          pointerX+=(targetX-pointerX)*.055;
          pointerY+=(targetY-pointerY)*.055;
          waterUniforms.uTime.value=time;
          waterUniforms.uPointer.value.set(pointerX,pointerY);
          waveUniforms.uTime.value=time;
          waveUniforms.uPointer.value.set(pointerX,pointerY);
          wave.rotation.z=-.055+Math.sin(time*.22)*.018;
          wave.position.y=-1.12+Math.sin(time*.31)*.045;
          camera.position.x=pointerX*.12;
          camera.position.y=.08-pointerY*.075;
          camera.lookAt(0,-.04,0);
          renderer.render(scene,camera);
        };

        const animate=(timestamp:number)=>{
          if(!scrolling&&timestamp-lastRender>=targetFrameTime){
            render(timestamp);
            lastRender=timestamp;
          }
          if(visible&&!motionQuery.matches)frame=requestAnimationFrame(animate);
        };

        const restart=()=>{
          cancelAnimationFrame(frame);
          lastRender=0;
          if(motionQuery.matches){
            targetX=0;
            targetY=0;
            pointerX=0;
            pointerY=0;
            render(3200);
          }else if(visible){
            frame=requestAnimationFrame(animate);
          }
        };

        const resize=()=>{
          const bounds=root.getBoundingClientRect();
          const width=Math.max(1,bounds.width);
          const height=Math.max(1,bounds.height);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,lowPower?.85:1));
          renderer.setSize(width,height,false);
          camera.aspect=width/height;
          camera.updateProjectionMatrix();
          render(motionQuery.matches?3200:performance.now());
        };

        const onPointerMove=(event:PointerEvent)=>{
          if(coarseQuery.matches||motionQuery.matches)return;
          const bounds=section.getBoundingClientRect();
          targetX=((event.clientX-bounds.left)/bounds.width-.5)*2;
          targetY=((event.clientY-bounds.top)/bounds.height-.5)*2;
        };
        const onPointerLeave=()=>{targetX=0;targetY=0};
        const onMotionChange=()=>restart();
        const onScroll=()=>{
          scrolling=true;
          window.clearTimeout(scrollTimer);
          scrollTimer=window.setTimeout(()=>{
            scrolling=false;
            lastRender=0;
          },140);
        };
        const onContextLost=(event:Event)=>{
          event.preventDefault();
          root.classList.remove('isWebglReady');
          root.classList.add('isFallback');
          cancelAnimationFrame(frame);
        };

        const resizeObserver=typeof ResizeObserver==='undefined'?null:new ResizeObserver(resize);
        resizeObserver?.observe(root);
        if(!resizeObserver)window.addEventListener('resize',resize);
        const intersectionObserver=typeof IntersectionObserver==='undefined'?null:new IntersectionObserver(entries=>{
          visible=entries[0]?.isIntersecting??true;
          restart();
        },{threshold:.04});
        intersectionObserver?.observe(section);
        section.addEventListener('pointermove',onPointerMove);
        section.addEventListener('pointerleave',onPointerLeave);
        window.addEventListener('scroll',onScroll,{passive:true});
        motionQuery.addEventListener('change',onMotionChange);
        canvas.addEventListener('webglcontextlost',onContextLost);

        resize();
        root.classList.add('isWebglReady');
        restart();

        release=()=>{
          cancelAnimationFrame(frame);
          window.clearTimeout(scrollTimer);
          resizeObserver?.disconnect();
          intersectionObserver?.disconnect();
          if(!resizeObserver)window.removeEventListener('resize',resize);
          section.removeEventListener('pointermove',onPointerMove);
          section.removeEventListener('pointerleave',onPointerLeave);
          window.removeEventListener('scroll',onScroll);
          motionQuery.removeEventListener('change',onMotionChange);
          canvas.removeEventListener('webglcontextlost',onContextLost);
          waterGeometry.dispose();
          waterMaterial.dispose();
          waveGeometry.dispose();
          waveMaterial.dispose();
          renderer.dispose();
          root.classList.remove('isWebglReady');
        };
      }catch{
        if(!disposed)root.classList.add('isFallback');
      }
    };

    let preloadObserver:IntersectionObserver|null=null;
    const start=()=>{
      if(started||disposed)return;
      started=true;
      preloadObserver?.disconnect();
      void init();
    };
    preloadObserver=typeof IntersectionObserver==='undefined'?null:new IntersectionObserver(entries=>{
      if(entries[0]?.isIntersecting)start();
    },{rootMargin:'360px 0px',threshold:0});
    if(preloadObserver)preloadObserver.observe(section);else start();

    return()=>{
      disposed=true;
      preloadObserver?.disconnect();
      release();
    };
  },[accent]);

  return <div ref={rootRef} className="dnaBackdrop" aria-hidden="true"><canvas ref={canvasRef}/><span className="dnaBackdropAtmosphere"/></div>;
}
