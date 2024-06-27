// ParticleBackground.tsx
"use client";
import React, { useEffect } from 'react';
import { tsParticles } from '@tsparticles/engine';
import { loadSeaAnemonePreset } from '@tsparticles/preset-sea-anemone';


const ParticleBackground: React.FC = () => {
    useEffect(() => {
        (async () => {
            await loadSeaAnemonePreset(tsParticles);

            await tsParticles.load({
                id: "tsparticles",
                options: {
                    preset: "seaAnemone",
                },
            });
        })();
    }, []);

    return <div id="tsparticles" className="absolute inset-0 z-0" />;
};

export default ParticleBackground;
