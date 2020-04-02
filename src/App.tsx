import React, { useCallback, useState } from 'react';
import { Vector3, Effect, PostProcess, Color3, Color4, ArcRotateCamera } from '@babylonjs/core';
import { Engine, Scene } from 'react-babylonjs';
import { CreatedInstance } from 'react-babylonjs/dist/CreatedInstance'
import Grid from '@material-ui/core/Grid';
import ColorSpaceSelector, { ColorSpaces, ColorSpaceRGB } from './ColorSpaceSelector';
import './App.css';
import { Typography, Button } from '@material-ui/core';
import { useEffect } from 'react';

Effect.ShadersStore["customFragmentShader"] = `
    #ifdef GL_ES
        precision highp float;
    #endif

    // Samplers
    varying vec2 vUV;
    uniform sampler2D textureSampler;

    // Parameters
    uniform vec3 rVec;
    uniform vec3 gVec;
    uniform vec3 bVec;

    void main(void) 
    {
      vec3 color = texture2D(textureSampler, vUV).rgb;

      mat3 colorMatrix;
			colorMatrix[0] = rVec;
			colorMatrix[1] = gVec;
			colorMatrix[2] = bVec;

      vec3 res = colorMatrix * color;
      gl_FragColor = vec4(res, 1.0);
    }
    `;
let postProcess: PostProcess | undefined = undefined;

// These are all is a wikipedia CC0 commons license images (search )
const textures = [
  {
    name: 'Image 3',
    fileName: 'Ishihara_9.png'
  }, {
    name: 'Image 4',
    fileName: 'Ishihara_23.png'
  }, {
    name: 'Image 1',
    fileName: 'Ishihara_1.png'
  }, {
    name: 'Image 2',
    fileName: 'Ishihara_2.png'
  }
]

function App() {
  const [selectedColorSpace, setSelectedColorSpace] = useState<ColorSpaceRGB>(ColorSpaces.find(cs => cs.name === 'Normal')!);
  const [selectedImageIndex, setImageIndex] = useState<number>(0);

  const onColorSpaceSelected = (colorSpaceName: string) => {
    const newColorSpace = ColorSpaces.find(cs => cs.name === colorSpaceName)!;
    setSelectedColorSpace(newColorSpace)
  }

  const cameraRef = useCallback((node: CreatedInstance<ArcRotateCamera>) => {
    const camera: ArcRotateCamera = node.hostInstance!;
    postProcess = new PostProcess("My custom post process", "custom", ["rVec", "gVec", "bVec"], null, 1.0 /* full size */, camera);
    postProcess.onApply = (effect: Effect) => {
      effect.setVector3('rVec', selectedColorSpace!.rVec);
      effect.setVector3('gVec', selectedColorSpace!.gVec);
      effect.setVector3('bVec', selectedColorSpace!.bVec);
    };
  }, []);

  useEffect(() => {
    if (postProcess) {
      postProcess!.onApply = (effect: Effect) => {
        effect.setVector3('rVec', selectedColorSpace!.rVec);
        effect.setVector3('gVec', selectedColorSpace!.gVec);
        effect.setVector3('bVec', selectedColorSpace!.bVec);
      };
    }
  }, [selectedColorSpace]);

  const onButtonClicked = () => {
    setImageIndex((selectedImageIndex + 1) % textures.length);
  }

  return (
    <Grid container spacing={0} style={{height: '100%'}}>
      <Grid item xs={12} sm={4}>
        <Typography>Choose Color Space</Typography>
        <ColorSpaceSelector onColorSpaceSelected={onColorSpaceSelected} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Typography>Current image:</Typography>
        <strong>{textures[selectedImageIndex].name}</strong>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Button onClick={onButtonClicked} variant="outlined">Next Image »</Button>
      </Grid>
      <Grid item xs={12} style={{height: '100%'}}>
        <Engine antialias={true} adaptToDeviceRatio={true} canvasId="sample-canvas">
          <Scene clearColor={Color4.FromColor3(Color3.FromHexString('#777777'))}>
            <arcRotateCamera ref={cameraRef} name="arc" target={ new Vector3(0, 1, 0) }
                  alpha={Math.PI / 2} beta={Math.PI / 2}
                  radius={600} minZ={0.001} wheelPrecision={50} 
                  lowerRadiusLimit={0.1} />
            <hemisphericLight name='hemi' direction={new Vector3(0, 0.25, 0.25)} intensity={0.8} />

            <plane name='test-image' size={512} rotation={new Vector3(0, Math.PI, 0)}>
              <standardMaterial name='test-mat' backFaceCulling={false}>
                <texture key={textures[selectedImageIndex].fileName} assignTo='diffuseTexture' url={`${process.env.PUBLIC_URL}/assets/${textures[selectedImageIndex].fileName}`} hasAlpha />
              </standardMaterial>
            </plane>
          </Scene>
        </Engine>
      </Grid>
    </Grid>
  );
}

export default App;
