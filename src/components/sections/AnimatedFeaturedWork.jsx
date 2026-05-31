'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/dist/Draggable';
import { projects } from '@/data/portfolio';

gsap.registerPlugin(Draggable);

export default function AnimatedFeaturedWork() {
  const containerRef = useRef(null);
  const boxesRef = useRef(null);
  const animationRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !boxesRef.current) return;

    const container = containerRef.current;
    const boxes = boxesRef.current;

    // Set initial positions
    gsap.set('.box', {
      yPercent: -50,
    });

    const STAGGER = 0.1;
    const DURATION = 1;
    const BOXES = gsap.utils.toArray('.box');

    const LOOP = gsap.timeline({
      paused: true,
      repeat: -1,
      ease: 'none',
    });

    const SHIFTS = [...BOXES, ...BOXES, ...BOXES];

    SHIFTS.forEach((BOX, index) => {
      const BOX_TL = gsap
        .timeline()
        .set(BOX, {
          xPercent: 250,
          rotateY: -50,
          opacity: 0,
          scale: 0.5,
        })
        // Opacity && Scale
        .to(
          BOX,
          {
            opacity: 1,
            scale: 1,
            duration: 0.1,
          },
          0
        )
        .to(
          BOX,
          {
            opacity: 0,
            scale: 0.5,
            duration: 0.1,
          },
          0.9
        )
        // Panning
        .fromTo(
          BOX,
          {
            xPercent: 250,
          },
          {
            xPercent: -350,
            duration: 1,
            immediateRender: false,
            ease: 'power1.inOut',
          },
          0
        )
        // Rotations
        .fromTo(
          BOX,
          {
            rotateY: -50,
          },
          {
            rotateY: 50,
            immediateRender: false,
            duration: 1,
            ease: 'power4.inOut',
          },
          0
        )
        // Scale && Z
        .to(
          BOX,
          {
            z: 100,
            scale: 1.25,
            duration: 0.1,
            repeat: 1,
            yoyo: true,
          },
          0.4
        )
        .fromTo(
          BOX,
          {
            zIndex: 1,
          },
          {
            zIndex: BOXES.length,
            repeat: 1,
            yoyo: true,
            ease: 'none',
            duration: 0.5,
            immediateRender: false,
          },
          0
        );
      LOOP.add(BOX_TL, index * STAGGER);
    });

    const CYCLE_DURATION = STAGGER * BOXES.length;
    const START_TIME = CYCLE_DURATION + DURATION * 0.5;

    const LOOP_HEAD = gsap.fromTo(
      LOOP,
      {
        totalTime: START_TIME,
      },
      {
        totalTime: `+=${CYCLE_DURATION}`,
        duration: 1,
        ease: 'none',
        repeat: -1,
        paused: true,
      }
    );

    // Update position based on current index
    const updatePosition = (index) => {
      const position = (index % BOXES.length) * (1 / BOXES.length);
      LOOP_HEAD.totalTime(position * LOOP_HEAD.duration());
    };

    // Initialize position
    updatePosition(currentIndex);

    const NEXT = () => {
      const newIndex = (currentIndex + 1) % BOXES.length;
      setCurrentIndex(newIndex);
      updatePosition(newIndex);
    };

    const PREV = () => {
      const newIndex = (currentIndex - 1 + BOXES.length) % BOXES.length;
      setCurrentIndex(newIndex);
      updatePosition(newIndex);
    };

    // Keyboard navigation
    const handleKeyDown = (event) => {
      if (event.code === 'ArrowLeft' || event.code === 'KeyA') PREV();
      if (event.code === 'ArrowRight' || event.code === 'KeyD') NEXT();
    };

    // Click on box navigation
    const handleBoxClick = (e) => {
      const BOX = e.target.closest('.box');
      if (BOX) {
        const TARGET = BOXES.indexOf(BOX);
        setCurrentIndex(TARGET);
        updatePosition(TARGET);
      }
    };

    // Button navigation
    const nextBtn = container.querySelector('.next');
    const prevBtn = container.querySelector('.prev');
    
    if (nextBtn) nextBtn.addEventListener('click', NEXT);
    if (prevBtn) prevBtn.addEventListener('click', PREV);

    // Set initial visibility
    gsap.set('.box', { display: 'block' });
    gsap.set('button', {
      z: 200,
    });

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    boxes.addEventListener('click', handleBoxClick);

    // Store references for cleanup
    animationRef.current = {
      LOOP_HEAD,
      LOOP,
      handleKeyDown,
      handleBoxClick,
      nextBtn,
      prevBtn,
    };

    return () => {
      // Cleanup
      if (animationRef.current) {
        const { LOOP_HEAD, LOOP, handleKeyDown, handleBoxClick, nextBtn, prevBtn } = animationRef.current;
        
        document.removeEventListener('keydown', handleKeyDown);
        boxes.removeEventListener('click', handleBoxClick);
        
        if (nextBtn) nextBtn.removeEventListener('click', NEXT);
        if (prevBtn) prevBtn.removeEventListener('click', PREV);
        
        if (LOOP_HEAD) LOOP_HEAD.kill();
        if (LOOP) LOOP.kill();
      }
    };
  }, [currentIndex]);

  // Get first 4 projects for the carousel
  const featuredProjects = projects.slice(0, 4);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Title Section */}
      <div className="relative z-10 text-center py-20">
        <h2 className="text-6xl font-bold text-white mb-4">Featured Work</h2>
        <p className="text-xl text-white/80">Use buttons, keyboard, or click projects to explore</p>
      </div>

      {/* 3D Carousel Container */}
      <div ref={boxesRef} className="boxes relative h-[600px] flex items-center justify-center" style={{ perspective: '1000px' }}>
        <div className="drag-proxy absolute inset-0 z-10" />
        
        {/* Project Boxes */}
        {featuredProjects.map((project, index) => (
          <div
            key={project.title}
            className="box absolute w-80 h-96 bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl cursor-pointer transform-gpu"
            style={{
              transform: 'translateY(-50%)',
              display: 'none',
            }}
          >
            <div className="p-6 h-full flex flex-col">
              {/* Video Thumbnail */}
              <div className="flex-1 rounded-lg overflow-hidden mb-4 bg-black/50">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Project Info */}
              <div className="text-white">
                <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                <p className="text-sm text-purple-300 mb-2">{project.category}</p>
                <p className="text-sm text-white/80 mb-3 line-clamp-2">{project.description}</p>
                <p className="text-xs text-blue-300">{project.software}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="relative z-20 flex justify-center gap-4 pb-20">
        <button className="prev px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-lg">
          ← Previous
        </button>
        <button className="next px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-lg">
          Next →
        </button>
      </div>

      {/* Instructions */}
      <div className="relative z-10 text-center pb-10">
        <p className="text-white/60 text-sm">
          Use arrow keys, buttons, or click projects to navigate • No scroll dependency
        </p>
      </div>
    </div>
  );
}
